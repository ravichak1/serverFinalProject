require("dotenv").config();
require("./config/dbConfig");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
// app.use(morgan);
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./Routes/auth.routes"));
app.use("/auth",require("./Routes/workouts.routes"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
