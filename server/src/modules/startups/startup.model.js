import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: String,
  founders: String,
  domain: String,
  description: String,
  story: String,
  link: String,
  showOnHome: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Startup', startupSchema);
