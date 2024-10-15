import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  formname: { type: String, required: true },
  formdescription: { type: String },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  questions: [
    {
      questionNumber: { type: Number, required: true },
      questionText: { type: String, required: true },
      inputType: { type: String, required: true },
      file_urls: { type: String },
      isRequired: { type: Boolean, default: false },
      options: { type: Array },
    },
  ],
});

export default mongoose.model("Form", formSchema);
