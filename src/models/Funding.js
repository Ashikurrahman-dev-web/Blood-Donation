import mongoose from "mongoose";

const fundingSchema = new mongoose.Schema(
  {
    donorName: String,
    donorEmail: String,

    amount: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Funding ||
  mongoose.model("Funding", fundingSchema);