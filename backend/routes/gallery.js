const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

const auth = require('../middleware/auth');

// Routes
router.get('/', galleryController.getGalleryItems);
router.post('/', auth, galleryController.createGalleryItem);
router.put('/group', auth, galleryController.groupGalleryItems);
router.post('/bulk-delete', auth, galleryController.bulkDeleteGalleryItems);
router.delete('/:id', auth, galleryController.deleteGalleryItem);

module.exports = router;
