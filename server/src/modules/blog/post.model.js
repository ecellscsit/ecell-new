import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  cover: String,
  excerpt: String,
  content: { type: String, required: true },
  category: { type: String, default: 'News' },
  author: { type: String, default: 'E-Cell SCSIT' },
  published: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
