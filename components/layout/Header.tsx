'use client'

import { useWallet } from '@/context/WalletContext'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import Image from 'next/image'

export const Header = () => {
  const { address, isConnecting, connectWallet, disconnectWallet } = useWallet()

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="SmartUSDC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SmartUSDC
          </h1>
        </div>

        <Button 
          onClick={address ? disconnectWallet : connectWallet}
          variant={address ? "outline" : "default"}
          size="sm"
          className="rounded-full"
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 
           address ? formatAddress(address) : 
           'Connect Wallet'}
        </Button>
      </div>
    </header>
  )
}
