import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';


dotenv.config();

connectDB();

app.listen(process.env.PORT ||5001, ()=>{
    console.log ('server is running on port 5001')
})


process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});