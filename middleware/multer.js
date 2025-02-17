const multer = require("multer")
const path = require('path');


//if empty then it will store in C:\\Users\\Dell\\AppData\\Local\\Temp\\97b8d33b42d2c7cef677186a8cc46e29
// const storage = multer.diskStorage({})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/2. FYP/Backend/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const combinedFileFilter = (req, file, cb) => {
    if (file.mimetype.includes("image")) {
        cb(null, true);

    } else if (
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/zip'
    ) {
        cb(null, true);
    } else {
        cb(('Invalid file type!'), false);
    }
};


module.exports = multer({ storage, fileFilter: combinedFileFilter });