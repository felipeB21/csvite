import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  steamId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  profileUrl: { type: String },
  visibility: { type: Number },
  tradeUrl: { type: String },
  findTradeUrl: { type: String },
  money: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

export default User;
