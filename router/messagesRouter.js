const { Router } = require("express")
const multer = require("../middleware/multer")
const { getAllMessages } = require("../controller/messageController")

const router = Router()

router.post("/user/getAllMessages",
getAllMessages,
)

module.exports = router