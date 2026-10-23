// Tests your MongoDB connection and tells you what to fix.   npm run db:check
import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || '';
const hide = (u) => u.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

console.log('\n🔎 Checking MongoDB connection');
console.log('   MONGO_URI =', uri ? hide(uri) : '(empty)');

if (!uri) { console.log('\n❌ MONGO_URI is empty in server/.env\n'); process.exit(1); }
if (/<password>|<db_password>|USER:PASSWORD|YOUR_/i.test(uri))
  { console.log('\n❌ You still have a placeholder in MONGO_URI. Replace <password> (and the angle brackets) with your real database-user password.\n'); process.exit(1); }
if (uri.startsWith('mongodb+srv://') && !/mongodb\.net\/[^?]+/.test(uri))
  console.log('⚠️  No database name in the URI. Add it after .mongodb.net/ , e.g. ...mongodb.net/ecell_scsit?retryWrites=true&w=majority');

try {
  const t = Date.now();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`\n✅ Connected in ${Date.now() - t} ms  (database: "${mongoose.connection.name}")`);
  const cols = await mongoose.connection.db.listCollections().toArray();
  console.log(`   Collections found: ${cols.length ? cols.map((c) => c.name).join(', ') : 'none yet (run npm run seed / seed:demo)'}`);
  console.log('\nAll good. Next:  npm run seed   then   npm run seed:demo   then   npm run dev\n');
  process.exit(0);
} catch (e) {
  console.log('\n❌ Could not connect:', e.message, '\n');
  const m = e.message.toLowerCase();
  if (m.includes('bad auth') || m.includes('authentication failed'))
    console.log('Fix: wrong user/password. In Atlas → Database Access, check the user, or edit it and set a new simple password (letters + numbers). Encode symbols (@ → %40).');
  else if (m.includes('enotfound') || m.includes('querysrv'))
    console.log('Fix: the cluster address is wrong or you are offline. In Atlas click Connect → Drivers and copy the string again.');
  else
    console.log('Fix: Atlas → Network Access → Add IP Address → "Allow access from anywhere" (for testing). For local MongoDB, start the MongoDB service.');
  console.log();
  process.exit(1);
}
