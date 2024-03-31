const mongoose = require("mongoose");
const Cart = require("./CartModel").schema;

const collection = "Usuarios";

const schema = new mongoose.Schema({
  email: String,
  password: String,
  email, String,
  age: Number,
  cart: Cart,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;