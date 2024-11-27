import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import multer from "multer";
import reminder from "./routes/reminder.js";
import inventory from "./routes/inventory.js";
import admin from "./routes/admin.js";
import appointment from "./routes/appointment.js";
import student from "./routes/students.js";
// import update from "./routes/update.js";

import nodemailer from "nodemailer";


const upload = multer();
const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json
//app.use(express.urlencoded({ extended: true })); 
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

// async function checkMinimum(ratio,total) {
//     const result = await db.query("SELECT special_req_min FROM inventory");
//     const current = await db.query("SELECT current_storage FROM inventory");
//     const max = await db.query("SELECT max_storage FROM inventory");
    
//     if(ratio>=result && current<max && total+current<max){
//       return true;
//     }
//     else{
//       return false;
//     }
//   }
app.use('/reminder',reminder);

// async function store_reminders(mail,quantity) {
//   const userid=generateUserId2;
//   const result = await db.query(
//     'INSERT INTO reminder (id,email, quantity) VALUES ($1, $2,$3)',
//     [userid,mail, quantity]
// );
// }

app.post('/user_remind',async(req,res)=>{
  const mail = req.body.email;
  const quantity = req.body.quantity_donate;
  try {
    const userid=await generateUserId2();
    await db.query('INSERT INTO reminders VALUES ($1, $2,$3)', [userid,mail,quantity]);
    res.json({status:"ok"});
} catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).send('Error saving appointment');
}
});

//app.use('/inventory',inventory);
app.use('/admin',admin);
//app.use('/appointment',appointment);
// app.use('/student',student);
async function checkMinimum(ratio,total){
  try{
    const result = await db.query("SELECT special_req_min FROM inventory");
    const current = await db.query("SELECT avail_storage FROM inventory");
    const max = await db.query("SELECT max_storage FROM inventory");
    
    if(ratio >= result.rows[0].special_req_min && total <= current.rows[0].avail_storage ){
      return true;
    }
    else{
      return false;
    }
  }catch(err){
      console.log(err);
  }
}
async function getavail(){
  try{
    const current = await db.query("SELECT avail_storage FROM inventory");
    console.log(current.rows[0].avail_storage);
    return current.rows[0].avail_storage;
    
  }catch(err){
      console.log(err);
  }
}
app.post("/inventory",async(req,res)=>{
  const total = req.body.quantity;
  const special = req.body.specialRequestQuantity;
  if(special){
    const ratio = special/total;
    const min = await checkMinimum(ratio,total);
    if(min){
        res.json({isAvailable:true});
    }else{
        res.json({isAvailable:false});
    }

  }
  else{
    const check=await getavail();
    if(total<=check){
      res.json({isAvailable:true});
    }
    else{
      res.json({isAvailable:false});
    }
  }
})

app.post("/update",async(req,res)=>{
  console.log(req.body);
  const storage = req.body.no;
  let requt = "false";
  if(req.body.requ == "") {requt = "false";}
  else {requt = req.body.requ;}
  const quant = req.body.quant;
  try{
      const result = await db.query(
          'UPDATE inventory SET avail_storage = $1, special_requirement = $2,special_req_min = $3 WHERE id = 3',
          [storage, requt,quant]
      );
      res.json({ok:"ok"});
  }catch(err){
      console.log(err);
  }
})

// app.get("/admin",async(req,res)=>{
//     const result = await db.query("SELECT special_requirement FROM inventory");
//     if(result==='false'){
//         res.send(false);
//     }
//     else{
//         res.send(result);
//     }
// })
let counter3=0;
async function generateStudId() {
  counter3 += 1;
  return counter;
}
app.post('/student', async (req, res) => {
  const { rno, name, studentclass,age,gender,dob,address } = req.body;
  const id=await generateStudId();
try {
  // Check if the student exists in the database
  const rep = await db.query(
    'SELECT * FROM students WHERE roll_no = $1 AND name = $2 AND current_class = $3',
    [rno, name, studentclass]
  );

  if (rep.rows.length > 0) {
    // If the student exists, respond with a message
    res.json({ msg: false });
  } else {
    // If the student doesn't exist, insert the student into the database
    try {
      const rp=await db.query(
        'INSERT INTO students (id,roll_no, name, current_class,age,gender,dob,address) VALUES ($1, $2, $3,$4,$5,$6,$7,$8)',
        [id,rno, name, studentclass,age,gender,dob,address]
      );
      res.json({ msg: true });
    } catch (err) {
      console.error('Error inserting:', err);
      res.status(500).send('Error inserting student');
    }
  }
} catch (err) {
  console.error('Error checking for student:', err);
  res.status(500).send('Error checking for student');
}
});






// app.post("/admin",async(req,res)=>{
//   const {donationDate,email}=req.body;
//   await db.query("SELECT special_requirement FROM inventory");

// })
// app.post("/inventory", async(req,res)=>{
//     const total=req.body.quantity;
//       const special=req.body.specialRequestQuantity;
//       const ratio=special/total;
//       const min= await checkMinimum(ratio,total);
//       if(min===true){
//         res.send("true");
//       }
//       else{
//         res.send("false");
//       }
// });
app.post("/appointment", async(req,res)=>{
  const userId = await generateUserId();
    const {donationDate,email} = req.body;
    try {
        await db.query('INSERT INTO appointments VALUES ($1, $2,$3)', [userId,email,donationDate]);
        res.json({status:"ok"});
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error saving appointment');
    }
});
// app.post("/reminder", async(req,res)=>{
//     const email=req.body;
//     const userId = await generateUserId2();
//     try {
//       await db.query('INSERT INTO full VALUES ($1, $2)', [userId,email]);
//       res.send('Thank you so much for reaching out to us, right now we are short on space, will connect with you as soon as we have our inventory freed up. Please drop your email with us to send you a reminder when space is available ');
//   } catch (err) {
//       console.error('Error saving appointment:', err);
//       res.status(500).send('Error saving appointment');
//   }
// });
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
    const result = await db.query('SELECT * FROM donors where id=$1',[id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM students WHERE eduparent = $1', [id]);
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
    const result = await db.query('SELECT current_percentage,current_class FROM students WHERE student_id = $1', [id]);
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
app.listen("3000" , function(req,res){
    console.log("server started");
});