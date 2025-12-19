"use client"

import { ArrowLeft, Phone, Archive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SyncStatus } from "@/lib/types"
import { SyncStatusIndicator } from "./sync-status"

interface SettingsScreenProps {
  syncStatus: SyncStatus
  pendingCount: number
  onViewArchived: () => void
  onBack: () => void
  onForceSync: () => void
}

export function SettingsScreen({ syncStatus, pendingCount, onViewArchived, onBack, onForceSync }: SettingsScreenProps) {
  const handleCallSupport = () => {
    window.location.href = "tel:+919876543210"
  }

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back / પાછા
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
      <p className="text-gray-600 mb-6">સેટિંગ્સ</p>

      <div className="space-y-4">
        {/* Sync Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Sync Status / સમન્વય સ્થિતિ</h3>
          <SyncStatusIndicator status={syncStatus} pendingCount={pendingCount} />

          {pendingCount > 0 && (
            <Button
              onClick={onForceSync}
              variant="outline"
              size="sm"
              className="mt-3 gap-2 bg-transparent"
              disabled={syncStatus === "syncing"}
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
              Sync Now / હમણાં સમન્વય કરો
            </Button>
          )}
        </div>

        {/* View Archived */}
        <button
          onClick={onViewArchived}
          className="w-full bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <Archive className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">View Archived Contacts</h3>
            <p className="text-sm text-gray-600">આર્કાઇવ થયેલ સંપર્કો જુઓ</p>
          </div>
        </button>

        {/* Call Support */}
        <button
          onClick={handleCallSupport}
          className="w-full bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Call Support</h3>
            <p className="text-sm text-gray-600">સપોર્ટને કૉલ કરો</p>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Hisab v1.0.0</p>
        <p>હિસાબ - Your Financial Ledger</p>
      </div>
    </div>
  )
}
