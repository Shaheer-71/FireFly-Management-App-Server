const { Router } = require("express");
const { markAttendance, getAttendance, updateAttendanceForDate } = require("../controller/attendanceController");

const router = Router();

router.post("/user/markAttendance", markAttendance);
router.get("/user/getAttendance", getAttendance);
router.patch("/user/updateAttendance", updateAttendanceForDate);

module.exports = router;
