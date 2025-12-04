import { api } from "./api";
import type { StatusResponse } from "@/types/status";

export async function getServerStatus(): Promise<"online" | "offline"> {
  const response = await api.get<StatusResponse>("/status");

  const serverStatus = response.data.status.toLowerCase(); // "Online" → "online"

  return serverStatus === "online" ? "online" : "offline";
}