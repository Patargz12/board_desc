import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import * as tasksController from '@/controllers/task.controller';

const router = Router();

router.get('/',     authenticate,                              tasksController.getAll);
router.get('/:id',  authenticate,                              tasksController.getOne);
router.post('/',    authenticate, authorize('admin', 'member'), tasksController.create);
router.put('/:id',  authenticate, authorize('admin', 'member'), tasksController.update);
router.delete('/:id', authenticate, authorize('admin'),         tasksController.remove);

export default router;

