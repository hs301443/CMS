import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from '../../controller/admin/user';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.get('/', catchAsync(getAllUsers));
router.get('/:id', catchAsync(getUserById));
router.post('/', catchAsync(createUser));
router.put('/:id', catchAsync(updateUser));
router.delete('/:id', catchAsync(deleteUser));

export default router;