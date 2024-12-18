'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { ethers } from 'ethers'
import { useToast } from '@/components/ui/use-toast'
import { USDC_CONTRACT_ADDRESS, SMART_USDC_CONTRACT_ADDRESS } from '@/lib/constants'
import { SmartUSDC__factory, USDC__factory } from '@/lib/contracts'

interface WalletContextType {
  address: string | null
  balance: string
  usdcBalance: string
  depositedBalance: string
  rewards: string
  referralCode: string | null
  apr: string
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalances: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: '0',
  usdcBalance: '0',
  depositedBalance: '0',
  rewards: '0',
  referralCode: null,
  apr: '24',
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshBalances: async () => {},
})

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [usdcBalance, setUsdcBalance] = useState<string>('0')
  const [depositedBalance, setDepositedBalance] = useState<string>('0')
  const [rewards, setRewards] = useState<string>('0')
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [apr, setApr] = useState<string>('24')
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const refreshBalances = async () => {
    if (!address || !window.ethereum) return

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      // Get ETH balance
      const ethBalance = await provider.getBalance(address)
      setBalance(ethers.utils.formatEther(ethBalance))

      // Get USDC balance
      const usdcContract = USDC__factory.connect(USDC_CONTRACT_ADDRESS, signer)
      const usdcBalance = await usdcContract.balanceOf(address)
      setUsdcBalance(ethers.utils.formatUnits(usdcBalance, 6))

      // Get SmartUSDC contract data
      const smartUsdcContract = SmartUSDC__factory.connect(SMART_USDC_CONTRACT_ADDRESS, signer)
      const deposits = await smartUsdcContract.deposits(address)
      setDepositedBalance(ethers.utils.formatUnits(deposits, 6))

      const rewards = await smartUsdcContract.calculateReward(address)
      setRewards(ethers.utils.formatUnits(rewards, 6))

      const referral = await smartUsdcContract.userReferrals(address)
      if (referral.exists) {
        setReferralCode(referral.referralCode.toString())
      }

      const currentApr = await smartUsdcContract.currentAPR()
      setApr(currentApr.toString())
    } catch (error) {
      console.error('Error refreshing balances:', error)
    }
  }

  const connectWallet = async () => {
    if (isConnecting) return
    setIsConnecting(true)

    try {
      if (!window.ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask to use SmartUSDC',
          variant: 'destructive',
        })
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      
      setAddress(userAddress)
      await refreshBalances()

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`,
      })
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast({
        title: 'Connection Error',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setBalance('0')
    setUsdcBalance('0')
    setDepositedBalance('0')
    setRewards('0')
    setReferralCode(null)
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    })
  }

  useEffect(() => {
    if (address) {
      const interval = setInterval(refreshBalances, 15000) // Refresh every 15 seconds
      return () => clearInterval(interval)
    }
  }, [address])

  return (
    <WalletContext.Provider value={{
      address,
      balance,
      usdcBalance,
      depositedBalance,
      rewards,
      referralCode,
      apr,
      isConnecting,
      connectWallet,
      disconnectWallet,
      refreshBalances,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
