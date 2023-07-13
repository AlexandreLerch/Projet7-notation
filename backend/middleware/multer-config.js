const multer = require('multer');

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/webp': 'webp',
// };

const storage = multer.memoryStorage();

const upload = multer({ storage }).single('image');

module.exports = upload;
