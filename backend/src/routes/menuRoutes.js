const express = require('express');
const { getAllMenu, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Always use disk storage - files saved to /uploads folder (Docker volume mounted)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getAllMenu);
router.post('/', upload.single('image'), createMenu);
router.put('/:id', upload.single('image'), updateMenu);
router.delete('/:id', deleteMenu);

module.exports = router;
