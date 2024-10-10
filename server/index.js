const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const UserModel = require("./models/Users");

const app = express();
const pass = process.env.MONGOPASS;
const db = process.env.DATABASE;
const connect_string = `mongodb+srv://me:${pass}@cluster0.idmwy.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;

app.use(express.json());
app.use(cors());

mongoose.connect(connect_string);

app.listen(3001, () => {
  console.log("Server started");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});
