const Attendance = require('../modal/attendance');

const markAttendance = async (req, res) => {
    try {
        const attendanceData = req.body;

        // Validate input
        if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
            return res.status(400).json({ message: 'Invalid input data', statusCode: 400 });
        }

        // Initialize counters and messages
        let alreadyMarkedCount = 0;
        let markedSuccessfullyCount = 0;

        // Iterate over each attendance record and process it
        for (const record of attendanceData) {
            const { userId, date, checkIn, checkout, status, remark } = record;

            // Check if attendance is already marked for the given userId and date
            const existingAttendance = await Attendance.findOne({ userId, date });

            if (existingAttendance) {
                alreadyMarkedCount++;
            } else {
                // Create new Attendance instance
                const data = new Attendance({
                    userId,
                    date,
                    checkIn,
                    checkout,
                    status,
                    remark
                });

                // Save the attendance record
                await data.save();
                markedSuccessfullyCount++;
            }
        }

        // Create response message
        let message = 'Processing completed.';
        if (alreadyMarkedCount > 0) {
            message += ` Attendance already marked.`;
        }
        if (markedSuccessfullyCount > 0) {
            message += ` Attendance marked successfully.`;
        }

        return res.status(200).json({ message, statusCode: 200 });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}`, statusCode: 500 });
    }
};

const getAttendance = async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;
        let query = {};

        if (userId) {
            query.userId = userId;
        }

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else {
            return res.status(400).json({ message: 'Please provide both startDate and endDate', statusCode: 400 });
        }

        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: 'No attendance records found', statusCode: 404 });
        }

        return res.status(200).json({ data: attendanceRecords, statusCode: 200 });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}`, statusCode: 500 });
    }
};

const updateAttendanceForDate = async (req, res) => {
    try {
        const { userId, date, status } = req.body;

        // Validate input
        if (!userId || !date || !status) {
            return res.status(400).json({ message: 'Missing required fields', statusCode: 400 });
        }

        // Find the attendance record
        const attendanceRecord = await Attendance.findOne({ userId, date });

        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance record not found', statusCode: 404 });
        }

        // Update the status
        attendanceRecord.status = status;
        await attendanceRecord.save();

        return res.status(200).json({ message: 'Attendance updated successfully', statusCode: 200 });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}`, statusCode: 500 });
    }
};

module.exports = {
    markAttendance,
    getAttendance,
    updateAttendanceForDate
};
