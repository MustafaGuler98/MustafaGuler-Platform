"use client";

import { useEffect, useState } from "react";
import { getServerStatus } from "@/lib/status";

export default function StatusPage() {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading");

  useEffect(() => {
    async function load() {
      try {
        const result = await getServerStatus();
        setStatus(result);
      } catch {
        setStatus("offline");
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1>Sunucu Durumu:</h1>
      {status === "loading" && "Yükleniyor..."}
      {status === "online" && "🟢 Çevrimiçi"}
      {status === "offline" && "🔴 Çevrimdışı"}
    </div>
  );
}
