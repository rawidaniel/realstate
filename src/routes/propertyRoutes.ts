import { Router, RequestHandler } from "express";
import {  
    getAllProperties,
    getPropertyById,
    updateProperty,
    createProperty,
    deleteProperty,
    searchProperties
} from "../controllers/propertyController";
import { protect } from "../controllers/authController";
const router = Router();

// Public routes
router.get('/properties', getAllProperties as RequestHandler);
router.get('/properties/search', searchProperties as RequestHandler);
router.get('/property/:id', getPropertyById as RequestHandler);

// Protected routes
router.post('/property', protect, createProperty as RequestHandler);
router.put('/property/:id', protect, updateProperty as RequestHandler);
router.delete('/property/:id', protect, deleteProperty as RequestHandler);

export default router;
