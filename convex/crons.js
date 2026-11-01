import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Dijalankan setiap hari pukul 13:00 UTC (20:00 WIB / 8 malam)
crons.cron(
  "Kirim Pengingat Baca Qur'an",
  "0 13 * * *",
  internal.reading.sendDailyReminder,
);

export default crons;
