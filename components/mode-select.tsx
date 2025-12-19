"use client"

import { Coins, Scale, ArrowLeft } from "lucide-react"

interface ModeSelectProps {
  onSelectMode: (mode: "cash" | "gold") => void
  onBack: () => void
}

export function ModeSelect({ onSelectMode, onBack }: ModeSelectProps) {
  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back / પાછા
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Select Mode</h2>
      <p className="text-gray-600 text-center mb-8">મોડ પસંદ કરો</p>

      <div className="space-y-4">
        <button
          onClick={() => onSelectMode("cash")}
          className="w-full p-6 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <Coins className="w-7 h-7 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-900">Cash Ledger</h3>
            <p className="text-gray-600">રોકડ ખાતાવહી</p>
          </div>
        </button>

        <button
          onClick={() => onSelectMode("gold")}
          className="w-full p-6 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-amber-500 transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
            <Scale className="w-7 h-7 text-amber-600" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-900">Gold Ledger</h3>
            <p className="text-gray-600">સોનાની ખાતાવહી</p>
          </div>
        </button>
      </div>
    </div>
  )
}
