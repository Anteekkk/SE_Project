import express from "express";
const router=express.Router();
import {setappointment} from "../controllers/setappointment";
router.post("/setappointment",setappointment);
