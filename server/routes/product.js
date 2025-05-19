const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/discounted', productController.getDiscountedProducts);
router.get('/:id', productController.getProduct);

// Protected routes (require admin)
router.post('/', [authMiddleware, adminMiddleware, upload.single('image')], productController.createProduct);
router.put('/:id', [authMiddleware, adminMiddleware, upload.single('image')], productController.updateProduct);
router.delete('/:id', [authMiddleware, adminMiddleware], productController.deleteProduct);

module.exports = router;