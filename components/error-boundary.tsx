"use client"

import type React from "react"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-2">કંઈક ખોટું થયું</p>

            <p className="text-sm text-gray-500 mb-6">
              Don't worry, your data is safe. Please reload the app.
              <br />
              ચિંતા કરશો નહીં, તમારો ડેટા સુરક્ષિત છે. કૃપા કરીને એપ ફરી લોડ કરો.
            </p>

            <Button onClick={this.handleReload} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload App / એપ રીલોડ કરો
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
