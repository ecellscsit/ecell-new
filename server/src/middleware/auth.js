import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

async function getUser(req) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return null;
  try {
    const { id } = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(id);
    return user && !user.blocked ? user : null;
  } catch { return null; }
}

// must be logged in
export const protect = async (req, res, next) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ message: 'Please log in' });
  req.user = user; next();
};
// logged in is optional (used by the notification bell)
export const optionalAuth = async (req, res, next) => { req.user = await getUser(req); next(); };
// admin only (use after protect)
export const adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admins only' });
