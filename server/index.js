/*
  PURPOSE:
  - primary operations of the node server are performed from this file
  - all endpoints are defined here which point to relevant functions in other files of the server side code
*/

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const s3Functions = require('./s3');
const scheduleFunctions = require('./schedule');
const fileFunctions = require('./file');
const AWS = require('aws-sdk'); // Import AWS here
const signUpFunctions = require('./user');
const sessions = require('express-session');
const crypto = require('crypto');
const mongoose = require('mongoose');
const schedulerHttp = require('./sendPi');
const sendPi = require('./sendPi');
const pingPi = require('./pingPi');
const uniqueSchedule = require('./uniqueSchedule');
const moment = require('moment');


validateUser: async (email, password) => {
  try {
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found');
          return false;
      }

      const hash = crypto.createHash('sha256');
      hash.update(password);
      const hashPassword = hash.digest('hex');

      if (hashPassword === user.password) {
          console.log('User validated');
          return true;
      } else {
          console.log('Invalid password');
          return false;
      }
  } catch (error) {
      console.error("Error while validating user:", error);
      throw error;
  }
}

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const app = express();

// define the origin urls so the backend code can work for either local development of AWS deployment
const ALLOWED_ORIGINS = ["http://localhost:3000", "http://54.252.255.57"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// store the image locally and concatenate its filename with today's date and time
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });


// S3 upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const fileNameWithIdentifier = req.body.fileNameWithIdentifier; // Get the fileNameWithIdentifier from the form data

  try {
    // Call the uploadToS3 function from s3Functions module
    const s3Response = await s3Functions.uploadToS3(req.file.path, fileNameWithIdentifier); // Use fileNameWithIdentifier as the filename
    console.log(`Uploaded ${fileNameWithIdentifier} to S3. ETag: ${s3Response.ETag}`);

    // Delete local file
    s3Functions.deleteLocalFile(req.file.path);
    console.log(`Deleted local file: ${fileNameWithIdentifier}`);

    res.status(200).json({ message: "File uploaded and processed successfully." });
  } catch (error) {
    console.error(`Error processing ${fileNameWithIdentifier}:`, error);
    res.status(500).json({ error: "An error occurred while processing the file." });
  }
});

// S3 retrieve endpoint
app.get('/api/images', async (req, res) => {
  try {
    const s3 = new AWS.S3({ // Initialize AWS SDK here
      region,
      accessKeyId,
      secretAccessKey
    });

    const listObjectsResponse = await s3.listObjectsV2({
      Bucket: bucketName
    }).promise();

    // every image object will contain a pair (Key,URL)
    const imageUrlsWithKeys = listObjectsResponse.Contents.map((item) => {
      const imageUrl = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: item.Key
      });
      return { Key: item.Key, imageUrl };
    });

    res.status(200).json(imageUrlsWithKeys);
  } catch (error) {
    console.error('Error fetching image URLs:', error);
    res.status(500).json({ error: 'An error occurred while fetching image URLs.' });
  }
});

//S3 delete endpoint
app.post('/api/delete', async (req, res) => {
  try {
    // parse the object keys to delete from the request body
    const objectKeysToDelete = req.body.objectKeys;

    if (!objectKeysToDelete || !Array.isArray(objectKeysToDelete) || objectKeysToDelete.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty objectKeys parameter.' });
    }

    // call the deleteObjects function from s3Functions module
    const deletedObjects = await s3Functions.deleteObjects(objectKeysToDelete);
    console.log('Deleted objects:', deletedObjects);

    res.status(200).json({ message: 'Objects deleted successfully.', deletedObjects });
  } catch (error) {
    console.error('Error deleting objects:', error);
    res.status(500).json({ error: 'An error occurred while deleting objects.' });
  }
});

//generate random session key
const oneHour = 1000*60*60;
const generateRandomKey = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

//session middleware
const sessionSecret = generateRandomKey(32);
app.use(sessions({
    secret: sessionSecret,
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false
}));

var session;

// MongoDB signup page endpoint
app.post('/api/signUp', async (req, res) => {
  const username = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  console.log('firstName: ', username);
  console.log('lastName: ', lastName);
  console.log('email: ', email);
  console.log('password: ', password);

  try {
    await signUpFunctions.connectToMongoDB();

    const userAdded = await signUpFunctions.userExist(email);

    if (userAdded) {
      console.log('User already exists');
    } else {
      const user = await signUpFunctions.addUser(username, lastName, email, password);
      console.log('User registered');
    }

  } catch (error) {
    console.error("Error occurred during user registration:", error);
    res.status(500).send('Error occurred during user registration');
  } finally {
    signUpFunctions.DisconnectFromMongoDB();
  }
});

