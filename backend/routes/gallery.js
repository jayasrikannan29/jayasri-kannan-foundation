const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Routes
router.get('/', galleryController.getGalleryItems);
router.post('/', galleryController.createGalleryItem);
router.put('/group', galleryController.groupGalleryItems);
router.post('/bulk-delete', galleryController.bulkDeleteGalleryItems);
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
