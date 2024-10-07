import mongoose from "mongoose";

const skinPurchasedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skinName: { type: String, required: true },
  image: { type: String },
  skinCondition: { type: String, required: true },
  isStatTrack: { type: Boolean, default: false },
  purchasePrice: { type: Number, required: true },
  datePurchased: { type: Date, default: Date.now },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const SkinPurchased = mongoose.model("SkinPurchased", skinPurchasedSchema);

export default SkinPurchased;
