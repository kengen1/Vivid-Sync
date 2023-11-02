/*
    PURPOSE:
    - create and/or add on to a collection in the database called user
    - remove items from the collection (table)
    - define these functions for endpoints in index.js to utilize
*/

const mongoose = require('mongoose');
const crypto = require('crypto');

const uri = "";

// define schema for user table
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema, 'user');

module.exports = {
    connectToMongoDB: async () => {
        try {
            await mongoose.connect(uri , { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    },

    // creation of a new user
    addUser: async (firstname, lastname, email, password) => {
        try {
            const hash = crypto.createHash('sha256');
            hash.update(password);
            const hashPassword = hash.digest('hex');

            const user = new User({ firstname, lastname, email, password: hashPassword });
            await user.save();

            console.log("User added successfully");
        } catch (error) {
            console.error("Error while adding to MongoDB:", error);
            throw error;
        }
    },

    // cross reference log in details with existing records (hash password prior)
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
    },

    // prevent duplicate users with the same email
    userExist: async (email) => {
        try {
            const user = await User.findOne({ email });
            return !!user;
        } catch (error) {
            console.error("Error while querying MongoDB:", error);
            throw error;
        }
    },

    DisconnectFromMongoDB: async () => {
        try {
            await mongoose.connection.close();
            console.log("Disconnected From MongoDB");
        } catch (error) {
            console.error("Error disconnecting from MongoDB:", error);
            throw error;
        }
    },
}