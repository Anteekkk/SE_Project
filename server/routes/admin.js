import express from "express";
const router=express.Router();
import {admin} from "../controllers/admincont.js";

import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "cfg",
  password: "antrikshj_09",
  port: 5432,
});
db.connect();
router.get("/",admin);
export default router;