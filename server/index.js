import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from 'mongoose';
import authRoutes from './routes/Authroutes.js';
import contactRoutes from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
import MessagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 3801;

const databaseURL =  process.env.DATABASE_URL;

app.use(cors({
    origin:"https://chat-app-frontend-o0vz.onrender.com",
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",MessagesRoutes);
app.use("/api/channel",channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});

setupSocket(server);



mongoose.connect(databaseURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
