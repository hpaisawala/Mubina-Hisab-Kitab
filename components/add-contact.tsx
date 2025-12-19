"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, User, Phone, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Contact } from "@/lib/types"

interface AddContactProps {
  onSave: (contact: Omit<Contact, "id" | "createdAt" | "isArchived">) => Promise<{ success: boolean; error?: string }>
  onBack: () => void
}

export function AddContact({ onSave, onBack }: AddContactProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return // Double-submit protection

    setIsSaving(true)
    setError("")

    const result = await onSave({ name: name.trim(), phone: phone.trim() })

    if (!result.success) {
      setError(result.error || "Failed to save contact")
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back / પાછા
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Contact</h2>
      <p className="text-gray-600 mb-6">સંપર્ક ઉમેરો</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-gray-700 mb-2 block">
            Name / નામ *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name / નામ દાખલ કરો"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700 mb-2 block">
            Phone / ફોન *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone / ફોન દાખલ કરો"
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

        <Button
          type="submit"
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white"
          disabled={isSaving || !name.trim() || !phone.trim()}
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? "Saving... / સેવ થઈ રહ્યું છે..." : "Save Contact / સંપર્ક સેવ કરો"}
        </Button>
      </form>
    </div>
  )
}
