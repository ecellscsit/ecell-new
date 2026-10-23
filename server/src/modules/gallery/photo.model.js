import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: String,
  event: String,          // event name or id used for filtering
  year: String,
  showOnHome: { type: Boolean, default: false },
  showInHero: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Photo', photoSchema);
