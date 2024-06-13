import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER", "PREMIUM  "],
    default: "USER",
  },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: { type: Date, default: Date.now }
});
const usersModel = mongoose.model("users", usersSchema);
export default usersModel;
