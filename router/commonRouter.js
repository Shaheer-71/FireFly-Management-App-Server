const { Router } = require("express")
const multer = require("../middleware/multer")
const { Feedback, checkFeedback } = require("../controller/feebackController")


const router = Router()

router.post("/user/addFeedback",
    multer.single('image'),
    Feedback,
)

router.get("/user/checkFeedback",
    checkFeedback,
)

module.exports = router

