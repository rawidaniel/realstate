import { Router, RequestHandler } from "express";
import {  
    getAllProperties,
    getPropertyById,
    updateProperty,
    createProperty,
    deleteProperty
} from "../controllers/propertyController";
import { authenticate } from "../middlewares/authHandler";

const router = Router();

router.get('/properties', getAllProperties as RequestHandler);
router.get('/property/:id', authenticate as RequestHandler, getPropertyById as RequestHandler);
router.post('/property', createProperty as RequestHandler);
router.put('/property/:id', updateProperty as RequestHandler);
router.delete('/property/:id', deleteProperty as RequestHandler);

export default router;
