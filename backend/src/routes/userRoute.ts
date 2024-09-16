import express from 'express'
import { signUp,login,auth,logout,getUserImages ,editImage,getUser, uploadImages,updateOrder, deleteImage } from '../controllers/userController';
import {authenticateAdmin, authenticateUser} from '../middleware/authMiddleware';
import { upload } from '../middleware/multerMiddleware';

const router = express.Router();

router.get('/auth',authenticateUser, auth);
router.post('/register', signUp);
router.post('/login', login);
router.post('/upload-images',authenticateUser,upload, uploadImages);
router.post('/logout', logout);
router.get('/get-images',authenticateUser, getUserImages);
router.delete('/delete-image/:id',authenticateUser, deleteImage);
router.get('/get-user',authenticateUser, getUser);
router.post('/edit-image',upload,authenticateUser, editImage);
router.put('/update-order',authenticateUser, updateOrder);


    
export default router;