"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Save, Camera, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Contact, Transaction } from "@/lib/types"
import { calculateNetGold, GOLD_PRESETS, formatGoldWeight } from "@/lib/utils-finance"
import { compressAndRenameImage } from "@/lib/image-utils"

interface AddTransactionProps {
  contact: Contact
  mode: "cash" | "gold"
  onSave: (transaction: Omit<Transaction, "id" | "timestamp" | "isSynced">) => Promise<void>
  onBack: () => void
}

export function AddTransaction({ contact, mode, onSave, onBack }: AddTransactionProps) {
  const [direction, setDirection] = useState<"given" | "received">("given")
  const [amount, setAmount] = useState("")
  const [grossWeight, setGrossWeight] = useState("")
  const [purity, setPurity] = useState("")
  const [purityMode, setPurityMode] = useState<"percent" | "karat">("karat")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const netGold =
    mode === "gold" && grossWeight && purity
      ? calculateNetGold(
          Number.parseFloat(grossWeight),
          purityMode === "karat" ? (Number.parseFloat(purity) / 24) * 100 : Number.parseFloat(purity),
        )
      : 0

  const handlePurityPreset = (preset: (typeof GOLD_PRESETS)[0]) => {
    if (purityMode === "karat") {
      setPurity(preset.karat.toString())
    } else {
      setPurity(preset.percent.toString())
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return // Double-submit protection

    setIsSaving(true)

    let receiptUrl: string | undefined

    if (receiptFile) {
      const { blob, fileName } = await compressAndRenameImage(receiptFile)
      // In a real app, you'd upload this to a storage service
      // For now, we'll create a local URL
      receiptUrl = URL.createObjectURL(blob)
    }

    const transactionAmount = mode === "cash" ? Number.parseFloat(amount) : netGold

    await onSave({
      contactId: contact.id,
      type: mode,
      direction,
      amount: transactionAmount,
      grossWeight: mode === "gold" ? Number.parseFloat(grossWeight) : undefined,
      purity:
        mode === "gold"
          ? purityMode === "karat"
            ? (Number.parseFloat(purity) / 24) * 100
            : Number.parseFloat(purity)
          : undefined,
      description: description.trim() || (direction === "given" ? "Given" : "Received"),
      date,
      receiptUrl,
    })
  }

  const isValid =
    mode === "cash"
      ? amount && Number.parseFloat(amount) > 0
      : grossWeight && purity && Number.parseFloat(grossWeight) > 0 && Number.parseFloat(purity) > 0

  return (
    <div className="p-4 pb-8">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back / પાછા
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-1">{mode === "cash" ? "Add Cash Entry" : "Add Gold Entry"}</h2>
      <p className="text-gray-600 mb-6">{mode === "cash" ? "રોકડ એન્ટ્રી ઉમેરો" : "સોનાની એન્ટ્રી ઉમેરો"}</p>
      <p className="text-sm text-gray-500 mb-6">For: {contact.name}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Direction Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDirection("given")}
            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              direction === "given" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"
            }`}
          >
            <ArrowUpRight className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Given</p>
              <p className="text-xs">આપેલ</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDirection("received")}
            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              direction === "received" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-600"
            }`}
          >
            <ArrowDownLeft className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold">Received</p>
              <p className="text-xs">મળેલ</p>
            </div>
          </button>
        </div>

        {/* Amount / Gold Weight */}
        {mode === "cash" ? (
          <div>
            <Label htmlFor="amount" className="text-gray-700 mb-2 block">
              Amount (₹) / રકમ *
            </Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount / રકમ દાખલ કરો"
              className="h-12 text-lg"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="grossWeight" className="text-gray-700 mb-2 block">
                Gross Weight (g) / કુલ વજન *
              </Label>
              <Input
                id="grossWeight"
                type="number"
                inputMode="decimal"
                step="0.001"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                placeholder="Enter weight / વજન દાખલ કરો"
                className="h-12 text-lg"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="purity" className="text-gray-700">
                  Purity / શુદ્ધતા *
                </Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPurityMode("karat")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      purityMode === "karat" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    K
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurityMode("percent")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      purityMode === "percent" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    %
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-2">
                {GOLD_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePurityPreset(preset)}
                    className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <Input
                id="purity"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                placeholder={purityMode === "karat" ? "e.g., 22" : "e.g., 91.67"}
                className="h-12 text-lg"
                required
              />
            </div>

            {/* Live Preview */}
            {netGold > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700 mb-1">Net Gold Weight / ચોખ્ખું સોનું</p>
                <p className="text-2xl font-bold text-amber-800">{formatGoldWeight(netGold)}</p>
                <p className="text-xs text-amber-600 mt-1">
                  Formula: ({grossWeight} ×{" "}
                  {purityMode === "karat"
                    ? `${purity}K → ${((Number.parseFloat(purity) / 24) * 100).toFixed(2)}%`
                    : `${purity}%`}
                  ) ÷ 99.9%
                </p>
              </div>
            )}
          </>
        )}

        {/* Date */}
        <div>
          <Label htmlFor="date" className="text-gray-700 mb-2 block">
            Date / તારીખ *
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-gray-700 mb-2 block">
            Description / વર્ણન
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes / વૈકલ્પિક નોંધો"
            rows={2}
          />
        </div>

        {/* Receipt Image */}
        <div>
          <Label className="text-gray-700 mb-2 block">Receipt Image / રસીદ છબી</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-12 gap-2"
          >
            <Camera className="w-5 h-5" />
            {receiptFile ? receiptFile.name : "Attach Bill / બિલ જોડો"}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white text-lg"
          disabled={isSaving || !isValid}
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? "Saving... / સેવ થઈ રહ્યું છે..." : "Save Entry / એન્ટ્રી સેવ કરો"}
        </Button>
      </form>
    </div>
  )
}
