// Loads the E-Cell SCSIT content into the database.
//   npm run seed:demo
// REAL data: team, HOD/founders, contact, stats, hackathon + Genesis events, announcements, help desk.
// DEMO data (replace later from the Admin panel): startups, gallery photos, 2 upcoming events,
//                                                  initiatives text, sponsors' logos, blog drafts.
// Safe to run again: it replaces this content and never deletes member / admin accounts.
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { connectDB } from './config/db.js';
import Event from './modules/events/event.model.js';
import Post from './modules/blog/post.model.js';
import TeamMember from './modules/team/member.model.js';
import Startup from './modules/startups/startup.model.js';
import Photo from './modules/gallery/photo.model.js';
import Notification from './modules/notifications/notification.model.js';
import Initiative from './modules/initiatives/initiative.model.js';
import Settings from './modules/settings/settings.model.js';

await connectDB();

fs.mkdirSync('uploads', { recursive: true });
for (const f of fs.readdirSync('seed-assets')) fs.copyFileSync(path.join('seed-assets', f), path.join('uploads', 'demo-' + f));
const img = (n) => `/uploads/demo-${n}.jpg`;
const day = 24 * 3600 * 1000;
const at = (offsetDays, hour = 11) => { const d = new Date(Date.now() + offsetDays * day); d.setHours(hour, 0, 0, 0); return d; };

await Promise.all([Event, Post, TeamMember, Startup, Photo, Notification, Initiative].map((M) => M.deleteMany({})));

// =====================================================================
// EVENTS
// =====================================================================
await Event.insertMany([
  // ----- REAL -----
  {
    title: 'E-Cell SCSIT Hackathon 2026 (26th Edition)', slug: 'hackathon-2026', poster: img('poster-1'), category: 'Hackathon',
    venue: 'Takshashila Campus, Khandwa Road, Indore (M.P.) - 452001',
    description: 'Securing Innovation. Empowering Digital India.\n\nThe flagship annual hackathon of E-Cell SCSIT is a 9-hour coding marathon, now in its 26th edition. Teams of 3-4 students tackle real-world problems across three tracks:\n\n• Artificial Intelligence: build intelligent systems that learn, reason and adapt.\n• Cyber Security: defend the digital frontier with novel security tooling.\n• WebRTC: craft real-time experiences powered by peer-to-peer media.\n\nTotal prize pool ₹21,000 (₹7,000 per domain). Open to students of BCA, PGDCA, M.Sc., MBA, MCA, M.Tech and PhD programs.',
    startDate: new Date('2026-03-17T09:00:00+05:30'), endDate: new Date('2026-03-17T18:00:00+05:30'), registrationOpen: false,
    externalLink: 'https://hackathon.ecellscsit.app',
    rules: ['Team size: 3 to 4 members', 'Registrations are now closed'],
    prizes: ['Total prize pool: ₹21,000', '₹7,000 for each domain: AI, Cyber Security, WebRTC'],
    speakers: [{ name: 'Megha Patidar', role: 'Faculty Mentor' }, { name: 'Deepika Rai', role: 'Faculty Mentor' }, { name: 'Nitin Uikey', role: 'Faculty Mentor' }],
    winners: ['1st · Cyber Security: CROS', '1st · Artificial Intelligence: Cosmic_coders0818', '1st · WebRTC: Bit Code'],
    photos: [img('gallery-1'), img('gallery-6')],
  },
  {
    title: 'Genesis 2K25', slug: 'genesis-2k25', poster: img('poster-2'), category: 'General', venue: 'SCSIT, DAVV Indore',
    // NOTE: exact date was not given. Update it from Admin > Events.
    description: 'Genesis 2K25 brought together competitions and fun events for the whole department:\n\n• No-Code Low-Code Hackathon\n• Ideamania (idea pitching)\n• Techcharades\n• KBC (quiz)\n• Memathon',
    startDate: new Date('2025-04-05T10:00:00+05:30'), registrationOpen: false, externalLink: 'https://ecellkbc.vercel.app',
    photos: [img('gallery-2'), img('gallery-5')],
  },
  // ----- DEMO upcoming events (so the home page has something to show) -----
  {
    title: 'Startup Pitch Night', slug: 'startup-pitch-night', poster: img('poster-3'), category: 'Competition', venue: 'SCSIT Seminar Hall',
    description: 'DEMO EVENT: replace or delete from Admin > Events.\n\nPitch your idea to a panel of mentors and founders.',
    startDate: at(10), endDate: at(10, 16), registrationDeadline: at(9),
    schedule: [{ time: '11:00', title: 'Registration' }, { time: '12:00', title: 'Pitches' }, { time: '15:30', title: 'Results' }],
    rules: ['Teams of 1 to 4', '5 minute pitch + 3 minute Q&A'], prizes: ['Cash prizes and mentorship'],
  },
  {
    title: 'Idea to MVP Workshop', slug: 'idea-to-mvp-workshop', poster: img('poster-4'), category: 'Workshop', venue: 'Computer Lab, SCSIT',
    description: 'DEMO EVENT: replace or delete from Admin > Events.\n\nA hands-on workshop on validating ideas and building a first version.',
    startDate: at(25), endDate: at(25, 16), registrationDeadline: at(24),
  },
]);

