"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import type { Contact, Transaction, ViewMode, SyncStatus } from "@/lib/types"
import {
  getContacts,
  addContact as saveContact,
  getTransactions,
  addTransaction as saveTransaction,
  getTransactionsByContact,
  archiveContact,
  restoreContact,
  getPendingSync,
  addPendingSync,
  clearPendingSync,
} from "@/lib/storage"
import { SyncStatusIndicator } from "./sync-status"
import { HomeScreen } from "./home-screen"
import { ModeSelect } from "./mode-select"
import { ContactList } from "./contact-list"
import { AddContact } from "./add-contact"
import { LedgerView } from "./ledger-view"
import { AddTransaction } from "./add-transaction"
import { SettingsScreen } from "./settings-screen"
import { ArchivedContacts } from "./archived-contacts"

// Configuration constants
const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || '';
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || '';

export function HisabApp() {
  const [view, setView] = useState<ViewMode>("home")
  const [mode, setMode] = useState<"cash" | "gold">("cash")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactTransactions, setContactTransactions] = useState<Transaction[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("online")
  const [pendingCount, setPendingCount] = useState(0)

  // Load local data on mount
  useEffect(() => {
    const loadData = async () => {
      const [loadedContacts, loadedTransactions, pending] = await Promise.all([
        getContacts(),
        getTransactions(),
        getPendingSync(),
      ])
      setContacts(loadedContacts)
      setTransactions(loadedTransactions)
      setPendingCount(pending.length)
    }
    loadData()
  }, [])

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setSyncStatus(navigator.onLine ? "online" : "offline")
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Update specific contact transactions when ledger is opened
  useEffect(() => {
    if (selectedContact) {
      getTransactionsByContact(selectedContact.id).then(setContactTransactions)
    }
  }, [selectedContact, transactions])

  const handleSelectMode = (selectedMode: "cash" | "gold") => {
    setMode(selectedMode)
    setView("contact-list")
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setView("ledger")
  }

  const handleAddContact = async (contactData: Omit<Contact, "id" | "createdAt" | "isArchived">) => {
    const newContact: Contact = {
      ...contactData,
      id: uuidv4(),
      createdAt: Date.now(),
      isArchived: false,
    }

    const result = await saveContact(newContact)

    if (result.success) {
      // Add to sync queue
      await addPendingSync({
        id: uuidv4(),
        action: "create",
        type: "contact",
        data: newContact,
        timestamp: Date.now(),
      })
      
      const updatedContacts = await getContacts()
      setContacts(updatedContacts)
      
      const pending = await getPendingSync()
      setPendingCount(pending.length)
      
      // Auto-sync if online
      if (navigator.onLine) handleForceSync()
      
      setView("contact-list")
    }

    return result
  }

  const handleAddTransaction = async (transactionData: Omit<Transaction, "id" | "timestamp" | "isSynced">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      timestamp: Date.now(),
      isSynced: false,
    }

    await saveTransaction(newTransaction)

    // Add to sync queue
    await addPendingSync({
      id: uuidv4(),
      action: "create",
      type: "transaction",
      data: newTransaction,
      timestamp: Date.now(),
    })

    const pending = await getPendingSync()
    setPendingCount(pending.length)

    const updatedTransactions = await getTransactions()
    setTransactions(updatedTransactions)

    // Check for auto-archiving (balance 0)
    const allContactTransactions = await getTransactionsByContact(transactionData.contactId)
    const balance = allContactTransactions.reduce((sum, t) => {
      return sum + (t.direction === "given" ? t.amount : -t.amount)
    }, 0)

    if (Math.abs(balance) < 0.001) {
      await archiveContact(transactionData.contactId)
      setContacts(await getContacts())
    }

    // Auto-sync if online
    if (navigator.onLine) handleForceSync()

    setView("ledger")
  }

  const handleRestoreContact = async (contactId: string) => {
    await restoreContact(contactId)
    setContacts(await getContacts())
  }

  const handleForceSync = async () => {
    if (!navigator.onLine) return
    
    // Get latest pending items
    const pendingItems = await getPendingSync()
    if (pendingItems.length === 0) return

    setSyncStatus("syncing")
    
    try {
      // Wrap data in the structure expected by your Google Apps Script
      const payload = {
        secret: API_SECRET,
        actions: pendingItems
      }

      const response = await axios.post(SCRIPT_URL, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      })

      if (response.data.status === 'success') {
        await clearPendingSync()
        setPendingCount(0)
        setSyncStatus("online")
      } else {
        console.warn("Script returned an error:", response.data.error)
        setSyncStatus("online")
      }
    } catch (error) {
      console.error("Sync request failed:", error)
      setSyncStatus("online")
    }
  }

  const renderView = () => {
    switch (view) {
      case "home":
        return <HomeScreen onNavigate={setView} />

      case "mode-select":
        return <ModeSelect onSelectMode={handleSelectMode} onBack={() => setView("home")} />

      case "contact-list":
        return (
          <ContactList
            contacts={contacts}
            transactions={transactions}
            mode={mode}
            onSelectContact={handleSelectContact}
            onAddContact={() => setView("add-contact")}
            onBack={() => setView("mode-select")}
          />
        )

      case "add-contact":
        return <AddContact onSave={handleAddContact} onBack={() => setView("contact-list")} />

      case "ledger":
        return selectedContact ? (
          <LedgerView
            contact={selectedContact}
            transactions={contactTransactions}
            mode={mode}
            onAddTransaction={() => setView("add-transaction")}
            onBack={() => {
              setSelectedContact(null)
              setView("contact-list")
            }}
          />
        ) : null

      case "add-transaction":
        return selectedContact ? (
          <AddTransaction
            contact={selectedContact}
            mode={mode}
            onSave={handleAddTransaction}
            onBack={() => setView("ledger")}
          />
        ) : null

      case "settings":
        return (
          <SettingsScreen
            syncStatus={syncStatus}
            pendingCount={pendingCount}
            onViewArchived={() => setView("archived")}
            onBack={() => setView("home")}
            onForceSync={handleForceSync}
          />
        )

      case "archived":
        return (
          <ArchivedContacts contacts={contacts} onRestore={handleRestoreContact} onBack={() => setView("settings")} />
        )

      default:
        return <HomeScreen onNavigate={setView} />
    }
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl relative">
      {/* Sync Status Header - Visible in all views except Home */}
      {view !== "home" && (
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-2 z-10">
          <SyncStatusIndicator status={syncStatus} pendingCount={pendingCount} />
        </div>
      )}

      {renderView()}
    </div>
  )
}
