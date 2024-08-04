export const setappointment= async (req,res)=>{
    const { date, email } = req.body;
    try {
        await db.query('INSERT INTO appointments (date, email) VALUES ($1, $2)', [date, email]);
        res.send('Appointment booked successfully!');
    } catch (err) {
        console.error('Error saving appointment:', err);
        res.status(500).send('Error saving appointment');
    }

}