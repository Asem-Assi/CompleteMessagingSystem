// routes.js or equivalent
import express from 'express';
import register from '../controller/registerUser.js';
import signin from '../controller/signinUser.js';
import getUserInfo from '../controller/getUserInfo.js';
import logout from '../controller/logout.js';
import upload from '../config/multer.js';
import createConversation from '../controller/createConversation.js';
import getAllConversation from '../controller/getAllConversation.js';
import createMessage from '../controller/createMessage.js';
import getAllMessages from '../controller/getAllMessage.js';
import search from '../controller/search.js';
import getUserById from '../controller/getUserFromId.js';
import editUser from '../controller/editUserInfo.js'; // Import the new editUser controller
import updateSeenStatus from '../controller/updateSeen.js';

const router = express.Router();

// Use Multer middleware for avatar upload in register and editUser routes
router.post('/register', upload.single('avatar'), register);
router.post('/signin', signin);
router.get('/user-info', getUserInfo);
router.get('/user-info-by-id/:id', getUserById);
router.get('/logout', logout);
router.post('/create-conversation', createConversation);
router.get('/get-conversation/:userId', getAllConversation);
router.post('/create-message', upload.single('media'), createMessage);
router.get('/get-message', getAllMessages);
router.post('/search', search);
router.post('/update-seen',updateSeenStatus)

// Edit user route with Multer middleware for avatar upload
router.post('/edit-user', upload.single('avatar'), editUser);

export default router;
