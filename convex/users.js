import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Menyimpan data user baru atau memperbarui data jika user sudah ada.
 * Dipanggil otomatis di frontend saat user berhasil login melalui Clerk.
 */
export const storeUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Cek apakah user sudah terdaftar di database berdasarkan clerkId
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const adminEmails = ["rohmatsidiq9@gmail.com", "admin@alquran.com"]; // Masukkan email admin Anda di sini
    const role = adminEmails.includes(args.email) ? "admin" : "user";
    const currentTime = Date.now(); // <-- Definisikan currentTime di sini agar tidak error

    if (existingUser) {
      // Jika user sudah ada, perbarui nama, imageUrl, atau lastActive jika ada perubahan
      await ctx.db.patch(existingUser._id, {
        name: args.name || existingUser.name,
        imageUrl: args.imageUrl || existingUser.imageUrl,
        lastActive: currentTime,
      });
      return existingUser._id;
    }

    // 2. Jika belum ada, masukkan data user baru ke database Convex
    const newUserId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name || "",
      imageUrl: args.imageUrl || "",
      role: role,
      createdAt: currentTime,
      lastActive: currentTime,
    });

    return newUserId;
  },
});

/**
 * Mengambil data detail user berdasarkan clerkId untuk keperluan pengecekan role di frontend.
 */
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Query khusus admin untuk mengambil seluruh daftar user beserta aktivitasnya
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
