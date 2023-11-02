/*
  PURPOSE:
  - utilize AWS SDK api to manipulate S3 bucket
  - function definitions for uploading, retrieving and deleting objects
*/

require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');

// you will need to access the .env for the server and replace the values in there with your own group S3 bucket
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey
});

module.exports = {
  uploadToS3: async (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  deleteLocalFile: (filePath) => {
    fs.unlinkSync(filePath);
  },

  listObjects: async () => {
    const params = {
      Bucket: bucketName
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      return data.Contents;
    } catch (error) {
      throw error;
    }
  },

  deleteObjects: async (objectKeys) => {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: objectKeys.map((key) => ({ Key: key })),
        Quiet: false // Set to true to suppress errors if some objects don't exist
      }
    };

    try {
      const data = await s3.deleteObjects(params).promise();
      return data.Deleted; // Returns an array of deleted objects
    } catch (error) {
      throw error;
    }
  }
};
