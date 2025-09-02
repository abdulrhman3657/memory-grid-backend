import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch"; 
import { connectDB } from "./config/db.js";
import User from "./models/user.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "https://memory-grid-frontend.onrender.com",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    // get the IP
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // lookup location
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await geoRes.json();

    const newUser = await User.create({
        reqMethod: req.method,
        country: geo.country,
        city: geo.city,
    });

    res.json({data: newUser});

  } catch (err) {
    console.error("Error logging visitor:", err);
    res.status(500).send("Error logging visitor");
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find({});
  console.log(users)
  res.json(
    {
        count: `This page has been requested ${users.length} times`,
        data: users
    });
});


app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
    connectDB();
})