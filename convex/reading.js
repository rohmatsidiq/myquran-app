import {
  mutation,
  query,
  internalMutation,
  internalAction,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Catatan: Karena library web-push menyebabkan error bundler Node.js di Convex,
// kita bisa menggunakan pendekatan enkripsi standar atau memanggil layanan pihak ketiga / fetch.
// Namun, jika ingin tetap menggunakan logika internal, kita buat action aman berikut:

export const sendPushNotification = internalAction({
  args: { subscription: v.any(), message: v.string() },
  handler: async (ctx, args) => {
    // Karena web-push butuh library tambahan yang tidak kompatibel langsung dengan bundler Convex,
    // alternatif terbaik di Convex adalah menggunakan layanan pihak ketiga seperti Fcm/OneSignal,
    // atau melakukan sign VAPID manual.
    console.log("Mengirim notifikasi ke endpoint:", args.subscription.endpoint);
    try {
      const response = await fetch(args.subscription.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          TTL: "60",
        },
        body: JSON.stringify({
          title: "Pengingat MyQur'an ✨",
          body: args.message,
        }),
      });
      if (response.ok) {
        console.log("Notifikasi berhasil dikirim via endpoint!");
      }
    } catch (error) {
      console.error("Gagal mengirim notifikasi:", error);
    }
  },
});

export const sendDailyReminder = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    const allUsers = await ctx.db.query("users").collect();

    for (const user of allUsers) {
      const logHariIni = await ctx.db
        .query("readingLogs")
        .withIndex("by_user_and_date", (q) =>
          q.eq("userId", user._id).eq("date", today),
        )
        .unique();

      if (!logHariIni) {
        const pushSub = await ctx.db
          .query("pushSubscriptions")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .unique();

        if (pushSub && pushSub.subscription) {
          await ctx.scheduler.runAfter(
            0,
            internal.reading.sendPushNotification,
            {
              subscription: pushSub.subscription,
              message:
                "Halo, yuk luangkan waktu sejenak untuk membaca Al-Qur'an hari ini ya! ✨",
            },
          );
        }
      }
    }
  },
});

// (Biarkan fungsi getReadingLogs, logReading, dan savePushSubscription seperti sebelumnya)

// Simpan push subscription dari frontend
export const savePushSubscription = mutation({
  args: {
    clerkId: v.string(),
    subscription: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User tidak ditemukan");

    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { subscription: args.subscription });
    } else {
      await ctx.db.insert("pushSubscriptions", {
        userId: user._id,
        subscription: args.subscription,
      });
    }
  },
});

// Ambil riwayat/tracking bacaan user berdasarkan clerkId
export const getReadingLogs = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.clerkId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("readingLogs")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Tambah atau tandai selesai baca pada tanggal tertentu
export const logReading = mutation({
  args: {
    clerkId: v.string(),
    date: v.string(), // Format "YYYY-MM-DD"
    surah: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User tidak ditemukan");

    const existingLog = await ctx.db
      .query("readingLogs")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date),
      )
      .unique();

    if (existingLog) {
      return await ctx.db.patch(existingLog._id, { surah: args.surah });
    } else {
      return await ctx.db.insert("readingLogs", {
        userId: user._id,
        date: args.date,
        surah: args.surah,
      });
    }
  },
});
