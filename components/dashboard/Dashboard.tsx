'use client'

import { useWallet } from '@/context/WalletContext'
import { BalanceCard } from './BalanceCard'
import { DepositCard } from './DepositCard'
import { WithdrawCard } from './WithdrawCard'
import { ReferralCard } from './ReferralCard'

export const Dashboard = () => {
  const { depositedBalance, rewards, apr, referralCode } = useWallet()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <BalanceCard />
        <DepositCard />
      </div>
      <div className="space-y-6">
        <WithdrawCard />
        <ReferralCard />
      </div>
    </div>
  )
}
