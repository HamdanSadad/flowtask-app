import { Router } from 'express';
import { getConfigs, updateConfig, getUsers, updateUserRole, deleteUser, updateUser, updateUserPassword } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public/User access to read configs
router.get('/config', getConfigs);

// Admin-only access
router.use(authenticate, requireAdmin);

router.put('/config/:key', updateConfig);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/password', updateUserPassword);

export default router;
