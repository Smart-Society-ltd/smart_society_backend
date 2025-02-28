import mongoose, { Document, Schema } from "mongoose";

interface File {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadDate?: Date;
}

interface FolderInterface extends Document {
  folder_name: string;
  society_code: string;
  created_by: mongoose.Schema.Types.ObjectId;
  files: File[];
}

const folderSchema = new mongoose.Schema({
  folder_name: {
    type: String,
    required: true,
  },
  society_code: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  files: [
    {
      fileName: String,
      filePath: String,
      fileType: String,
      fileSize: Number,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Folder = mongoose.model<FolderInterface>("Folder", folderSchema);
export default Folder;