// =====================================================================
// TEAM  (REAL names; photos can be added later from Admin > Team)
// =====================================================================
const M = (name, level, role, department, year, extra = {}) => ({ name, level, role, department, year, ...extra });
const FOUNDERS = 'Founders';

const founders = [
  M('Suraj Karan Singh', 1, 'Founder', 'Founders', FOUNDERS, { quote: 'E-Cell was founded not as a student club, but as a mindset: a platform for dreamers, doers, and disruptors to challenge norms with passion and purpose.' }),
  M('Harsh Soni', 2, 'Co-Founder', 'Founders', FOUNDERS, { quote: 'E-Cell is a launchpad for ambition: a space where ideas, innovation, and collaboration transform dreams into reality for every member.' }),
];

const Y24 = '2024-25';
const team24 = [
  M('Dr. Ugrasen Suman', 0, 'Head of Department, SCSIT', '', Y24),
  M('Himanshu Yadav', 1, 'President', 'Core', Y24),
  M('Abhay Rai', 2, 'Vice President', 'Core', Y24),
  M('Abhinav Jain', 3, 'Technical Head', 'Technical', Y24),
  M('Vaishnavi Arya', 5, 'Graphic Designer & Content Creator', 'Design & Content', Y24),
  M('Divya Nagar', 5, 'Graphic Designer & Content Creator', 'Design & Content', Y24),
  M('Niharika Tripathi', 5, 'Content Designer', 'Design & Content', Y24),
  ...['Muskan Sharma', 'Shivangi Tiwari', 'Gourav Patidar', 'Sourav Kumar Khawas', 'Dharika Joshi', 'Atul Panwar', 'Ankit Singh', 'Aniruddh Gupta']
    .map((n) => M(n, 5, 'Co-ordinator', 'Co-ordinators', Y24)),
  M('Samarveer Vyas', 5, 'Class Representative', 'Class Representatives', Y24),
  M('Muskan Soni', 5, 'Class Representative', 'Class Representatives', Y24),
];

// NOTE: this second list had no year label. It is saved as 2025-26. Change in Admin > Team if needed.
const Y25 = '2025-26';
const team25 = [
  M('Dr. Ugrasen Suman', 0, 'Head of Department, SCSIT', '', Y25),
  M('Megha Patidar', 0, 'Faculty Mentor', '', Y25),
  M('Deepika Rai', 0, 'Faculty Mentor', '', Y25),
  M('Nitin Uikey', 0, 'Faculty Mentor', '', Y25),
  M('Madhav Tiwari', 1, 'President', 'Core', Y25),
  M('Sakshi Patil', 2, 'Vice President', 'Core', Y25),
  M('Kanik Pandey', 3, 'Technical Team Head', 'Technical', Y25),
  M('Yogesh Sanodiya', 4, 'Technical Team Leader', 'Technical', Y25),
  M('Nisha Thakur', 4, 'Event Team Leader', 'Events', Y25),
  M('Sanjul Yadav', 4, 'Marketing Team Leader', 'Marketing', Y25),
  M('Hariom Patidar', 4, 'Business Development Team Leader', 'Business Development', Y25),
  ...['Sanskar Jaiswal', 'Prathamesh Jadhav', 'Yamini Soni', 'Ankita Kumari Rai', 'Sumit Singh Pavaiya', 'Saatvik Gupta',
    'Vanshika Agrawal', 'Akshara Yadav', 'Vicky Kuiry', 'Jeshika Peruliya', 'Sania Singh'].map((n) => M(n, 5, 'Co-ordinator', 'Co-ordinators', Y25)),
];
const saved = await TeamMember.insertMany([...founders, ...team24, ...team25].map((m, i) => ({ ...m, order: i })));
const [suraj, harsh] = saved;

