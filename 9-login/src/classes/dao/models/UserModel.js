const mongoose = require("mongoose");

const collection = "Usuarios";

const schema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;