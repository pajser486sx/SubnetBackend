import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import savedExplanationRoutes from "./routes/savedExplanations.js";
import aiRoutes from "./routes/ai.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [
  "http://localhost:5173"
  ],
  credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/saved-explanations", savedExplanationRoutes);
app.use("/api/ai", aiRoutes);



app.get("/", (req, res) => {
  res.status(200).json({ message: "Subnet server running!" });
});


app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Frontend can read backend!" });
});

await connectDB();

app.listen(PORT, error => {
  if (error) {
    console.error(`Error during server startup: ${error.message}`);
  } else {
    console.log(`Subnet server is running at http://localhost:${PORT} !`);
  }
});