// =====================================================================
// INITIATIVES (DEMO descriptions, based on the activities you listed)
// =====================================================================
await Initiative.insertMany([
  { icon: '🎤', title: 'Speaker Sessions', description: 'Talks by founders, alumni and industry leaders about real startup journeys.', order: 1 },
  { icon: '🛠️', title: 'Workshops', description: 'Hands-on sessions on building, validating and launching products.', order: 2 },
  { icon: '🚀', title: 'Startup Bootcamps', description: 'Intensive programs that take students from idea to first prototype.', order: 3 },
  { icon: '🏆', title: 'Hackathon', description: 'Our flagship annual hackathon in AI, Cyber Security and WebRTC, now in its 26th edition.', order: 4 },
  { icon: '💡', title: 'Ideamania', description: 'Pitch your idea to judges and get feedback from mentors.', order: 5 },
  { icon: '🎉', title: 'Genesis Fest', description: 'KBC quiz, Techcharades, Memathon and more: learning with fun.', order: 6 },
]);

// =====================================================================
// STARTUPS + GALLERY (DEMO)
// =====================================================================
await Startup.insertMany([
  { name: 'EduNest', logo: img('startup-1'), founders: 'Demo Founder', domain: 'EdTech', description: 'Demo: affordable peer tutoring for students.', showOnHome: true },
  { name: 'AgroLink', logo: img('startup-2'), founders: 'Demo Founder', domain: 'AgriTech', description: 'Demo: connects local farmers with buyers.', showOnHome: true },
  { name: 'FinPilot', logo: img('startup-3'), founders: 'Demo Founder', domain: 'FinTech', description: 'Demo: simple budgeting for first-time earners.', showOnHome: true },
  { name: 'CodeCart', logo: img('startup-4'), founders: 'Demo Founder', domain: 'DevTools', description: 'Demo: ready-made components for student projects.', showOnHome: true },
]);
const caps = [['Hackathon 2026', '2026'], ['Genesis 2K25', '2025'], ['Team Meetup', '2026'], ['Workshop', '2025'], ['Speaker Session', '2025'], ['Winners', '2026'], ['Mentor Session', '2026'], ['Demo Day', '2025']];
await Photo.insertMany(caps.map(([c, y], i) => ({ url: img(`gallery-${i + 1}`), caption: c, event: c, year: y, showOnHome: true, showInHero: i < 4 })));

