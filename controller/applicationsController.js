const userApplications = require("../modal/applications");
const cloudinary = require("../cloud/cloundinary")
const nodemailer = require('nodemailer');

const addApplication = async (req, res) => {

    const { name, email, subject, message, submitted_by } = req.body
    const { file } = req;

    const doc = file?.path;
    let applicantion

    console.log(doc)

    try {

        if (email === undefined && message === undefined) {
            return res.status(400).json({ statusCode: 400, message: "email and description are compulsory" });
        }
        else {
            applicantion = new userApplications({ name, email, subject, message })

            if (submitted_by !== null) {
                if (doc) {
                    const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                        pages: true,
                        folder: 'FYP/Applications',
                        resource_type: 'auto'
                    });
                    applicantion.attachment = { url, public_id };
                }
                applicantion.submitted_by = submitted_by;
            }
            applicantion.save()
            res.status(200).json({ statusCode: 200, message: "application added successfully" })
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server Error", error })
    }
}
const getApplications = async (req, res) => {

    try {

        let applications = await userApplications.find()
        if (applications)
            res.status(200).json({ statusCode: 200, applications })
        else
            res.status(404).json({ statusCode: 404, message: "no application found" })

    }
    catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server Error", error })
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammadshaheer34222@gmail.com',
        pass: 'qdnl buqv pqbw fbaz'
    }
});

const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    const { file } = req;
    console.log("first" , to, subject, text ,file)

    const mailOptions = {
        from: 'mohammadshaheer34222@gmail.com',
        to,
        subject,
        text,
        attachments: file ? [
            {
                filename: file.originalname,
                path: file.path
            }
        ] : []
    };

    console.log(mailOptions)

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Error sending email', details: error.message });
    }
};

module.exports = {
    addApplication,
    getApplications,
    sendEmail
}
