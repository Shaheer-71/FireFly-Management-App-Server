const userRegistration = require("../modal/register");
const cloudinary = require("../cloud/cloundinary")
const jwt = require("jsonwebtoken")
const secretKey = "employee__authentication"
const uuid = require('uuid');
const bycrypt = require("bcryptjs");


const registerUser = async (req, res) => {
    try {
        const { name, email, passcode, role, address, department, dob, contact, emergency_contact, experience, joining, nationality, posession, status, image } = req.body;
        const { file } = req;
        const fcmToken = uuid.v4();

        const alreadyExists = await userRegistration.find({ email: email });
        const hashedPasscode = await bycrypt.hash(passcode, 10);

        if (alreadyExists.length === 0) {

            const registration = new userRegistration({ name, email, passcode: hashedPasscode, role, address, department, dob, contact, emergency_contact, experience, joining, nationality, posession, status, fcmToken });


            if (image) {
                const { secure_url: url, public_id } = await cloudinary.uploader.upload(image, {
                    folder: 'FYP/Employees',
                    resource_type: 'image'
                });
                registration.image = { url, public_id };
            }



            console.log("hello ", registration)

            await registration.save();
            res.status(200).json({ message: "Registration successful!", data: registration , statusCode : 200});
        } else {
            res.status(400).json({ message: "User already exists with this email! Please try another one" });
        }
    } catch (error) {
        res.status(500).json({ message: "Registration failed!", error: error });
    }
};


const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            console.log("Unauthorize")
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log("Issue in verifying jwt", err);
                return res.status(403).json({ message: "Token verification failed", error: err.message });
            }

            const { userData } = decoded;
            res.status(200).json({ userData, message: "Verified" });
        });
    } catch (error) {
        res.status(500).json({ message: "Verification failed!", error });
    }
};

const Signin = async (req, res) => {
    try {
        const { email, passcode } = req.body;
        const user = await userRegistration.findOne({ email }).select('-fcmToken');

        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        const validPasscode = await bycrypt.compare(passcode, user.passcode);

        if (!validPasscode) {
            return res.status(401).json({ message: "Wrong password, try again" });
        }

        const token = jwt.sign(
            { userData: user },
            secretKey,
            { expiresIn: "1h" }
        );

        // Send the token as part of the response
        res.status(200).json({ message: "Sign-in successful", token });
    } catch (error) {
        res.status(500).json({ message: "Sign-in failed", error });
    }
};

const getAllEmployee = async (req, res) => {
    try {
        let users = await userRegistration.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found", statusCode: 404 });
        }

        const data = users.map((item) => (
            { label: item.name, value: item._id }
        ))

        return res.status(200).json({ data, statusCode: 200 });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve users", error });
    }
};

const updateFCMToken = async (req, res) => {
    const { user_id, fcmToken } = req.body
    try {
        if (fcmToken) {
            const updatedUser = await userRegistration.findByIdAndUpdate(
                user_id,
                {
                    $push: { fcmToken: fcmToken }
                },
                { new: true }
            );

            res.status(200).json({ message: "Fcm Token Update" })
        }
        else {
            res.status(400).json({ message: "No Fcm Token Found" })
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to update Fcm Token, Server Error", error })
    }
}

const removeFCMToken = async (req, res) => {
    const { user_id, fcmToken } = req.body
    try {

        const updatedUser = await userRegistration.findByIdAndUpdate(
            user_id,
            {
                $pull: { fcmToken: fcmToken }
            },
            { new: true }
        );

        if (!updatedUser)
            return res.status(400).json({ message: "Not removed Fcm Token" })

        res.status(200).json({ updatedUser })

    } catch (error) {
        res.status(500).json({ message: "Failed to update Fcm Token, Server Error", error })
    }
}

const getAllEmployees = async (req, res) => {
    try {
        const { _id } = req.params;

        const query = { _id: { $ne: _id } };

        const Users = await userRegistration.find(query).select('-fcmToken');

        if (!Users || Users.length === 0)
            return res.status(404).json({ message: "No other users found" });

        res.status(200).json({ Users });

    } catch (error) {
        res.status(500).json({ message: "Failed to update Fcm Token, Server Error", error });
    }
}








module.exports = {
    registerUser,
    Signin,
    verifyToken,
    getAllEmployee,
    updateFCMToken,
    removeFCMToken,
    getAllEmployees
}
