import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  enrollmentNo: String,
  course: String,
  year: String,
  phone: String,
  interests: [String],
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  blocked: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  verifyToken: String,
  resetToken: String,
  resetExpires: Date,
  prefs: {
    events: { type: Boolean, default: true },
    blogs: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };

export default mongoose.model('User', userSchema);
