const Announcement = require("../modal/announcement")
const Users = require("../modal/register")
const cloudinary = require("../cloud/cloundinary");
const admin = require("firebase-admin");
const FCM = require("fcm-node");
const announcement = require("../modal/announcement");
require("dotenv").config()


const sendPushNotification = async (title, message) => {
    const serverKey = process.env.FIREBASE_KEY;
    const fcm = new FCM(serverKey);

    const users = await Users.find({}, 'fcmToken');
    //getting tokens from different users
    const fcmTokens = users.map(user => user.fcmToken);
    //converting multiple array into a single array
    const flattenedFcmTokens = [].concat(...fcmTokens);
    //remove duplicate token from an array
    const uniqueFcmTokens = [...new Set(flattenedFcmTokens)];

    uniqueFcmTokens.forEach(fcmToken => {
        const messagePayload = {
            to: fcmToken, // Send to a single FCM token
            notification: {
                title: title,
                body: message,
            },
        };

        fcm.send(messagePayload, (err, response) => {
            if (err) {
                console.error("Something went wrong:", err);
            } else {
                console.log("Notification sent successfully:", response);
            }
        });
    });
};

const createAnnouncements = async (req, res) => {
    try {
        const { date, time, title, message, user_id } = req.body;
        const { file } = req;

        const doc = file?.path;
        const announcement = new Announcement({ date, time, title, message, user_id });


        if (doc) {
            try {
                const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                    pages: true,
                    folder: 'FYP/Announcements',
                    resource_type: 'auto'
                });

                announcement.attachment = { url, public_id };

            } catch (error) {
                console.error('Cloudinary Error: ', error.message);
                return res.status(500).json({ message: "Error uploading file to Cloudinary", error: error.message, status: 500 });
            }
        }

        sendPushNotification(title, message)
        sendPushNotification(user_id, message)
        await announcement.save();
        res.status(201).json({ message: 'Application successfully created', announcement, status: 201 });

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error, status: 400 });
        }
        res.status(500).json({ message: "Server Error", error, status: 500 });
    }
}


const getAllAnnouncements = async (req, res) => {
    try {

        const announcements = await Announcement.find().lean()
        if (announcement.length > 0)
            return res.json({ message: announcements , status: 201 });

        else
            return res.json({ message: 'Application successfully created', status: 201 });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error, status: 500 });
    }

}

module.exports = {
    createAnnouncements,
    getAllAnnouncements
}