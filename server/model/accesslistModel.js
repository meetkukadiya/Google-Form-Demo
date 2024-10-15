import mongoose from "mongoose";

const accesslistSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  userEmails: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AccessList", accesslistSchema);
