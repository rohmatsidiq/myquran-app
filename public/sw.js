// public/sw.js
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Pengingat MyQur'an ✨";
  const options = {
    body:
      data.body ||
      "Yuk, luangkan waktu sejenak untuk membaca Al-Qur'an hari ini.",
    icon: "/favicon.ico", // Sesuaikan dengan ikon aplikasi Anda
    badge: "/favicon.ico",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/"), // Membuka aplikasi saat notifikasi diklik
  );
});
