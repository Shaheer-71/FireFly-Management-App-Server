const userReport = require("../modal/feedback")
const cloudinary = require("../cloud/cloundinary")



const Feedback = async (req, res) => {
    const { catagory, email, description } = req.body;
    const { file } = req;


    try {
        const feedback = new userReport({ catagory, email, description });
        let image = file?.path;

        if (image) {
            const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path);
            feedback.image = { url, public_id };
        }

        await feedback.save();
        res.status(200).json({ message: "Feedback posted successfully" });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            // Handle the duplicate email error
            res.status(400).json({ message: "Email is already used, try different" });
        } else {
            // Handle other errors
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

const checkFeedback = async (req, res) => {
    try {
        const feedback = await userReport.find()
        res.status(200).json(feedback)

    } catch (error) {
        // Using 500 status code for server error. You can change it to 400 or another appropriate code if needed.
        res.status(500).json({ error: error, message: "Feedback not found" });
    }
}

module.exports = {
    Feedback,
    checkFeedback
}
