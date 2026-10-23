import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  poster: String,
  category: { type: String, default: 'General' },
  description: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  venue: String,
  schedule: [{ time: String, title: String }],
  rules: [String],
  prizes: [String],
  speakers: [{ name: String, role: String, photo: String }],
  registrationOpen: { type: Boolean, default: true },
  registrationDeadline: Date,
  published: { type: Boolean, default: true },
  photos: [String],
  externalLink: String,          // e.g. separate event website
  winners: [String],             // e.g. "1st (AI): Cosmic_coders0818"
}, { timestamps: true, toJSON: { virtuals: true } });

// Upcoming / Ongoing / Past is calculated from dates
eventSchema.virtual('status').get(function () {
  const now = new Date();
  const end = this.endDate || new Date(this.startDate.getTime() + 24 * 3600 * 1000);
  if (now < this.startDate) return 'upcoming';
  return now <= end ? 'ongoing' : 'past';
});
// Registration closes automatically after the deadline or when admin closes it
eventSchema.virtual('canRegister').get(function () {
  const deadline = this.registrationDeadline || this.startDate;
  return this.registrationOpen && new Date() <= deadline;
});

export default mongoose.model('Event', eventSchema);
