const { Router } = require("express")
const multer = require("../middleware/multer")
const { registerUser, Signin, verifyToken, getAllEmployee, updateFCMToken, removeFCMToken, getAllEmployees } = require("../controller/authController")



const router = Router()

router.post("/user/register",
    multer.single('image'),
    registerUser,
)

router.post("/user/signin",
    Signin,
)

router.post("/user/veifyToken",
    verifyToken,
)

router.get("/user/getAllEmployee",
    getAllEmployee,
)

router.put("/user/updateFCMToken",
    updateFCMToken,
)

router.post("/user/removeFCMToken",
    removeFCMToken,
)

router.get("/user/getAllEmployees/:_id",
    getAllEmployees,
)


module.exports = router