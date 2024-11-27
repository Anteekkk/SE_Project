
import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cfg",
    password: "antrikshj_09",
    port: 5432,
  });
  db.connect();
async function checkMinimum(ratio,total) {
    const result = await db.query("SELECT special_req_min FROM inventory");
    const current = await db.query("SELECT avail_storage FROM inventory");
    const max = await db.query("SELECT max_storage FROM inventory");
    
    if(ratio>=result && current<max && total+current<max){
      return true;
    }
    else{
      return false;
    }
  }
export const checkinv= async (req,res)=>{
    const total=req.body.quantity;
      const special=req.body.specialRequestQuantity;
      const ratio=special/total;
      const min= await checkMinimum(ratio,total);
      if(min===true){
        res.json({isAvailable:true});
      }
      else{
        res.json({isAvailable:false});
      }

}


// module.exports={
//     checkinv,
// }