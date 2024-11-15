import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import { Request, Response } from 'express'

// routes
import authRoutes from "./routes/AuthRoutes/authRoutes.js";
import maintenanceRoute from "./routes/MaintenanceRoutes/maintenanceRoutes.js";
import visitorRoute from "./routes/VisitorManagement/visitorManagement.js";
import userRoute from "./routes/UserRoutes/userRoutes.js";
import societyPricing from "./routes/SocietyRoutes/societyRoutes.js";
import documentRoute from "./routes/DocumentManagementRoute/documentRoutes.js";
import neighbourRoute from "./routes/NeighbourRoutes/neighbourRoutes.js";
import announcementRoute from "./routes/AnnonucementRoutes/announcementRoutes.js";
import complaintRoute from "./routes/ComplaintRoutes/complaintRoutes.js";
import annualPlanRoute from "./routes/AnnualPlanRoutes/annualPlanRoutes.js";


const app = express();

app.use(express.json());


app.use(compression());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Running caygnus server 🚀')
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong 🏓')
})


app.use("/api/auth", authRoutes);
app.use("/api/maintenance", maintenanceRoute);
app.use("/api/user", userRoute);
app.use("/api/society", societyPricing);
app.use("/api/visitor", visitorRoute);
app.use("/api/document", documentRoute);
app.use("/api/neighbour", neighbourRoute);
app.use("/api/announcement", announcementRoute);
app.use("/api/complaint", complaintRoute);
app.use("/api/annualactionplan", annualPlanRoute);

export default app;
