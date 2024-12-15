import { Router } from 'express';
import { ProductController } from '../controllers/product-controller.js';

const router = Router();

router.route('/')
    .post(ProductController.createProduct)
    .get(ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.put('/update/:id', ProductController.updateProduct);
router.delete('/delete/:id', ProductController.deleteProduct);
router.post('/search', ProductController.searchProducts);
export default router;
