const { Router } = require("express")
const multer = require("../middleware/multer")
const { createAnnouncements, getAllAnnouncements } = require("../controller/announcementController")

const router = Router()

router.post("/user/createAnnouncement",
    multer.single('attachment'),
    createAnnouncements
)

router.get("/user/getAllAnnouncements",
    getAllAnnouncements
)

module.exports = router