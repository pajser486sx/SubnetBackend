import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
app.use(cors({
  origin: [
    ""
  ],
  credentials: true
}));
*/

app.get("/", (req, res) => {
  res.status(200).json({ message: "Subnet server running!" });
});

/*
app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend can read backend!" });
});
*/
await connectDB();

app.listen(PORT, error => {
  if (error) {
    console.error(`Error during server startup: ${error.message}`);
  } else {
    console.log(`Subnet server is running at http://localhost:${PORT} !`);
  }
});