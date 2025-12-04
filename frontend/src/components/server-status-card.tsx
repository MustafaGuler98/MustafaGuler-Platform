"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getServerStatus } from "@/lib/status";

export default function ServerStatusCard() {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading");

  useEffect(() => {
    async function load() {
      try {
        const result = await getServerStatus();
        setStatus(result === "online" ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    }

    load();
  }, []);

  return (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>Sunucu Durumu</CardTitle>
      </CardHeader>

      <CardContent>
        {status === "loading" && (
          <Badge variant="secondary" className="text-gray-600">
            Yükleniyor...
          </Badge>
        )}

        {status === "online" && (
          <Badge className="bg-green-600 hover:bg-green-700">
            🟢 Çevrimiçi
          </Badge>
        )}

        {status === "offline" && (
          <Badge className="bg-red-600 hover:bg-red-700">
            🔴 Çevrimdışı
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
