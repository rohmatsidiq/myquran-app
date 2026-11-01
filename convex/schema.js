import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.string(), // Nilai: "user" atau "admin"
    createdAt: v.number(),
    lastActive: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]),

  readingLogs: defineTable({
    userId: v.id("users"),
    date: v.string(), // Format "YYYY-MM-DD"
    surah: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),

  // Tabel untuk menyimpan token push subscription
  pushSubscriptions: defineTable({
    userId: v.id("users"),
    subscription: v.any(),
  }).index("by_userId", ["userId"]),
});
