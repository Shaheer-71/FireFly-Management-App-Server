const ApplyNow = require("../modal/applynow")
const cloudinary = require("../cloud/cloundinary");

const applyNow = async (req, res) => {
    try {
        const { name, dob, gender, email, phone, address, coverletter, company, currentjob, degree, field, year } = req.body;
        const { file } = req;

        const doc = file?.path;
        const application = new ApplyNow({ name, dob, gender, email, phone, address, coverletter, company, currentjob, degree, field, year });

        if (doc) {
            const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                pages: true,
                folder: 'FYP/ApplyNow',
                resource_type: 'auto'
            });
            application.cv = { url, public_id };
        }

        console.log("ABCDEFGHI : ", application)

        await application.save();

        res.status(201).json({ message: 'Application successfully created', application, status: 201 });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error, status: 400 });
        }
        res.status(500).json({ message: "Server Error", error, status: 500 });
    }
};

const getApplicants = async (req, res) => {
    try {
        const applcants = await ApplyNow.find()
        res.status(200).json(applcants)

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    applyNow,
    getApplicants
}