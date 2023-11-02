/*
    PURPOSE:
    - create and/or add on to a collection in the database called Schedule
    - remove items from the collection (table)
    - define these functions for endpoints in index.js to utilize
*/

const mongoose = require('mongoose');

// wil need to be changed for future groups
const uri = "";

// define schema
const ScheduleSchema = new mongoose.Schema({
    author: String,
    title: String,
    date: Date,
    stime: String,
    etime: String,
    brightness: Number,
    images: [String],
    author: String
});

const Schedule = mongoose.model('Schedule', ScheduleSchema, 'schedule');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

module.exports = {
    connectToMongoDB,
    Schedule   // exporting Schedule model
};