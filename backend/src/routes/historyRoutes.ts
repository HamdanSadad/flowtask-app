import { Router } from 'express';
import { getHistory, deleteHistory, clearHistory } from '../controllers/historyController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getHistory);
router.delete('/clear', clearHistory);
router.delete('/:id', deleteHistory);

export default router;
