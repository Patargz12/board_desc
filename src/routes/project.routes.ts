import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { authorize } from '@/middlewares/authorize';
import * as projectsController from '../controllers/project.controller';

const router = Router();

router.get('/', authenticate, authorize('admin'), projectsController.getAll);
router.post('/', authenticate, authorize('admin'), projectsController.create);
router.put('/:id', authenticate, authorize('admin'), projectsController.update);
// router.delete('/:id', authenticate, authorize('admin'), projectsController.delete);

export default router;