// =====================================================================
// BLOG (drafted from your 3 post outlines: paste the original text from Admin > Blog to replace)
// =====================================================================
await Post.insertMany([
  {
    title: 'From Campus to Customer: How Student Entrepreneurs Can Launch Their First Product', slug: 'campus-to-customer', cover: img('blog-1'),
    category: 'Startup Tips', author: 'E-Cell SCSIT', published: true, publishedAt: new Date('2026-10-18T10:00:00+05:30'),
    excerpt: 'A simple 7-step roadmap to take your first product from idea to real users.',
    content: `Having an idea is easy. Getting it into the hands of a real customer is the hard part. Here is a simple roadmap for student founders.

1. Define Your First Customer
Do not build for "everyone". Pick one small group of people, for example first-year students who struggle with notes, and write down their problem in one sentence.

2. Research Before You Build
Talk to at least ten people from that group. Listen to how they solve the problem today.

3. Build a Simple First Version
A form, a spreadsheet or a short prototype is enough. The goal is to learn, not to impress.

4. Launch to a Small Group
Share it with 10 to 20 people you can reach directly and watch how they use it.

5. Measure What Matters
Track one or two numbers, such as sign-ups or repeat use, instead of vanity numbers.

6. Turn Feedback Into Improvements
Fix the biggest complaint first, then release again.

7. Find Customers Through Your Community
Your classmates, clubs and campus groups are your first market.

Seven-Day Launch Challenge
Day 1: Choose your customer. Day 2: Interview three people. Day 3: Interview three more. Day 4: Build the simplest version. Day 5: Share it with five people. Day 6: Collect feedback. Day 7: Improve and share again.

The E-Cell Perspective
At E-Cell SCSIT we believe every idea deserves a first customer. Come to our events, find teammates and start small.`,
  },
  {
    title: 'The Co-Founder Trap: How to Build a Startup Team That Actually Works', slug: 'co-founder-trap', cover: img('blog-2'),
    category: 'Startup Tips', author: 'E-Cell SCSIT', published: true, publishedAt: new Date('2026-10-11T10:00:00+05:30'),
    excerpt: 'Why choosing friends is not enough, and 6 steps to build a team that lasts.',
    content: `Many student startups end because of team problems, not because of bad ideas. Here is how to avoid the co-founder trap.

1. Start With Your Needs, Not Your Friends
List the skills your startup needs first. Then look for people who bring them.

2. Look for Complementary Skills
A team of three developers will struggle to sell. Mix builders, designers and people who talk to customers.

3. Have Difficult Conversations Early
Talk openly about time commitment, responsibilities and equity before you start, not after.

4. Work Together Before Long-Term Commitments
Do a small project together first. See how you handle deadlines and stress.

5. Disagree Productively
Disagreement is healthy. Argue about ideas, not people, and agree how final decisions are made.

6. Build Accountability
Set clear weekly goals, review them together and be honest when someone is stuck.

Seven-Day Team Experiment
Pick a tiny project with your potential co-founder. Day 1: agree on the goal. Days 2 to 6: build and meet daily for five minutes. Day 7: review what worked and what did not.`,
  },
  {
    title: "Your First Startup Doesn't Need Funding: Start Building With What You Have", slug: 'start-without-funding', cover: img('blog-3'),
    category: 'Startup Tips', author: 'E-Cell SCSIT', published: true, publishedAt: new Date('2026-10-04T10:00:00+05:30'),
    excerpt: 'You can begin today with the resources you already have. Here is how.',
    content: `Waiting for funding is the most common reason students never start. You can begin today.

1. Take Inventory of Existing Resources
Write down your skills, your laptop, free tools, your network and your time. This is your starting capital.

2. Build the Smallest Useful Version (MVP)
Ask what is the least you must build for a user to get value. Build only that.

3. Find First Users Before Spending on Marketing
Start with friends of friends, class groups and communities. Ask for honest feedback.

4. Understand When You Actually Need Funding
Funding helps when you have proof that people want your product and you know exactly what money will be used for.

5. Measure Learning, Not Just Growth
Ask "What did we learn this week?" Learning is your real progress at the beginning.

Weekend Challenge
On Saturday build the smallest version of your idea. On Sunday show it to five people and write down what they say.`,
  },
]);

// =====================================================================
// ANNOUNCEMENTS (REAL, from your site) + bell
// =====================================================================
await Notification.insertMany([
  { type: 'announcement', title: 'Hackathon: Indore city level hackathon (AI, Cybersecurity and WebRTC)', body: 'Visit the hackathon website for details.', link: 'https://hackathon.ecellscsit.app', createdAt: new Date('2026-03-01T18:43:12+05:30') },
  { type: 'announcement', title: 'Our KBC Quiz website is here!', body: 'Register and join the KBC.', link: 'https://ecellkbc.vercel.app', createdAt: new Date('2025-04-04T03:04:15+05:30') },
  { type: 'announcement', title: 'Genesis 2K25 is here!', body: 'Register for No-Code Low-Code Hackathon, Ideamania, Techcharades, KBC and Memathon. Hurry up!', link: '/events/genesis-2k25', createdAt: new Date('2025-03-29T17:17:38+05:30') },
  { type: 'announcement', title: 'Welcome to the new E-Cell SCSIT website', body: 'Join E-Cell to get event and blog updates.', link: '/register', createdAt: new Date() },
]);

