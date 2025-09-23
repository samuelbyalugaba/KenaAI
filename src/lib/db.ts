
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {});
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, {});
    clientPromise = client.connect();
}

let db: Db;
let indexesCreated = false;

async function createIndexes(db: Db) {
    if (indexesCreated) return;

    try {
        await Promise.all([
            db.collection('agents').createIndex({ companyId: 1 }),
            db.collection('agents').createIndex({ email: 1 }),
            db.collection('contacts').createIndex({ companyId: 1 }),
            db.collection('contacts').createIndex({ email: 1 }),
            db.collection('chats').createIndex({ companyId: 1 }),
            db.collection('chats').createIndex({ userId: 1 }),
            db.collection('messages').createIndex({ companyId: 1, sender: 1, timestamp: 1 }),
            db.collection('announcements').createIndex({ companyId: 1 }),
            db.collection('campaigns').createIndex({ companyId: 1 }),
        ]);
        console.log('Database indexes created successfully.');
        indexesCreated = true;
    } catch (error) {
        console.error('Error creating database indexes:', error);
    }
}


export async function getDb(): Promise<Db> {
    if (db) {
        return db;
    }
    const mongoClient = await clientPromise;
    const dbName = new URL(uri).pathname.substring(1) || 'kena-ai';
    db = mongoClient.db(dbName);
    console.log(`Connected to database: ${db.databaseName}`);
    
    // Ensure indexes are created after connection
    await createIndexes(db);

    return db;
}

    