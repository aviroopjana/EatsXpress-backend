import express from 'express';
import { signout, updateUser } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/verifyUser';

const router = express.Router();

router.put('/updateUser/:userId',verifyToken, updateUser);
router.post('/signout', signout);

export default router;