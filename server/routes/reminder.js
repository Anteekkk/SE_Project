import express from "express";
const router=express.Router();
import {reminder} from "../controllers/reminder";
router.post("/reminder",reminder);