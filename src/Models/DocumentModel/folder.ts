import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  folder_name: {
    type: String,
    required: true
  },
  society_code: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  files: [{
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
});

const Folder = mongoose.model('Folder', folderSchema);
export default Folder;
