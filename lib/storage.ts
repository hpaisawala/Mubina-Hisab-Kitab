import { get, set } from "idb-keyval"
import type { Contact, Transaction, PendingSync } from "./types"

const CONTACTS_KEY = "hisab_contacts"
const TRANSACTIONS_KEY = "hisab_transactions"
const PENDING_SYNC_KEY = "hisab_pending_sync"

// Contacts
export async function getContacts(): Promise<Contact[]> {
  const contacts = await get<Contact[]>(CONTACTS_KEY)
  return contacts || []
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  await set(CONTACTS_KEY, contacts)
}

export async function addContact(contact: Contact): Promise<{ success: boolean; error?: string }> {
  const contacts = await getContacts()

  // Check for duplicates
  const duplicate = contacts.find(
    (c) => c.name.toLowerCase() === contact.name.toLowerCase() || c.phone === contact.phone,
  )

  if (duplicate) {
    return {
      success: false,
      error: "Contact with same name or phone already exists / સમાન નામ અથવા ફોન સાથે સંપર્ક પહેલેથી અસ્તિત્વમાં છે",
    }
  }

  contacts.push(contact)
  await saveContacts(contacts)
  return { success: true }
}

export async function updateContact(contact: Contact): Promise<void> {
  const contacts = await getContacts()
  const index = contacts.findIndex((c) => c.id === contact.id)
  if (index !== -1) {
    contacts[index] = contact
    await saveContacts(contacts)
  }
}

export async function archiveContact(contactId: string): Promise<void> {
  const contacts = await getContacts()
  const index = contacts.findIndex((c) => c.id === contactId)
  if (index !== -1) {
    contacts[index].isArchived = true
    await saveContacts(contacts)
  }
}

export async function restoreContact(contactId: string): Promise<void> {
  const contacts = await getContacts()
  const index = contacts.findIndex((c) => c.id === contactId)
  if (index !== -1) {
    contacts[index].isArchived = false
    await saveContacts(contacts)
  }
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const transactions = await get<Transaction[]>(TRANSACTIONS_KEY)
  return transactions || []
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await set(TRANSACTIONS_KEY, transactions)
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const transactions = await getTransactions()
  transactions.push(transaction)
  await saveTransactions(transactions)
}

export async function getTransactionsByContact(contactId: string): Promise<Transaction[]> {
  const transactions = await getTransactions()
  return transactions
    .filter((t) => t.contactId === contactId)
    .sort((a, b) => {
      // Sort by date descending, then by timestamp descending
      const dateCompare = b.date.localeCompare(a.date)
      if (dateCompare !== 0) return dateCompare
      return b.timestamp - a.timestamp
    })
}

// Pending Sync
export async function getPendingSync(): Promise<PendingSync[]> {
  const pending = await get<PendingSync[]>(PENDING_SYNC_KEY)
  return pending || []
}

export async function addPendingSync(item: PendingSync): Promise<void> {
  const pending = await getPendingSync()
  pending.push(item)
  await set(PENDING_SYNC_KEY, pending)
}

export async function clearPendingSync(): Promise<void> {
  await set(PENDING_SYNC_KEY, [])
}

export async function removePendingSyncItem(id: string): Promise<void> {
  const pending = await getPendingSync()
  const filtered = pending.filter((p) => p.id !== id)
  await set(PENDING_SYNC_KEY, filtered)
}
