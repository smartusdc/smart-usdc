'use client'

import { useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowDownCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { SMART_USDC_CONTRACT_ADDRESS } from '@/lib/constants'
import { SmartUSDC__factory } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'

export const WithdrawCard = () => {
  const { address, depositedBalance, refreshBalances } = useWallet()
  const [amount, setAmount] = useState('')
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { toast } = useToast()

  const handleWithdraw = async () => {
    if (!address || !window.ethereum || !amount) return
    setIsWithdrawing(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = SmartUSDC__factory.connect(SMART_USDC_CONTRACT_ADDRESS, signer)

      const withdrawAmount = ethers.utils.parseUnits(amount, 6)
      const tx = await contract.requestWithdrawal(withdrawAmount)
      await tx.wait()

      await refreshBalances()
      setAmount('')
      
      toast({
        title: 'Withdrawal Requested',
        description: `Withdrawal request for ${amount} USDC has been submitted. You can complete the withdrawal after 1 hour.`,
      })
    } catch (error) {
      console.error('Error requesting withdrawal:', error)
      toast({
        title: 'Withdrawal Request Failed',
        description: 'Failed to request withdrawal. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(depositedBalance)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowDownCircle className="h-5 w-5 text-blue-600" />
          <span>Withdraw USDC</span>
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
              Available: {depositedBalance} USDC
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

        <div className="text-sm text-gray-500">
          Note: Withdrawals have a 1-hour delay for security purposes.
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={!amount || isWithdrawing || Number(amount) > Number(depositedBalance)}
          className="w-full"
          variant="outline"
        >
          {isWithdrawing ? 'Requesting Withdrawal...' : 'Request Withdrawal'}
        </Button>
      </CardContent>
    </Card>
  )
}
