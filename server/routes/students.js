import express from "express";
const router=express.Router();
import pg from "pg";
import {students} from "../controllers/students.js";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "antrikshj_09",
  port: 5432,
});
db.connect();
router.post("/student",students);
export default router;