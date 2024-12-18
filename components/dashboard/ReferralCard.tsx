'use client'

import { useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Copy, Check } from 'lucide-react'
import { ethers } from 'ethers'
import { SMART_USDC_CONTRACT_ADDRESS } from '@/lib/constants'
import { SmartUSDC__factory } from '@/lib/contracts'
import { useToast } from '@/components/ui/use-toast'

export const ReferralCard = () => {
  const { address, referralCode, refreshBalances } = useWallet()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerateCode = async () => {
    if (!address || !window.ethereum) return
    setIsGenerating(true)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = SmartUSDC__factory.connect(SMART_USDC_CONTRACT_ADDRESS, signer)

      const tx = await contract.generateReferralCode()
      await tx.wait()

      await refreshBalances()
      
      toast({
        title: 'Referral Code Generated',
        description: 'Your referral code has been generated successfully.',
      })
    } catch (error) {
      console.error('Error generating referral code:', error)
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate referral code. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>Referral Program</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {referralCode ? (
          <>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Your Referral Code</label>
              <div className="flex space-x-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Share your referral code with friends and earn additional rewards when they deposit USDC.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Generate your referral code to start earning additional rewards when friends join SmartUSDC.
            </p>
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full"
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate Referral Code'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
