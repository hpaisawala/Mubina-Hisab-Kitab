import { ErrorBoundary } from "@/components/error-boundary"
import { HisabApp } from "@/components/hisab-app"

export default function Home() {
  return (
    <ErrorBoundary>
      <HisabApp />
    </ErrorBoundary>
  )
}
