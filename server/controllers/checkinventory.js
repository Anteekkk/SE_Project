
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
export const checkinv= async (req,res)=>{
    const total=req.body.total;
      const special=req.body.special;
      const ratio=special/total;
      const min= checkMinimum(ratio,total);
      if(min===true){
        res.render("/appointment");
      }
      else{
        res.render("/reminder");
      }

}


module.exports={
    checkinv,
}