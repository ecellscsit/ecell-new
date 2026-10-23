import mongoose from 'mongoose';

// Programs / activities run by E-Cell (workshops, bootcamps, speaker sessions...)
const initiativeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: '💡' },      // an emoji
  image: String,
  description: String,
  link: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Initiative', initiativeSchema);
