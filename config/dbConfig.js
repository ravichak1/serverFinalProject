const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then((db) => console.log(`DB connected: ${db.connection.name}`))
  .catch((e) => console.log(e));