// =====================================================================
// SITE SETTINGS (REAL content from your two sites)
// =====================================================================
await Settings.findOneAndUpdate({ key: 'site' }, {
  email: 'ecellscsit@gmail.com',
  address: 'SCSIT, Takshashila Campus, Khandwa Road, Indore, M.P. - 452001',
  mapLink: 'https://www.google.com/maps?q=SCSIT+Takshashila+Campus+Khandwa+Road+Indore',
  social: { instagram: 'https://www.instagram.com/ecell_scsit', linkedin: 'https://www.linkedin.com/company/ecell-scsit/', scsit: 'https://www.instagram.com/scsitofficial' },
  footerText: 'Entrepreneurship Cell, School of Computer Science & IT, DAVV Indore.',
  tagline: 'Be The Few, Be The Fearless',
  hero: {
    headline: 'Empowering Students To INNOVATE',
    description: 'Building a community of student entrepreneurs, innovators and leaders through various initiatives, events and opportunities.',
    highlight: 'Genesis, Hackathons, Ideamania and more. Explore our events!',
  },
  president: suraj._id, vicePresident: harsh._id,      // home "Leadership" section shows the Founder and Co-Founder
  hod: {
    name: 'Dr. Ugrasen Suman', title: 'Head of Department, SCSIT',
    message: 'We wish all students for achieving their academic excellence with life skills. We will always look forward to achieving the heights of accomplishment towards holistic development of students.',
  },
  stats: [
    { value: 10, suffix: '+', label: 'Events Organized' }, { value: 1300, suffix: '+', label: 'Students Impacted' },
    { value: 6, suffix: '+', label: 'Startups Incubated' }, { value: 15, suffix: '+', label: 'Industry Partners' },
  ],
  sponsors: ['Unison House', 'Vision', 'MoreYeahs', 'Trishul REC'],
  testimonials: [   // DEMO: from the hackathon site; replace with real feedback
    { name: 'Aarav Sharma', team: 'Team Innovators', text: 'The organization, mentorship and real-world problem statements pushed our team to think beyond limits. We built a working prototype and gained confidence in our skills.' },
    { name: 'Priya Verma', team: 'TechNova Team', text: 'One of the best hackathons I have attended. The event was well structured and the support from mentors and organizers was amazing.' },
    { name: 'Rohan Gupta', team: 'CodeCrafters 2026', text: 'From registration to final presentations everything was seamless. It helped us learn teamwork, problem-solving and time management.' },
  ],
  helpDesk: [
    { role: 'Hackathon Organizers', name: 'Madhav Tiwari', phone: '+91 62327 87744' },
    { role: 'Hackathon Organizers', name: 'Abhay Rai', phone: '+91 99716 12509' },
    { role: 'Hackathon Organizers', name: 'Ankit Singh', phone: '+91 90093 66428' },
    { role: 'Tech Support', name: 'Sakshi Patil', phone: '+91 88274 67903' },
    { role: 'Tech Support', name: 'Kanik Pandey', phone: '+91 99930 89250' },
    { role: 'Tech Support', name: 'Yogesh Sanodiya', phone: '+91 94067 07351' },
    { role: 'Registration Support', name: 'Vaishnavi Arya', phone: '+91 98939 38329' },
    { role: 'Registration Support', name: 'Samarveer Vyas', phone: '+91 79990 32851' },
    { role: 'Registration Support', name: 'Nisha Thakur', phone: '+91 98932 87468' },
  ],
  about: {
    intro: 'Entrepreneurship Cell is a student body based in SCSIT, DAVV Indore that aims at fostering entrepreneurial spirit among young aspirants by providing a platform and resources to turn ideas into successful ventures. E-Cell strives to establish a thriving, ever-growing startup ecosystem on campus, with a diverse pool of investors, mentors and thought-leaders to guide emerging entrepreneurs.',
    davv: "Devi Ahilya Vishwavidyalaya (DAVV), established in 1964 in Indore, Madhya Pradesh, is one of India's leading universities. Named after the legendary Maratha queen Devi Ahilya Bai Holkar, it is recognized by UGC and accredited with an A++ grade by NAAC.",
    scsit: 'The School of Computer Science & Information Technology (SCSIT) is a premier department of DAVV, offering programs from BCA to Ph.D. in Computer Science, known for rigorous academics and an industry-aligned curriculum.',
    vision: 'To become a leading platform that inspires innovation, supports disruptive ideas, and nurtures a generation of change-makers who contribute to sustainable technological and societal growth.',
    mission: 'To build an entrepreneurial culture by equipping students with skills, resources, and mentorship needed to transform ideas into impactful ventures. We seek to bridge academia and industry while nurturing a high-growth startup ecosystem.',
    objectives: ['Foster an entrepreneurial spirit among students', 'Provide a platform and resources to turn ideas into ventures', 'Build a pool of investors, mentors and thought-leaders', 'Bridge academia and industry'],
    timeline: [
      { year: '2025', text: 'Genesis 2K25: No-Code Low-Code Hackathon, Ideamania, Techcharades, KBC and Memathon' },
      { year: '2026', text: '26th edition of the E-Cell SCSIT Hackathon with AI, Cyber Security and WebRTC tracks' },
    ],
  },
}, { upsert: true, new: true });

console.log('✅ Content loaded: team (%d people), events, initiatives, blog, announcements, settings.', saved.length);
process.exit(0);
