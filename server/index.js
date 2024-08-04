import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import multer from "multer";
const upload = multer();
const app = express();
app.use(cors());
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "cfg",
  password: "antrikshj_09",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let counter = 0;
let counter2 = 0;

async function generateUserId() {
    counter += 1;
    return counter;
}
async function generateUserId2() {
    counter2 += 1;
    return counter2;
}

async function checkMinimum(ratio,total) {
    const result = await db.query("SELECT special_req_min FROM inventory");
    const current = await db.query("SELECT current_storage FROM inventory");
    const max = await db.query("SELECT max_storage FROM inventory");
    
    if(ratio>=result && current<max && total+current<max){
      return true;
    }
    else{
      return false;
    }
  }
app.get("/admin",async(req,res)=>{
    const result = await db.query("SELECT special_requirement FROM inventory");
    if(result==='false'){
        res.send(false);
    }
    else{
        res.send(result);
    }
})
// app.post("/admin",async(req,res)=>{
//   const {donationDate,email}=req.body;
//   await db.query("SELECT special_requirement FROM inventory");

// })
app.post("/inventory", async(req,res)=>{
    const total=req.body.quantity;
      const special=req.body.specialRequestQuantity;
      const ratio=special/total;
      const min= await checkMinimum(ratio,total);
      if(min===true){
        res.send("true");
      }
      else{
        res.send("false");
      }
});
app.post("/appointment", async(req,res)=>{
  const userId = await generateUserId();
    const {donationDate,email} = req.body;
    try {
        await db.query('INSERT INTO reminders VALUES ($1, $2,$3)', [userId,email,donationDate]);
        res.send('Appointment booked successfully!');
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error saving appointment');
    }
});
app.post("/reminder", async(req,res)=>{
    const email=req.body;
    const userId = await generateUserId2();
    try {
      await db.query('INSERT INTO full VALUES ($1, $2)', [userId,email]);
      res.send('Thank you so much for reaching out to us, right now we are short on space, will connect with you as soon as we have our inventory freed up. Please drop your email with us to send you a reminder when space is available ');
  } catch (err) {
      console.error('Error saving appointment:', err);
      res.status(500).send('Error saving appointment');
  }
});
// app.get('/api/students/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('SELECT * FROM donors where id=$1',[id]);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     res.status(500).send('Error fetching students');
//   }
// });
app.get('/api/parents', async (req, res) => {
  const id  = 1;
  try {
    const result = await pool.query('SELECT * FROM donors where id=$1',[id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM students WHERE eduparent = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send('Error fetching student details');
  }
});
app.get('/api/students/:id/report', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT current_percentage,current_class FROM students WHERE student_id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send('Report not found');
    }
  } catch (error) {
    console.error('Error fetching latest report:', error);
    res.status(500).send('Error fetching latest report');
  }
});
app.listen("5000" , function(req,res){
    console.log("server started");
});