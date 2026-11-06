import mongoose from 'mongoose';

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  role: String,              // e.g. "Full-stack Developer"
  linkedin: String,
  github: String,
  website: String,           // portfolio link
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Developer', developerSchema);
