const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Get the original filename without extension
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    // Create a filename with timestamp and original name
    const timestamp = Date.now();
    const filename = `${originalName}_${timestamp}${path.extname(file.originalname)}`;
    
    // Also save the filename in the request body
    req.body.image = filename;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Clean up old files periodically
const cleanupOldFiles = () => {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
  
  fs.readdir('uploads', (err, files) => {
    if (err) return console.error('Error reading uploads directory:', err);
    
    files.forEach(file => {
      fs.stat(`uploads/${file}`, (err, stats) => {
        if (err) return console.error('Error checking file:', err);
        
        if (stats.isFile() && stats.mtimeMs < oneWeekAgo) {
          fs.unlink(`uploads/${file}`, err => {
            if (err) return console.error('Error deleting old file:', err);
            console.log(`Deleted old file: ${file}`);
          });
        }
      });
    });
  });
};

// Run cleanup every day
setInterval(cleanupOldFiles, 24 * 60 * 60 * 1000); // Run every 24 hours

module.exports = upload;