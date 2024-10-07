import mongoose from "mongoose";

const skinForSaleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skinName: { type: String, required: true },
  image: { type: String },
  skinCondition: { type: String, required: true },
  isStatTrack: { type: Boolean, default: false },
  price: { type: Number, required: true },
  dateListed: { type: Date, default: Date.now },
  isSold: { type: Boolean, default: false },
});

const SkinForSale = mongoose.model("SkinForSale", skinForSaleSchema);

export default SkinForSale;
