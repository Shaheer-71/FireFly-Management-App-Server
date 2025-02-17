const Message = require("../modal/message")

const getAllMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        const messages = await Message.find({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        });

        if (!messages) {
            return res.status(404).json({ message: "No conversation found", statusCode: 404 });
        }

        let formattedMessages = messages.map((message) => ({
            _id: message._id,
            createdAt: message.timestamp,
            receiver: message.receiver,
            sender: message.sender,
            text: message.message,
            user: { _id: message.sender },
            image: message.image,
            document : message.document
        }));

        formattedMessages = formattedMessages.sort((a, b) => b.createdAt - a.createdAt)
        res.status(200).json({ messages: formattedMessages, statusCode: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
};


module.exports = {
    getAllMessages
}