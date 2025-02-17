const io = require('socket.io')(5051);
const Message = require('./modal/message');
const cloudinary = require("./cloud/cloundinary")
const User = require("./modal/register");
const FCM = require("fcm-node")
const fs = require('fs');

const users = {};

function transformMessageData(dbMessage) {
    // console.log("Transformation", dbMessage)
    return {
        _id: dbMessage._id.toString(),
        text: dbMessage.message,
        createdAt: dbMessage.timestamp,
        receiver: dbMessage.receiver.toString(),
        sender: dbMessage.sender.toString(),
        user: {
            _id: dbMessage.sender.toString()
        },
        image: dbMessage.image || null,
        document: dbMessage.document || null,
    };
}

async function uploadBase64(image) {
    try {
        const { secure_url: url, public_id } = await cloudinary.uploader.upload(image, {
            resource_type: 'auto',
            folder: 'FYP/Messages',
        });
        return { url, public_id };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

const sendPushNotification = async (title, message , token) => {
    const serverKey = process.env.FIREBASE_KEY;
    const fcm = new FCM(serverKey);

    const flattenedFcmTokens = [].concat(...token);
    const uniqueFcmTokens = [...new Set(flattenedFcmTokens)];

    uniqueFcmTokens.forEach(fcmToken => {
        const messagePayload = {
            to: fcmToken,
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

const socketIO = () => {
    console.log("Socketio listening at Port 5051");

    io.on("connection", socket => {
        socket.on('new-user-joined', name => {
            users[socket.id] = name;
            socket.broadcast.emit("user-joined");
        });

        socket.on("send", async messageArray => {
            try {
                const message = messageArray[0];
                const { text, receiver, sender, image, document } = message;
                const senderName = await User.findById(receiver, 'name -_id');
                const recieverToken = await User.findById(sender, 'fcmToken -_id');


                console.log("HI ", recieverToken , senderName)

                // if(document){
                //     fs.writeFile('base64Doc.txt', document, (err) => {
                //         if (err) {
                //             console.error('Error writing to file:', err);
                //         } else {
                //             console.log('Base64 written to file successfully.');
                //         }
                //     });
                // }


                let savedMessage = new Message({
                    message: text || '',
                    image: image || '',
                    document: document || '',
                    sender: sender,
                    receiver: receiver,
                });

                const formattedMessage = transformMessageData(savedMessage);
                io.emit('receive', { message: formattedMessage, name: users[socket.id] });

                // if (image) {
                //     const { url, public_id } = await uploadBase64(image)
                //     savedMessage.image = url
                //     savedMessage.image_id = public_id
                //     console.log("hello : ", url)
                // }

                // if (document) {
                //     const { url, public_id } = await uploadBase64(document)
                //     savedMessage.document = url
                //     savedMessage.document_id = public_id
                //     console.log("hello : ", url , public_id)
                // }

                const title = `${senderName.name} sent you a message`
                sendPushNotification(title, text , recieverToken.fcmToken)
                // await savedMessage.save()

            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
    });
};

module.exports = socketIO;
