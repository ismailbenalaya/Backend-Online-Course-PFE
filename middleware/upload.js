// Import required modules
const path = require('path');
const multer = require('multer');

// Configure multer storage settings
var storage = multer.diskStorage({
   destination: path.join(__dirname, '../uploads'),
   filename: (req,file, cb) => {
    cb(null, Date.now()+'-'+file.originalname)
   },
});

// Initialize multer with the configured storage settings
var uploads = multer({
    storage: storage});

// Export the configured multer instance
module.exports = uploads;
