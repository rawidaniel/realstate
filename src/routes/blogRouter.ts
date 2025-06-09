import { Router, RequestHandler } from "express";
import { protect } from "../controllers/authController";

import {  
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from "../controllers/blogController";
import { authenticate } from "../middlewares/authHandler";

const router = Router();

router.get('/blog', getAllBlogs as RequestHandler);
router.get('/blog/:id', authenticate as RequestHandler, getBlogById as RequestHandler);

//admin
router.post('/blog', protect, createBlog as RequestHandler);
router.put('/blog/:id', updateBlog as RequestHandler);
router.delete('/blog/:id', deleteBlog as RequestHandler);
export default router;
