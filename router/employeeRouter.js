const { Router } = require("express")
const multer = require("../middleware/multer")
const { getAllEmployees, updateEmployee , deleteEmployee} = require("../controller/employeeController")

const router = Router()



router.get("/user/getAllEmp/:employeeId",
    getAllEmployees
)

router.put("/user/updateEmloyee",
    updateEmployee
)

router.delete("/user/deleteEmployee/:employeeId",
deleteEmployee
)

module.exports = router