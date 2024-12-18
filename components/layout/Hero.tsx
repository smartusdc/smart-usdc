'use client'

import { useWallet } from '@/context/WalletContext'
import { Button } from '@/components/ui/button'
import { Wallet, Shield, TrendingUp, Users } from 'lucide-react'

export const Hero = () => {
  const { connectWallet, isConnecting } = useWallet()

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-4xl py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Earn More with Your USDC
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            SmartUSDC offers secure, high-yield opportunities for your USDC holdings. 
            Start earning attractive rewards today with our trusted DeFi platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              size="lg"
              className="rounded-full"
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Secure & Audited</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your funds are protected by industry-leading security measures and smart contract audits.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Attractive APR</h3>
            <p className="mt-2 text-sm text-gray-600">
              Earn competitive yields on your USDC deposits with our optimized reward system.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Referral Rewards</h3>
            <p className="mt-2 text-sm text-gray-600">
              Earn additional rewards by inviting friends to join SmartUSDC.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
