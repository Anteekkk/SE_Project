import express from "express";
const router=express.Router();
import {sendReminder} from "../controllers/reminder.js";
router.post("/",sendReminder);
export default router;