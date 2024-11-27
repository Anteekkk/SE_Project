import express from "express";
const router=express.Router();
import {setappointment} from "../controllers/setappointment.js";
router.post("/setappointment",setappointment);
export default router;