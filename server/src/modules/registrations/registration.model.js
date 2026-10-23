import mongoose from 'mongoose';

const regSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: String,
}, { timestamps: true });
regSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('Registration', regSchema);
