'use client'

import { useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowUpCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { USDC_CONTRACT_ADDRESS, SMART_USDC_CONTRACT_ADDRESS } from '@/lib/constants'
import { SmartUSDC__factory, USDC__factory } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'

export const DepositCard = () => {
  const { address, usdcBalance, refreshBalances } = useWallet()
  const [amount, setAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const { toast } = useToast()

  const handleDeposit = async () => {
    if (!address || !window.ethereum || !amount) return
    setIsDepositing(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      
      // First approve USDC transfer
      const usdcContract = USDC__factory.connect(USDC_CONTRACT_ADDRESS, signer)
      const depositAmount = ethers.utils.parseUnits(amount, 6)
      
      const approveTx = await usdcContract.approve(SMART_USDC_CONTRACT_ADDRESS, depositAmount)
      await approveTx.wait()

      // Then deposit
      const smartUsdcContract = SmartUSDC__factory.connect(SMART_USDC_CONTRACT_ADDRESS, signer)
      const depositTx = await smartUsdcContract.depositFunds(depositAmount, 0)
      await depositTx.wait()

      await refreshBalances()
      setAmount('')
      
      toast({
        title: 'Deposit Successful',
        description: `Successfully deposited ${amount} USDC`,
      })
    } catch (error) {
      console.error('Error depositing:', error)
      toast({
        title: 'Deposit Failed',
        description: 'Failed to deposit USDC. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDepositing(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(usdcBalance)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpCircle className="h-5 w-5 text-blue-600" />
          <span>Deposit USDC</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-500">Amount</label>
            <button
              onClick={handleMaxClick}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Balance: {usdcBalance} USDC
            </button>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.1"
              step="0.1"
              className="pr-16"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-gray-500">USDC</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!amount || isDepositing || Number(amount) > Number(usdcBalance)}
          className="w-full"
        >
          {isDepositing ? 'Depositing...' : 'Deposit USDC'}
        </Button>
      </CardContent>
    </Card>
  )
}
