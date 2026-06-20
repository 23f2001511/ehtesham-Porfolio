import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

function getMongooseCache(): MongooseCache {
  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = {
      conn: null,
      promise: null
    };
  }

  return globalWithMongoose.mongooseCache;
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined. Add it to your environment variables.");
  }

  const cache = getMongooseCache();

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    });
  }

  cache.conn = await cache.promise;

  return cache.conn;
}
