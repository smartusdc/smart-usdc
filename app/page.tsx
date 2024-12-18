'use client'

import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/layout/Hero'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { useWallet } from '@/context/WalletContext'

export default function Home() {
  const { address } = useWallet()

  return (
    <div className="min-h-screen">
      <Header />
      {!address ? (
        <Hero />
      ) : (
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
      )}
    </div>
  )
}
