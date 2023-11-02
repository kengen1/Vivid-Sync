/*
    PURPOSE:
    - create and/or add on to a collection in the database called File
    - remove items from the collection (table)
    - define these functions for endpoints in index.js to utilize
*/

const mongoose = require('mongoose');


// mongodb uri --> future groups will need to create their own database and implement that
const uri = "";


// define schema
const FileSchema = new mongoose.Schema({
    fileName: String,
    source: String,
    s3URL: String,
    uploadDate: Date,
    hexArray: [String]
});

const File = mongoose.model('File', FileSchema, 'file');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

// function to delete multiple records by their IDs
// function to delete multiple records by their file names
const deleteImages = async (fileNames) => {
    try {
        const result = await File.deleteMany({ fileName: { $in: fileNames } });
        console.log(`Deleted ${result.deletedCount} images`);
    } catch (error) {
        console.error("Error deleting images:", error);
        throw error;
    }
};


module.exports = {
    connectToMongoDB,
    File,
    deleteImages,
};
