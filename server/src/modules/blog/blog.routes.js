import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import * as c from './blog.controller.js';

const r = Router();
r.get('/', c.listPosts);
r.get('/admin/all', protect, adminOnly, c.adminList);
r.get('/admin/:id', protect, adminOnly, c.adminGet);
r.get('/:slug', c.getPost);
r.post('/', protect, adminOnly, c.createPost);
r.put('/:id', protect, adminOnly, c.updatePost);
r.delete('/:id', protect, adminOnly, c.deletePost);
export default r;
