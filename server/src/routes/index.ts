import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as auth from '../controllers/auth.controller.js';
import * as user from '../controllers/user.controller.js';
import * as world from '../controllers/world.controller.js';
import * as meta from '../controllers/meta.controller.js';
import * as admin from '../controllers/admin.controller.js';
import * as events from '../controllers/event.controller.js';

const router = Router();

/* --------------------------------- Auth ---------------------------------- */
router.post('/auth/register', asyncHandler(auth.register));
router.post('/auth/login', asyncHandler(auth.login));
router.post('/auth/refresh', asyncHandler(auth.refresh));
router.post('/auth/logout', asyncHandler(auth.logout));

/* --------------------------------- User ---------------------------------- */
router.get('/me', authenticate, asyncHandler(user.me));
router.patch('/profile', authenticate, asyncHandler(user.updateProfile));
router.get('/progress', authenticate, asyncHandler(user.getProgress));
router.patch('/progress', authenticate, asyncHandler(user.patchProgress));

/* -------------------------------- Worlds --------------------------------- */
router.get('/worlds', asyncHandler(world.listWorlds));
router.get('/world/:id', asyncHandler(world.getWorld));
router.get('/lesson/:id', asyncHandler(world.getLesson));
router.post('/lesson/complete', authenticate, asyncHandler(world.completeLesson));
router.post('/encounter/complete', authenticate, asyncHandler(world.completeEncounter));

/* ---------------------------- Rewards / meta ----------------------------- */
router.get('/achievements', authenticate, asyncHandler(meta.listAchievements));
router.get('/rewards', authenticate, asyncHandler(meta.listRewards));
router.post('/claim', authenticate, asyncHandler(meta.claimReward));

/* ------------------------------- Telemetry -------------------------------- */
router.post('/events', authenticate, asyncHandler(events.ingestEvents));

/* --------------------------------- Admin --------------------------------- */
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.get('/analytics', asyncHandler(admin.analytics));
adminRouter.get('/funnel', asyncHandler(events.funnel));
adminRouter.get('/users', asyncHandler(admin.listUsers));
adminRouter.post('/users/:id/reset', asyncHandler(admin.resetUserProgress));
adminRouter.post('/worlds', asyncHandler(admin.createWorld));
adminRouter.patch('/worlds/:id', asyncHandler(admin.updateWorld));
adminRouter.delete('/worlds/:id', asyncHandler(admin.deleteWorld));
adminRouter.put('/worlds/:id/scene', asyncHandler(admin.saveWorldScene));
adminRouter.post('/lessons', asyncHandler(admin.createLesson));
adminRouter.patch('/lessons/:id', asyncHandler(admin.updateLesson));
adminRouter.delete('/lessons/:id', asyncHandler(admin.deleteLesson));
adminRouter.post('/lessons/move', asyncHandler(admin.moveLessons));
router.use('/admin', adminRouter);

export default router;
