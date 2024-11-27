
import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cfg",
    password: "antrikshj_09",
    port: 5432,
  });
  db.connect();


export const admin= async(req,res)=>{
    try{
    const result = await db.query("SELECT special_requirement FROM inventory");
    if(result.rows.length === 0){
        res.json({category:"false"});
    }else{
        // console.log(result.rows[0]);
        res.json({category:result.rows[0].special_requirement});
    }
}catch(err){
    console.log(err);
}
}