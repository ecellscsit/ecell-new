import slugify from 'slugify';
import Post from './post.model.js';
import { notifyMembers } from '../../utils/notifyMembers.js';
import { asyncH } from '../../middleware/error.js';

export const listPosts = asyncH(async (req, res) => {
  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  res.json(await Post.find(filter).select('-content').sort({ publishedAt: -1 }).limit(Number(req.query.limit) || 50));
});
export const getPost = asyncH(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const related = await Post.find({ category: post.category, _id: { $ne: post._id }, published: true }).select('title slug cover').limit(3);
  res.json({ post, related });
});
export const adminList = asyncH(async (req, res) => res.json(await Post.find().select('-content').sort({ createdAt: -1 })));
export const adminGet = asyncH(async (req, res) => res.json(await Post.findById(req.params.id)));

export const createPost = asyncH(async (req, res) => {
  const { notifyMembers: notify, ...data } = req.body;
  data.slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  if (data.published) data.publishedAt = new Date();
  const post = await Post.create(data);
  if (notify && post.published) sendBlogNotice(post);
  res.status(201).json(post);
});
export const updatePost = asyncH(async (req, res) => {
  const { notifyMembers: notify, ...data } = req.body;
  const old = await Post.findById(req.params.id);
  if (data.published && !old.published) data.publishedAt = new Date();
  const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true });
  if (notify && data.published && !old.published) sendBlogNotice(post);
  res.json(post);
});
export const deletePost = asyncH(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

const sendBlogNotice = (p) => notifyMembers({
  kind: 'blog', title: `New blog: ${p.title}`, body: p.excerpt || 'A new article is live.',
  link: `/blog/${p.slug}`, image: p.cover,
});
