/*
    PURPOSE:
    - function definitions for sending hexArray information to flask server on the raspberry pi
    - these functions determine what is to be displayed on the LED strip board
*/

const axios = require('axios');
const cron = require('node-cron');
const moment = require('moment-timezone');
const scheduleFunctions = require('./schedule');
const { File } = require('./file');  // importing the File model

// public ip of the raspberry pi (will need to be changed to reflect whatever network the pi is hosted on in the future)
const PI_URL = 'http://10.0.0.167:80/data';


// schedule checker which checks every minute if a schedule exists with a start time == current time
cron.schedule('* * * * *', async function() {
    console.log('Running scheduler task...');

    await scheduleFunctions.connectToMongoDB();

    const currentTime = moment.tz("Australia/Sydney");
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    //console.log(`Current time is ${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);

    const formattedDate = currentTime.format('YYYY-MM-DDT00:00:00.000+00:00');
    //console.log(`Current date is ${formattedDate}`);

    // perform the search in schedule to match stime with current time and date
    const schedules = await scheduleFunctions.Schedule.find({
        date: { $gte: formattedDate, $lte: formattedDate },
        stime: { $eq: `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}` }
    });

    //console.log(`Found ${schedules.length} schedules to process.`);

    // for each schedule found, retrieve the hexArray related to that file in the schedule
    for (let schedule of schedules) {
        for(let imageName of schedule.images) {
            const file = await File.findOne({ fileName: imageName });
            if(file && file.hexArray) {
                await sendToPi(file.hexArray, schedule.etime);  // Send the entire hexArray and etime as a single message
            }
        }
    }
});

// function for sending the hex array (message) and stime as a HTTP message to the flask server
async function sendToPi(message, etime) {
    try {
        const dataToSend = { message, etime };
        const response = await axios.post(PI_URL, dataToSend);
        console.log('Data sent to Raspberry Pi successfully:', response.data);
    } catch (error) {
        console.error('Error sending data to Raspberry Pi:', error);
    }
}

module.exports = {
    startScheduler: function() {
        console.log('Scheduler started...');
    },
    sendToPi
};
