const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

app.use(express.json());
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://formbot-for-user.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const userRouter = require("./routes/userRoute");
const folderRouter = require("./routes/folderRoute");
const formRouter = require("./routes/formRoute");
const responseRouter = require("./routes/responseRoute"); // Import response routes

app.use("/user", userRouter);
app.use("/folder", folderRouter);
app.use("/form", formRouter);
app.use("/responses", responseRouter); // Ensure the correct use of response routes

// const database = require("./DataBase/Db");
// database();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Failed to connect to MongoDB', err);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Everything is ok my buddy");
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    status: 'Error',
  });
});
