"use client"

import { ArrowLeft, Plus, FileText, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Contact, Transaction } from "@/lib/types"
import { formatINR, formatGoldWeight } from "@/lib/utils-finance"
import { generatePDF, getFileName, sharePDF } from "@/lib/pdf-generator"

interface LedgerViewProps {
  contact: Contact
  transactions: Transaction[]
  mode: "cash" | "gold"
  onAddTransaction: () => void
  onBack: () => void
}

export function LedgerView({ contact, transactions, mode, onAddTransaction, onBack }: LedgerViewProps) {
  const filteredTransactions = transactions.filter((t) => t.type === mode)

  const balance = filteredTransactions.reduce((sum, t) => {
    return sum + (t.direction === "given" ? t.amount : -t.amount)
  }, 0)

  const handleGeneratePDF = async () => {
    const doc = generatePDF(contact, filteredTransactions)
    const fileName = getFileName(contact.name)
    await sharePDF(doc, fileName)
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back / પાછા
        </button>

        <Button onClick={handleGeneratePDF} variant="outline" size="sm" className="gap-2 bg-transparent">
          <Share2 className="w-4 h-4" />
          PDF
        </Button>
      </div>

      {/* Contact Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
        <p className="text-gray-600">{contact.phone}</p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-1">
            {mode === "cash" ? "Cash Balance / રોકડ બાકી" : "Gold Balance / સોના બાકી"}
          </p>
          <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {mode === "cash" ? formatINR(balance) : formatGoldWeight(Math.abs(balance))}
          </p>
          <p className="text-sm text-gray-500">{balance >= 0 ? "To Receive / મળવાનું" : "To Give / આપવાનું"}</p>
        </div>
      </div>

      {/* Transactions List */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions / વ્યવહારો</h3>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No transactions yet</p>
          <p className="text-sm">હજુ સુધી કોઈ વ્યવહાર નથી</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${transaction.direction === "given" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.direction === "given" ? "+" : "-"}
                    {mode === "cash" ? formatINR(transaction.amount) : formatGoldWeight(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.direction === "given" ? "Given / આપેલ" : "Received / મળેલ"}
                  </p>
                </div>
              </div>

              {mode === "gold" && transaction.grossWeight && (
                <p className="text-sm text-gray-500">
                  Gross: {transaction.grossWeight}g @ {transaction.purity}% purity
                </p>
              )}

              {transaction.receiptUrl && (
                <a
                  href={transaction.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />📷 View Bill / બિલ જુઓ
                </a>
              )}

              {!transaction.isSynced && (
                <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Pending sync / સમન્વય બાકી
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FAB for adding transaction */}
      <Button
        onClick={onAddTransaction}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  )
}