// MongoDB signup page endpoint
app.post('/api/userExists', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  console.log('Checking if user exists with email: ', email);

  try {
    await signUpFunctions.connectToMongoDB();
    const userExists = await signUpFunctions.userExist(email);

    if (userExists) {
      console.log('User already exists');
      res.status(200).send('User already exists');
    } else {
      console.log('User does not exist');
      res.status(404).send('User does not exist');
    }
  } catch (error) {
    console.error("Error occurred during user existence check:", error);
    res.status(500).send('Error occurred during user existence check');
  } finally {
    signUpFunctions.DisconnectFromMongoDB();
  }
});

// MongoDB login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  await signUpFunctions.connectToMongoDB();
  if (await signUpFunctions.validateUser(email, password)) {
    req.session.user={email};
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// Local storage remove session endpoint
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  console.log("Session destroyed");
  res.redirect('/');
});

// Local storage create session endpoint
app.get('/api/session', (req, res) => {
  if (req.session) {
      const email = req.session.user;
      res.json({ email: email });
  } else {
      console.log("No User");
      res.json({ email: null });
  }
});

// MongoDB find existing schedule endpoint
app.get('/api/schedule', async (req, res) => {
  try {
      scheduleFunctions.connectToMongoDB();
      const schedules = await scheduleFunctions.Schedule.find();
      res.json(schedules);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// MongoDB create new schedule endpoint
app.post('/api/schedule', (req, res) => {
  scheduleFunctions.connectToMongoDB();
  const schedule = new scheduleFunctions.Schedule(req.body);
  schedule.save()
      .then(result => {
          res.status(200).json(result);
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Server Error');
      });
});

// MongoDB retrieve file objects (imageURL and HexArray)
app.get('/api/file', async(req, res) => {
  try {
    fileFunctions.connectToMongoDB();
    const files = await fileFunctions.File.find();
    res.json(files);
} catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
}
});

// MongoDB create new file record in collection
app.post('/api/file', (req, res) => {
  fileFunctions.connectToMongoDB();
  const file = new fileFunctions.File(req.body);
  //console.log('email: ', req.email);
  file.save()
      .then(result => {
          res.status(200).json(result);
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Server Error');
      });
});

// MongoDB remove records from File collection
app.post('/api/deleteImages', async (req, res) => {
  try {
    // Parse the array of image IDs to delete from the request body
    const imageIdsToDelete = req.body.imageIds;

    if (!imageIdsToDelete || !Array.isArray(imageIdsToDelete) || imageIdsToDelete.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty imageIds parameter.' });
    }

    // Call the deleteImages function from fileFunctions module
    await fileFunctions.connectToMongoDB(); // Connect to the MongoDB database if not already connected
    await fileFunctions.deleteImages(imageIdsToDelete);

    res.status(200).json({ message: 'Images deleted successfully.' });
  } catch (error) {
    console.error('Error deleting images:', error);
    res.status(500).json({ error: 'An error occurred while deleting images.' });
  }
});

// PI flask server basic ping request
app.get('/api/piStatus', (req, res) => {
  const status = pingPi.getPiStatus();
  console.log('STATUS------', status);
  res.json({ status });
});

// PI flask server hexArray http request
app.post('/send-to-pi', async (req, res) => {
  try {
      const { message, etime } = req.body;
      if (!message || !etime) {
          return res.status(400).send('Bad Request: Missing message or etime in the request body');
      }

      await sendPi.sendToPi(message, etime);
      res.status(200).send('Data sent to Raspberry Pi successfully');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

// MongoDB check if new schedule element doesn't overlap with existing time ranges
app.post('/api/checkSchedule', async (req, res) => {
  const { stime, date } = req.body;

  if (!stime || !date) {
    return res.status(400).json({ error: 'stime and date are required' });
  }

  try {
    const isUnique = await uniqueSchedule.checkUniqueSchedule(stime, date);
    res.json({ isUnique });
  } catch (error) {
    console.error('Error checking schedule uniqueness:', error);
    res.status(500).json({ error: 'An error occurred while checking schedule uniqueness.' });
  }
});

// MongoDB remove schedule records from collection
app.delete('/api/schedule/:id', async (req, res) => {
  try {
    console.log('Deleting schedule with ID:', req.params.id);
    await scheduleFunctions.connectToMongoDB();
    const result = await scheduleFunctions.Schedule.findByIdAndDelete(req.params.id);
    if (!result) {
      console.log('Schedule not found');
      return res.status(404).send('Schedule not found');
    }
    console.log('Schedule deleted successfully');
    res.send('Schedule deleted successfully');
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).send('Server Error');
  }
});


// Node server running on port 3001
app.listen(3001, () => {
  console.log("Server is running");
  pingPi.startPingScheduler();
  schedulerHttp.startScheduler();
});
