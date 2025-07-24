import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('blog_platform');
}

// Initialize indexes
export async function initializeIndexes() {
  const db = await getDatabase();
  
  // Blog posts indexes
  await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
  await db.collection('posts').createIndex({ createdAt: -1 });
  await db.collection('posts').createIndex({ tags: 1 });
  await db.collection('posts').createIndex({ title: 'text', content: 'text' });
  
  // Users indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  
  // Analytics indexes
  await db.collection('analytics').createIndex({ postId: 1, ip: 1, timestamp: -1 });
  
  console.log('Database indexes initialized');
}