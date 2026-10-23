import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'site', unique: true },
  // contact + branding
  logo: String,
  email: String, phone: String, address: { type: String, default: 'SCSIT, DAVV, Indore' }, mapLink: String,
  social: { instagram: String, linkedin: String, x: String, youtube: String, scsit: String },
  tagline: String,
  footerText: { type: String, default: 'Entrepreneurship Cell, SCSIT, DAVV Indore' },
  // home page content (edited from Admin > Home Page)
  hero: {
    headline: { type: String, default: 'Where SCSIT students turn ideas into startups.' },
    description: { type: String, default: 'E-Cell SCSIT is the entrepreneurship community of SCSIT, DAVV.' },
    highlight: String,
  },
  president: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  vicePresident: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  about: { intro: String, davv: String, scsit: String, vision: String, mission: String, objectives: [String],
    timeline: [{ year: String, text: String }], facultyMessage: String },
  hod: { name: String, title: String, message: String, photo: String },       // message from HOD
  stats: [{ value: Number, suffix: String, label: String }],                  // home counters
  sponsors: [String],                                                          // partner / sponsor names
  testimonials: [{ name: String, team: String, text: String }],
  helpDesk: [{ role: String, name: String, phone: String }],
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
