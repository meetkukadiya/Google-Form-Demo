import mongoose from "mongoose";

const responseDataSchema = new mongoose.Schema({
  respondedBy: { type: String, required: true },
  responseFormId: { type: String, required: true },
  answers: { type: Array, required: true },
});

export default mongoose.model("FormResponseData", responseDataSchema);
