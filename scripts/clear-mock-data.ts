import { db } from "../src/server/db/drizzle";
import {
  user,
  session,
  walletAddress,
  account,
  verification,
} from "../src/server/db/schema.db";
import { sql } from "drizzle-orm";

async function clearMockData() {
  console.log("Starting to clear all data...");

  try {
    // Delete in order to respect foreign key constraints
    console.log("Deleting wallet addresses...");
    await db.delete(walletAddress);

    console.log("Deleting sessions...");
    await db.delete(session);

    console.log("Deleting accounts...");
    await db.delete(account);

    console.log("Deleting verifications...");
    await db.delete(verification);

    console.log("Deleting users...");
    await db.delete(user);

    // Get counts to verify
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(user);
    const [sessionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(session);
    const [walletCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(walletAddress);

    console.log("\nData cleared successfully!");
    console.log(`Remaining users: ${userCount.count}`);
    console.log(`Remaining sessions: ${sessionCount.count}`);
    console.log(`Remaining wallets: ${walletCount.count}`);
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
clearMockData();
