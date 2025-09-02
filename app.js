import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch"; 
import { connectDB } from "./config/db.js";
import User from "./models/user.js";

const app = express();

const PORT = 3000;

import cors from "cors";

// Allow all origins (for development)
app.use(cors());

// app.use(express.json());

app.get("/", async (req, res) => {
  try {
    // get real IP (supports proxies)
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