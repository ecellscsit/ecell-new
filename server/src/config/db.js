import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('\n❌ MONGO_URI is empty. Open server/.env and set it.\n');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`✅ MongoDB connected (${mongoose.connection.name})`);
  } catch (err) {
    console.error('\n❌ MongoDB connection failed:', err.message);
    const m = err.message.toLowerCase();
    if (m.includes('authentication failed') || m.includes('bad auth'))
      console.error('   → Wrong username or password in MONGO_URI. If the password has symbols like @ : / # ? encode them (@ = %40, # = %23).');
    else if (m.includes('enotfound') || m.includes('querysrv'))
      console.error('   → Cluster address is wrong, or you are offline. Copy the connection string again from Atlas.');
    else if (m.includes('server selection') || m.includes('timed out') || m.includes('econnrefused'))
      console.error('   → Atlas: add your IP in Network Access (or allow 0.0.0.0/0 for testing).\n   → Local MongoDB: make sure the MongoDB service is running.');
    console.error('   Run  npm run db:check --prefix server  for a step-by-step test.\n');
    process.exit(1);
  }
}
