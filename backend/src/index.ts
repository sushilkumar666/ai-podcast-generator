import express from "express";
import dotenv from "dotenv";
import podcastRoutes from "./routes/podcast";
import cors from 'cors';
import path from 'path';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/podcast", podcastRoutes);
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


