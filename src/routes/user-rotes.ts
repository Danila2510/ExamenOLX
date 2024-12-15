import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';

const router = Router();

router.route('/')
    .post(UserController.createUser)
    .get(UserController.getUsers);  
router.get('/:id', UserController.getUserById);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);
router.post('/login', UserController.login);
export default router;
