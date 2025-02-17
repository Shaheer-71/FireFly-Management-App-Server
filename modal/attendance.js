const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: String,
    required: true
  },
  checkout: {
    type: String,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave' , 'half leave'],
    required: true
  },
  remarks: {
    type: String
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
