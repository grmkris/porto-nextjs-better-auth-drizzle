import { db } from "../src/server/db/drizzle";
import { user, session, walletAddress } from "../src/server/db/schema.db";
import { randomBytes } from "crypto";

// Generate random IDs
function generateId(): string {
  return randomBytes(16).toString("hex");
}

// Generate random wallet address
function generateWalletAddress(): string {
  return "0x" + randomBytes(20).toString("hex");
}

// Generate random date within the last N days
function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

async function populateMockData() {
  console.log("Starting to populate mock data...");

  try {
    // Create users with different creation dates
    const userIds: string[] = [];

    // Users from more than 30 days ago (for historical comparison)
    console.log("Creating historical users (>30 days ago)...");
    for (let i = 0; i < 15; i++) {
      const userId = generateId();
      userIds.push(userId);

      const createdAt = randomDate(45); // 31-45 days ago
      await db.insert(user).values({
        id: userId,
        name: `Historical User ${i + 1}`,
        email: `historical${i + 1}@example.com`,
        emailVerified: Math.random() > 0.3,
        createdAt,
        updatedAt: createdAt,
        role: i === 0 ? "admin" : "user",
      });
    }

    // Users from the last 30 days
    console.log("Creating recent users (last 30 days)...");
    for (let i = 0; i < 25; i++) {
      const userId = generateId();
      userIds.push(userId);

      const createdAt = randomDate(30);
      await db.insert(user).values({
        id: userId,
        name: `Recent User ${i + 1}`,
        email: `recent${i + 1}@example.com`,
        emailVerified: Math.random() > 0.2,
        createdAt,
        updatedAt: createdAt,
        role: "user",
      });
    }

    // Users from the last 24 hours
    console.log("Creating very recent users (last 24 hours)...");
    for (let i = 0; i < 8; i++) {
      const userId = generateId();
      userIds.push(userId);

      const createdAt = randomDate(1);
      await db.insert(user).values({
        id: userId,
        name: `New User ${i + 1}`,
        email: `new${i + 1}@example.com`,
        emailVerified: false,
        createdAt,
        updatedAt: createdAt,
        role: "user",
      });
    }

    // Users from 24-48 hours ago (for daily comparison)
    console.log("Creating yesterday's users (24-48 hours ago)...");
    for (let i = 0; i < 5; i++) {
      const userId = generateId();
      userIds.push(userId);

      const createdAt = new Date(Date.now() - (36 + i * 2) * 60 * 60 * 1000); // 36-44 hours ago
      await db.insert(user).values({
        id: userId,
        name: `Yesterday User ${i + 1}`,
        email: `yesterday${i + 1}@example.com`,
        emailVerified: false,
        createdAt,
        updatedAt: createdAt,
        role: "user",
      });
    }

    // Create sessions (some historical, some current)
    console.log("Creating sessions...");
    const activeUserIds = userIds.slice(-30); // Last 30 users have sessions

    for (const userId of activeUserIds) {
      const sessionCreatedAt = randomDate(7); // Sessions from last week
      const expiresAt = new Date(
        sessionCreatedAt.getTime() + 7 * 24 * 60 * 60 * 1000,
      ); // 7 days expiry

      await db.insert(session).values({
        id: generateId(),
        userId,
        token: generateId(),
        createdAt: sessionCreatedAt,
        updatedAt: sessionCreatedAt,
        expiresAt,
        userAgent: "Mozilla/5.0 (Mock Data Generator)",
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      });
    }

    // Create wallet addresses
    console.log("Creating wallet addresses...");
    const walletUserIds = userIds.slice(-35); // Last 35 users have wallets

    for (const userId of walletUserIds) {
      const walletCreatedAt = randomDate(20);

      await db.insert(walletAddress).values({
        id: generateId(),
        userId,
        address: generateWalletAddress(),
        chainId: Math.random() > 0.5 ? 8453 : 84532, // Base or Base Sepolia
        isPrimary: true,
        createdAt: walletCreatedAt,
      });

      // Some users have multiple wallets
      if (Math.random() > 0.7) {
        await db.insert(walletAddress).values({
          id: generateId(),
          userId,
          address: generateWalletAddress(),
          chainId: Math.random() > 0.5 ? 8453 : 84532,
          isPrimary: false,
          createdAt: new Date(walletCreatedAt.getTime() + 24 * 60 * 60 * 1000),
        });
      }
    }

    console.log("Mock data population completed successfully!");
    console.log(`Created ${userIds.length} users`);
    console.log(`Created ${activeUserIds.length} sessions`);
    console.log(`Created wallets for ${walletUserIds.length} users`);
  } catch (error) {
    console.error("Error populating mock data:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
populateMockData();
