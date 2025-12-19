"use client"

import { ArrowLeft, User, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Contact } from "@/lib/types"

interface ArchivedContactsProps {
  contacts: Contact[]
  onRestore: (contactId: string) => void
  onBack: () => void
}

export function ArchivedContacts({ contacts, onRestore, onBack }: ArchivedContactsProps) {
  const archivedContacts = contacts.filter((c) => c.isArchived)

  return (
    <div className="p-4">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back / પાછા
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Archived Contacts</h2>
      <p className="text-gray-600 mb-6">આર્કાઇવ થયેલ સંપર્કો</p>

      {archivedContacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No archived contacts</p>
          <p className="text-sm">કોઈ આર્કાઇવ થયેલ સંપર્ક નથી</p>
        </div>
      ) : (
        <div className="space-y-3">
          {archivedContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>

              <Button onClick={() => onRestore(contact.id)} variant="outline" size="sm" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restore
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
