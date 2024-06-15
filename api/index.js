const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./routes/routes");

app.use(cors());
app.use(express.json());
dotenv.config();

// Ensure routes are correctly mounted
app.use("/api", route);
app.use("/user", route);
app.use("/auth", route);
app.use("/google", route);
app.use("/detail", route);
app.use('/update',route)
app.use('/delete',route)
app.use('/Create',route)
app.use('/get',route)
app.use('/lists',route)
app.use('/pay',route)
app.use('/count',route)
app.use('/review',route)
app.use('/total',route)

mongoose.connect(
  "mongodb+srv://azhaguazhagu30:j2oW5hkGVUwR2tG7@cluster0.ipwnl5f.mongodb.net/dualdealmart?retryWrites=true&w=majority&appName=Cluster0"
);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server connected");
});
