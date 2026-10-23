import mongoose from 'mongoose';

// level: 0 Faculty, 1 President, 2 VP, 3 Head, 4 Team Lead, 5 Member
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  role: String,                       // e.g. "Head of Design"
  department: { type: String, default: '' },
  level: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 5 },
  year: { type: String, required: true },   // e.g. "2026-27"
  courseYear: String,
  quote: String,
  linkedin: String,
  instagram: String,
  order: { type: Number, default: 0 },      // drag-to-reorder inside a level
}, { timestamps: true });

export default mongoose.model('TeamMember', memberSchema);
