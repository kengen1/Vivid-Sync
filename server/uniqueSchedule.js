/*
    PURPOSE:
    - validation of existing schedules to ensure that any new schedule being created does not overlap existing start and end times
*/

const mongoose = require('mongoose');
const scheduleFunctions = require('./schedule');

function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

async function checkUniqueSchedule(stime, date) {
  try {
    // ensure MongoDB connection is established
    await scheduleFunctions.connectToMongoDB();

    // convert stime to minutes for comparison
    const stimeInMinutes = convertTimeToMinutes(stime);

    // fetch all schedules on the specified date
    const schedulesOnDate = await scheduleFunctions.Schedule.find({ date: date });

    // iterate over each schedule to check for time conflicts
    for (const schedule of schedulesOnDate) {
      const scheduleStimeInMinutes = convertTimeToMinutes(schedule.stime);
      const scheduleEtimeInMinutes = convertTimeToMinutes(schedule.etime);

      if (stimeInMinutes >= scheduleStimeInMinutes && stimeInMinutes <= scheduleEtimeInMinutes) {
        console.log('The start time conflicts with another schedule.');
        return false; // Not unique
      }
    }

    // if no conflicts, the schedule is unique
    return true;
  } catch (error) {
    console.error('Error checking unique schedule:', error);
    throw error;
  }
}

module.exports = {
  checkUniqueSchedule
};