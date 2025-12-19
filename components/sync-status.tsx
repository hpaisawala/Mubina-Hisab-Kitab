"use client"

import { Circle } from "lucide-react"
import type { SyncStatus } from "@/lib/types"

interface SyncStatusProps {
  status: SyncStatus
  pendingCount: number
}

export function SyncStatusIndicator({ status, pendingCount }: SyncStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "syncing":
        return "text-yellow-500 animate-pulse"
      case "offline":
        return "text-red-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Online / ઓનલાઇન"
      case "syncing":
        return `Syncing ${pendingCount}... / સમન્વય...`
      case "offline":
        return `Offline (${pendingCount} pending) / ઓફલાઇન`
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Circle className={`w-3 h-3 fill-current ${getStatusColor()}`} />
      <span className="text-gray-600">{getStatusText()}</span>
    </div>
  )
}
