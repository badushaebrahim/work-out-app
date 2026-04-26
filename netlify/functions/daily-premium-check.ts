import type { Config } from "@netlify/functions";
import mongoose from "mongoose";
import User from "../../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function (req: Request) {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    return new Response("Database configuration missing", { status: 500 });
  }

  try {
    // Ensure database connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    const now = new Date();

    // Query MongoDB: Find all premium users whose expiry date has passed,
    // downgrade their role to 'basic', and set premiumValidUntil to null.
    const result = await User.updateMany(
      {
        role: "premium",
        premiumValidUntil: { $lt: now }
      },
      {
        $set: { 
          role: "basic",
          premiumValidUntil: null 
        }
      }
    );

    console.log(`[Premium Check CRON] Successfully downgraded ${result.modifiedCount} users to basic.`);

    return new Response(`Processed premium expiries. Downgraded ${result.modifiedCount} users.`, { status: 200 });
  } catch (error) {
    console.error("[Premium Check CRON] Error executing cron:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Netlify will automatically trigger this function at the start of every day (Midnight UTC)
export const config: Config = {
  schedule: "@daily"
};
