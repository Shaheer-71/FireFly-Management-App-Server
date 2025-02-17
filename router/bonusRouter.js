const { Router } = require("express")
const { addBonus , getBonus} = require("../controller/bonusController")


const router = Router()


router.post("/user/addBonus",
    addBonus
)

router.get("/user/getBonus/:userId",
    getBonus
)



module.exports = router