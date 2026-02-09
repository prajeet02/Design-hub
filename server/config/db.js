import mongoose from "mongoose";

const normalizeMongoUri = (raw) => {
  if (!raw || typeof raw !== "string") return raw;
  const uri = raw.trim();

  // Fix common copy/paste mistake with passwords that contain `@`.
  // Example bad URI (what you provided):
  //   mongodb+srv://user:pass%40@12@cluster.mongodb.net/?appName=...
  // Correct form (password is pass@12 => pass%4012):
  //   mongodb+srv://user:pass%4012@cluster.mongodb.net/?appName=...
  // Strategy: if we find two '@' symbols after the protocol and the chunk between them is only digits,
  // treat that digits chunk as an accidental split of the password suffix and stitch it back.
  const protoIdx = uri.indexOf("://");
  if (protoIdx === -1) return uri;
  const start = protoIdx + 3;
  const firstAt = uri.indexOf("@", start);
  if (firstAt === -1) return uri;
  const secondAt = uri.indexOf("@", firstAt + 1);
  if (secondAt === -1) return uri;

  const between = uri.slice(firstAt + 1, secondAt);
  const creds = uri.slice(start, firstAt);
  if (/^[0-9]+$/.test(between) && creds.includes("%40")) {
    return uri.slice(0, firstAt) + between + uri.slice(secondAt);
  }

  return uri;
};

const connectDB = async () => {
  const MONGO_URI = normalizeMongoUri(process.env.MONGO_URI);
  if (!MONGO_URI) {
    console.log("failed to connect to the database :(");
    console.error("MONGO_URI is missing");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connection to the database successful :)");
  } catch (error) {
    console.log("failed to connect to the database :(");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
