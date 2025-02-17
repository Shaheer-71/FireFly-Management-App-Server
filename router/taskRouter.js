const { Router } = require("express");
const { getAllEmployeeTodo, AddTask, getAllTasks, getTasksByDate, getTasksByAssignee,deleteTask , turnInTask , editTaskSubmission} = require("../controller/taskController");
const upload = require("../middleware/multer");

const router = Router();

router.get("/user/getOnlyEmployee", getAllEmployeeTodo);
router.post("/user/addTask", upload.single('attachment'), AddTask);
router.get("/user/tasks", getAllTasks);
router.get("/user/getTasksByDate/:date", getTasksByDate); 
router.get("/user/getTasksByAssignee/:assigneeId", getTasksByAssignee); 
router.delete("/user/deleteTask/:taskId", deleteTask);
router.post("/user/turnInTask", upload.single('attachment'), turnInTask);
router.patch("/user/editTaskSubmission", upload.single('attachment'), editTaskSubmission);


module.exports = router;
