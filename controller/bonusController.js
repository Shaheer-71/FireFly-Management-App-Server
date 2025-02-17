const Bonus = require("../modal/bonus")
const User = require("../modal/register")
const nodemailer = require("nodemailer");


const sendMail = async (userInfo, month, amount, justification) => {
    console.log(userInfo); 
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background-color: #f2f2f2; padding: 10px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f2f2f2; padding: 10px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Bonus Award Notification</h1>
        </div>
        <div class="content">
            <h2>Dear ${userInfo.name},</h2>
            <p>We are pleased to inform you that your hard work and dedication have not gone unnoticed. As a token of our appreciation for your outstanding contributions during the month of ${month}, we have awarded you a bonus.</p>
            <p><strong>Bonus Amount:</strong> $${amount}</p>
            <p><strong>Justification:</strong> ${justification}</p>
            <p>We sincerely appreciate your efforts and hope this bonus serves as encouragement for your continued success with us.</p>
            <p>Thank you for your hard work!</p>
        </div>
        <div class="footer">
            <p>Best Regards,</p>
            <p>Your HR Team</p>
        </div>
    </body>
    </html>
    `;


    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jasmin.smitham0@ethereal.email',
            pass: 'VUS2Av5u1gYhEJgnaf'
        }
    });


    const info = await transporter.sendMail({
        from: '"HR Department" <mohammadshaheer3422@gmail.com>',
        to: userInfo.email,
        subject: `Appreciation of Work in ${month}`,
        html: htmlContent
    });

    return info
}



const addBonus = async (req, res) => {
    let bonus
    const { department, employee, role, amount, month, justification } = req.body

    try {
        if (!!department || !!employee || !!role || !!amount || !!month) {
            bonus = new Bonus({ department, employee, role, amount, month, justification })


            const userInfo = await User.findById(employee).select('name email');

            //sending mail
            const email = await sendMail(userInfo, month, amount, justification)

            await bonus.save()
            res.status(201).json({ message: "Bonus added successfully", statusCode: 201, email: email })

        }
        else {
            res.status(400).json({ message: "Incomplete information", statusCode: 400 })
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" + error, statusCode: 500 })
    }
}

const getBonus = async (req, res) => {

    const { userId } = req.params

    try {

        let userBonus = await Bonus.find({ employee: userId })

        if (userBonus) {
            userBonus = userBonus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            res.status(201).json({ message: userBonus, statusCode: 200 })
        }
        else
            res.status(404).json({ message: "No bonus found", statusCode: 404 })

    } catch (error) {
        res.status(500).json({ message: "Server Error" + error, statusCode: 500 })
    }
}


module.exports = {
    addBonus,
    getBonus
}