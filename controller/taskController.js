const userRegistration = require("../modal/register");
const Task = require("../modal/Task");
const cloudinary = require("../cloud/cloundinary");
const TaskSubmission = require("../modal/TaskSubmission");

const getAllEmployeeTodo = async (req, res) => {
    try {
        let users = await userRegistration.find({ role: "employee" });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No employees found", statusCode: 404 });
        }

        const data = users.map((item) => (
            { label: item.name, value: item._id }
        ));

        return res.status(200).json({ data, statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve employees", error });
    }
};

const AddTask = async (req, res) => {
    try {
        const { title, description, date, deadline, department, assignee } = req.body;
        const { file } = req;

        const doc = file?.path;

        const newTask = new Task({
            title,
            description,
            date: date ? new Date(date) : null,
            deadline: deadline ? new Date(deadline) : null,
            department,
            assignee: assignee,
        });

        if (doc) {
            try {
                const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                    pages: true,
                    folder: 'FYP/Task',
                    resource_type: 'auto'
                });

                newTask.attachments = { url, public_id };
            } catch (error) {
                console.error('Cloudinary Error: ', error.message);
                return res.status(500).json({ message: "Error uploading file to Cloudinary", error: error.message, status: 500 });
            }
        }

        console.log(newTask);

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', statusCode: 201 });
    } catch (error) {
        res.status(500).json({ message: "Failed to create task", error });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        // Create a response array to hold tasks and their submissions if status is completed
        const tasksWithSubmissions = await Promise.all(tasks.map(async task => {
            let taskData = task.toObject(); // Convert Mongoose document to plain object
            if (task.status === 'completed') {
                const submission = await TaskSubmission.findOne({ taskId: task._id });
                taskData.submission = submission ? submission : null; // Add the submission data to the task object or set to null if not found
            } else {
                taskData.submission = null; // Ensure submission field is always present
            }
            return taskData;
        }));

        res.status(200).json({ tasks: tasksWithSubmissions, statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks", error });
    }
};

const getTasksByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const tasks = await Task.find({ date: new Date(date) });

        // Create a response array to hold tasks and their submissions if status is completed
        const tasksWithSubmissions = await Promise.all(tasks.map(async task => {
            let taskData = task.toObject(); // Convert Mongoose document to plain object
            if (task.status === 'completed') {
                const submission = await TaskSubmission.findOne({ taskId: task._id });
                taskData.submission = submission ? submission : null; // Add the submission data to the task object or set to null if not found
            } else {
                taskData.submission = null; // Ensure submission field is always present
            }
            return taskData;
        }));

        res.status(200).json({ tasks: tasksWithSubmissions, statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks for the given date", error });
    }
};

const getTasksByAssignee = async (req, res) => {
    try {
        const { assigneeId } = req.params;
        const tasks = await Task.find({ assignee: assigneeId });

        // Create a response array to hold tasks and their submissions if status is completed
        const tasksWithSubmissions = await Promise.all(tasks.map(async task => {
            let taskData = task.toObject(); // Convert Mongoose document to plain object
            if (task.status === 'completed') {
                const submission = await TaskSubmission.findOne({ taskId: task._id });
                taskData.submission = submission ? submission : null; // Add the submission data to the task object or set to null if not found
            } else {
                taskData.submission = null; // Ensure submission field is always present
            }
            return taskData;
        }));

        res.status(200).json({ tasks: tasksWithSubmissions, statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve tasks for the given assignee", error });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log("first", taskId)
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found", statusCode: 404 });
        }

        res.status(200).json({ message: "Task deleted successfully", statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
};

const turnInTask = async (req, res) => {
    try {
        const { repoLink, comments, taskId } = req.body;
        const { file } = req;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found", statusCode: 404 });
        }

        let attachments = {};
        if (file) {
            try {
                const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: 'FYP/TaskSubmissions',
                    resource_type: 'auto'
                });
                attachments = { url, public_id };
                console.log(attachments);
            } catch (error) {
                console.error('Cloudinary Error: ', error.message);
                return res.status(500).json({ message: "Error uploading file to Cloudinary", error: error.message });
            }
        }

        const newSubmission = new TaskSubmission({
            taskId,
            repoLink,
            comments,
            attachments,
        });

        task.status = 'completed';
        await task.save();
        await newSubmission.save();
        res.status(201).json({ message: 'Task submitted and status updated to completed successfully', statusCode: 201 });

    } catch (error) {
        res.status(500).json({ message: "Failed to submit task", error });
    }
};

const editTaskSubmission = async (req, res) => {
    try {
        const { repoLink, comments } = req.body;
        const taskId = req.body.taskId;
        const file = req.file;


        let submission = await TaskSubmission.findOne({ _id: taskId });

        if (!submission) {
            return res.status(404).json({ message: "Task submission not found", statusCode: 404 });
        }

        let attachments = submission.attachments;

        if (file) {
            try {
                const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: 'FYP/TaskSubmissions',
                    resource_type: 'auto'
                });
                attachments = { url, public_id };
            } catch (error) {
                console.error('Cloudinary Error: ', error.message);
                return res.status(500).json({ message: "Error uploading file to Cloudinary", error: error.message });
            }
        }

        submission.repoLink = repoLink || submission.repoLink;
        submission.comments = comments || submission.comments;
        submission.attachments = attachments;

        console.log("Updated Submission: ", submission);
        await submission.save();

        res.status(200).json({ message: 'Task submission updated successfully', statusCode: 200 });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task submission", error });
    }
};

module.exports = {
    getAllEmployeeTodo,
    AddTask,
    getAllTasks,
    getTasksByDate,
    getTasksByAssignee,
    deleteTask,
    turnInTask,
    editTaskSubmission
};


module.exports = {
    getAllEmployeeTodo,
    AddTask,
    getAllTasks,
    getTasksByDate,
    getTasksByAssignee,
    deleteTask,
    turnInTask,
    editTaskSubmission
};
