import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['event', 'blog', 'announcement'], default: 'announcement' },
  title: { type: String, required: true },
  body: String,
  link: String,
  pinned: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  expiresAt: Date,
  sendEmail: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // logged-in members
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
