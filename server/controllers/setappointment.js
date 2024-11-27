import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cfg",
    password: "antrikshj_09",
    port: 5432,
  });
  db.connect();
export const setappointment= async (req,res)=>{
    const { date, email } = req.body;
    try {
        await db.query('INSERT INTO appointments (date, email) VALUES ($1, $2)', [date, email]);
        res.json({status:true});
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error saving appointment');
    }

}