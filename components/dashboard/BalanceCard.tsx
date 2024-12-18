'use client'

import { useWallet } from '@/context/WalletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { ethers } from 'ethers'
import { SMART_USDC_CONTRACT_ADDRESS } from '@/lib/constants'
import { SmartUSDC__factory } from '@/lib/contracts'

export const BalanceCard = () => {
  const { address, depositedBalance, rewards, apr, refreshBalances } = useWallet()
  const [isClaimingRewards, setIsClaimingRewards] = useState(false)

  const handleClaimRewards = async () => {
    // @ts-ignore
    if (!address || !window.ethereum) return
    setIsClaimingRewards(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = SmartUSDC__factory.connect(SMART_USDC_CONTRACT_ADDRESS, signer)

      const tx = await contract.claimReward()
      await tx.wait()
      await refreshBalances()
    } catch (error) {
      console.error('Error claiming rewards:', error)
    } finally {
      setIsClaimingRewards(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-blue-600" />
          <span>Your Balance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Deposited USDC</p>
            <p className="text-2xl font-bold">${depositedBalance}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Current APR</p>
            <p className="text-2xl font-bold text-green-600">{apr}%</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Available Rewards</p>
              <p className="text-xl font-bold text-green-600">${rewards}</p>
            </div>
            <Button
              onClick={handleClaimRewards}
              disabled={!Number(rewards) || isClaimingRewards}
              variant="outline"
              size="sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {isClaimingRewards ? 'Claiming...' : 'Claim Rewards'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
