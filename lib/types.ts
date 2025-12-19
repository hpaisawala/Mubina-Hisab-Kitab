export interface Contact {
  id: string
  name: string
  phone: string
  createdAt: number
  isArchived: boolean
}

export interface Transaction {
  id: string
  contactId: string
  type: "cash" | "gold"
  direction: "given" | "received"
  amount: number // For cash in INR, for gold in grams (net weight)
  grossWeight?: number // For gold
  purity?: number // For gold (percentage)
  description: string
  date: string // YYYY-MM-DD
  timestamp: number
  receiptUrl?: string
  isSynced: boolean
}

export interface PendingSync {
  id: string
  action: "create" | "update" | "delete"
  type: "contact" | "transaction"
  data: Contact | Transaction
  timestamp: number
}

export type SyncStatus = "online" | "syncing" | "offline"

export type ViewMode =
  | "home"
  | "mode-select"
  | "contact-list"
  | "ledger"
  | "add-transaction"
  | "add-contact"
  | "settings"
  | "archived"
