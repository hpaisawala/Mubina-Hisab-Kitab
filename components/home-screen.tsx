"use client"

import { BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ViewMode } from "@/lib/types"

interface HomeScreenProps {
  onNavigate: (view: ViewMode) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hisab</h1>
        <p className="text-xl text-gray-600">હિસાબ</p>
        <p className="text-sm text-gray-500 mt-2">Your Financial Ledger / તમારી નાણાકીય ખાતાવહી</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <Button
          onClick={() => onNavigate("mode-select")}
          className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
          size="lg"
        >
          <BookOpen className="w-5 h-5 mr-3" />
          Open Ledger / ખાતાવહી ખોલો
        </Button>

        <Button onClick={() => onNavigate("settings")} variant="outline" className="w-full h-12" size="lg">
          <Settings className="w-5 h-5 mr-3" />
          Settings / સેટિંગ્સ
        </Button>
      </div>
    </div>
  )
}
