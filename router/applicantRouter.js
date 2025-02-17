const { Router } = require("express")
const multer = require("../middleware/multer")
const { applyNow, getApplicants } = require("../controller/applicantController")

const router = Router()

router.post("/user/applyNow",
    multer.single('cv'),
    applyNow
)

router.get("/user/getApplicants",
    getApplicants
)

module.exports = router
