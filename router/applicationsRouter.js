const { Router } = require("express")
const multer = require("../middleware/multer")
const { addApplication, getApplications, sendEmail } = require("../controller/applicationsController")

const router = Router()

router.post("/user/addApplication",
    multer.single('attachment'),
    addApplication
)

router.get("/user/getApplication",
    getApplications
)

router.post("/user/sendMail",
    multer.single('attachment'),
    sendEmail
)

module.exports = router

