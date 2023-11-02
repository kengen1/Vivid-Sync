/*
    PURPOSE:
    - function definitions for sending basic pings to flask server on the raspberry pi
    - determine whether the flask server is online or offline (ready to receive schedule data)
*/

const axios = require('axios');
const cron = require('node-cron');


// publicly accessibly IP address of raspberry pi and the relevant endpoint for the flask server
const PI_PING_URL = 'http://10.0.0.167:80/ping';

let piStatus = "offline";

async function checkPiStatus() {
    try {
        const response = await axios.get(PI_PING_URL);
        if(response.status === 200) {
            piStatus = "online";
        } else {
            piStatus = "offline";
        }
    } catch (error) {
        piStatus = "offline";
    }
}

function startPingScheduler() {
    // Ping Raspberry Pi every minute to check its status
    cron.schedule('* * * * *', checkPiStatus);
}

function getPiStatus() {
    return piStatus;
}

module.exports = {
    startPingScheduler,
    getPiStatus
};
