"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, ChevronRight, Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Contact, Transaction } from "@/lib/types"
import { formatINR, formatGoldWeight } from "@/lib/utils-finance"
import { createContactSearch } from "@/lib/search"

interface ContactListProps {
  contacts: Contact[]
  transactions: Transaction[]
  mode: "cash" | "gold"
  onSelectContact: (contact: Contact) => void
  onAddContact: () => void
  onBack: () => void
}

export function ContactList({ contacts, transactions, mode, onSelectContact, onAddContact, onBack }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const searchContacts = useMemo(() => createContactSearch(contacts), [contacts])
  const filteredContacts = useMemo(() => searchContacts(searchQuery), [searchContacts, searchQuery])

  const getBalance = (contactId: string) => {
    const contactTransactions = transactions.filter((t) => t.contactId === contactId && t.type === mode)
    return contactTransactions.reduce((sum, t) => {
      return sum + (t.direction === "given" ? t.amount : -t.amount)
    }, 0)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back / પાછા
        </button>

        <h2 className="text-xl font-bold text-gray-900">{mode === "cash" ? "Cash / રોકડ" : "Gold / સોનું"}</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search contacts... / સંપર્ક શોધો..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      <div className="space-y-2 mb-20">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No contacts found</p>
            <p className="text-sm">કોઈ સંપર્ક મળ્યો નથી</p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const balance = getBalance(contact.id)
            return (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className={`font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {mode === "cash" ? formatINR(balance) : formatGoldWeight(Math.abs(balance))}
                    </p>
                    <p className="text-xs text-gray-500">{balance >= 0 ? "To Receive / મળવાનું" : "To Give / આપવાનું"}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* FAB for adding contact */}
      <Button
        onClick={onAddContact}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
