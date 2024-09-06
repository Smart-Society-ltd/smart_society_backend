import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/AuthRoutes/authRoutes.js'
import maintenanceRoute from './Routes/MaintenanceRoutes/maintenanceRoutes.js'
// import visitorRoute from './Routes/VisitorManagement/visitorManagement.js'
import userRoute from './Routes/UserRoutes/getUserData.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log('Server started successfully');
});

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect(process.env.DB_URI);
  await mongoose.connect("mongodb+srv://admin:admin@cluster0.bp10a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log("Successfully conected to database");
}

app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoute);
app.use('/api/user', userRoute);
// app.use('/api/visitor', visitorRoute);