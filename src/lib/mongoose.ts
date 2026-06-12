import mongoose from "mongoose";
import { mongoDbUri } from "@/lib/mongodb";

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: CachedConnection;
};

const cached = globalForMongoose.mongooseConnection ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseConnection = cached;

export async function connectMongoose() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!mongoDbUri) {
    throw new Error("Missing MONGODB_URI");
  }

  cached.promise ??= mongoose.connect(mongoDbUri);
  cached.conn = await cached.promise;
  return cached.conn;
}
