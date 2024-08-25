const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    formname: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
    theme: { type: String, required: true },
    views: { type: Number, default: 0 },
    starts: { type: Number, default: 0 },
    completionrate: { type: Number, default: 0 },
    fields: [
      {
        type: { type: String, required: true },
        heading: { type: String, required: true },
        value: { type: String },
      },
    ],
    uniqueUrl: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
