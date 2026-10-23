// Creates the first admin account. Run once:  npm run seed
import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './modules/users/user.model.js';

await connectDB();
const email = process.env.ADMIN_EMAIL;
if (await User.findOne({ email })) console.log('Admin already exists');
else {
  await User.create({ name: 'Admin', email, password: process.env.ADMIN_PASSWORD, role: 'admin', emailVerified: true });
  console.log(`Admin created: ${email}`);
}
process.exit(0);
