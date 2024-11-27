import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cfg",
    password: "antrikshj_09",
    port: 5432,
  });
  db.connect();

export const students=async(req,res)=>{
    const {rno , name , studentclass}=req.body;
    //const rep
    try {
        const res=await db.query('SELECT * FROM students WHERE id = $1 AND name = $2 AND current_class=$3', [rno, name,studentclass]);
        if(res){
            try{
                await db.query ('INSERT into students ')
            }
            catch(err){
                console.error('Error inserting:', err);
        res.status(500).send('Error inserting');
            }
        }
        res.send('Appointment booked successfully!');
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error saving appointment');
    }
}