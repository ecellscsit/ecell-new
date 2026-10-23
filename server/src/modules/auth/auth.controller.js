import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';
import Event from '../events/event.model.js';
import { sendEmail } from '../../utils/sendEmail.js';
import { asyncH } from '../../middleware/error.js';

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const CLIENT = () => process.env.CLIENT_URL;

export const register = asyncH(async (req, res) => {
  const { name, email, password, enrollmentNo, course, year, phone, interests, subscribe = true } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });

  const verifyToken = crypto.randomBytes(24).toString('hex');
  const autoVerify = process.env.DEV_AUTO_VERIFY === 'true';   // local testing only
  await User.create({
    name, email, password, enrollmentNo, course, year, phone, interests, verifyToken,
    emailVerified: autoVerify,
    prefs: { events: subscribe, blogs: subscribe, announcements: subscribe },
  });
  if (!autoVerify) await sendEmail({
    to: email, subject: 'Verify your E-Cell SCSIT account',
    html: `<p>Hi ${name}, confirm your email: <a href="${CLIENT()}/verify/${verifyToken}">Verify now</a></p>`,
  }).catch(console.error);
  res.status(201).json({ message: autoVerify ? 'Registered. You can log in now.' : 'Registered. Please check your email to verify your account.' });
});

export const verifyEmail = asyncH(async (req, res) => {
  const user = await User.findOne({ verifyToken: req.params.token });
  if (!user) return res.status(400).json({ message: 'Invalid or used link' });
  user.emailVerified = true; user.verifyToken = undefined; await user.save();

  // Welcome email with upcoming events
  const events = await Event.find({ published: true, startDate: { $gte: new Date() } }).sort('startDate').limit(3);
  const list = events.map((e) => `<li><a href="${CLIENT()}/events/${e.slug}">${e.title}</a></li>`).join('');
  sendEmail({
    to: user.email, subject: 'Welcome to E-Cell SCSIT!',
    html: `<h2>Welcome, ${user.name}!</h2><p>We turn ideas into startups.</p>${list ? `<p>Upcoming events:</p><ul>${list}</ul>` : ''}`,
  }).catch(console.error);
  res.json({ message: 'Email verified. You can log in now.' });
});

export const login = asyncH(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Wrong email or password' });
  if (user.blocked) return res.status(403).json({ message: 'Account blocked. Contact admin.' });
  if (!user.emailVerified && user.role !== 'admin') return res.status(403).json({ message: 'Please verify your email first' });
  user.password = undefined;
  res.json({ token: sign(user._id), user });
});

export const me = (req, res) => res.json(req.user);

export const forgotPassword = asyncH(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    user.resetToken = crypto.randomBytes(24).toString('hex');
    user.resetExpires = Date.now() + 30 * 60 * 1000;
    await user.save();
    sendEmail({ to: user.email, subject: 'Reset your password',
      html: `<a href="${CLIENT()}/reset/${user.resetToken}">Reset password</a> (valid 30 minutes)` }).catch(console.error);
  }
  res.json({ message: 'If this email exists, a reset link has been sent.' });
});

export const resetPassword = asyncH(async (req, res) => {
  const user = await User.findOne({ resetToken: req.params.token, resetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Link expired' });
  user.password = req.body.password; user.resetToken = undefined; user.resetExpires = undefined;
  await user.save();
  res.json({ message: 'Password changed' });
});

export const changePassword = asyncH(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) return res.status(400).json({ message: 'Current password is wrong' });
  user.password = req.body.newPassword; await user.save();
  res.json({ message: 'Password changed' });
});
