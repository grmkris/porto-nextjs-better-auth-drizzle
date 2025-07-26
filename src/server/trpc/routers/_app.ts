import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { db } from "@/server/db/drizzle";
import { user, walletAddress } from "@/server/db/schema.db";
import { eq } from "drizzle-orm";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string().optional() }).optional())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}!`,
      };
    }),

  // Protected procedures
  profile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;

    const userProfile = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return userProfile[0] || null;
  }),

  walletAddresses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;

    const addresses = await db
      .select()
      .from(walletAddress)
      .where(eq(walletAddress.userId, userId))
      .orderBy(walletAddress.isPrimary, walletAddress.createdAt);

    return addresses;
  }),

  userStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;

    const [userInfo] = await db
      .select({
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        emailVerified: user.emailVerified,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const walletCount = await db
      .select()
      .from(walletAddress)
      .where(eq(walletAddress.userId, userId));

    return {
      ...userInfo,
      walletCount: walletCount.length,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;

      const updated = await db
        .update(user)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.email && { email: input.email }),
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning();

      return updated[0];
    }),
});

export type AppRouter = typeof appRouter;
