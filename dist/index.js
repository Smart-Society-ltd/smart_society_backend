import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/AuthRoutes/authRoutes.js';
import mongoose from 'mongoose';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.listen(process.env.PORT, () => {
    console.log('Server started successfully');
});
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/SmartSociety');
    console.log("Successfully conected to database");
}
app.use('/api/auth', authRoutes);
