import React, { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Konversi VAPID key dari string base64 ke Uint8Array (dibutuhkan untuk browser push)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const { isSignedIn, user } = useUser();
  const saveSubscription = useMutation(api.reading.savePushSubscription);

  useEffect(() => {
    const registerServiceWorkerAndSubscribe = async () => {
      if (!isSignedIn || !user) return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        // 1. Daftarkan Service Worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        // 2. Minta Izin Notifikasi dari User
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("Izin notifikasi ditolak oleh pengguna.");
          return;
        }

        // 3. Buat Push Subscription
        // Masukkan Public VAPID Key Anda di sini (biasanya dari env atau generator VAPID)
        const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription && publicVapidKey && publicVapidKey !== "BEl...") {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });
        }

        // 4. Simpan ke Database Convex jika berhasil
        if (subscription) {
          await saveSubscription({
            clerkId: user.id,
            subscription: subscription,
          });
          console.log("Push subscription berhasil disimpan ke Convex!");
        }
      } catch (error) {
        console.error("Gagal mendaftarkan push notification:", error);
      }
    };

    registerServiceWorkerAndSubscribe();
  }, [isSignedIn, user, saveSubscription]);

  return null; // Komponen pendukung latar belakang (tidak merender UI)
}
