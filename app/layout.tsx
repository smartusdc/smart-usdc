import './globals.css'
import { Inter } from 'next/font/google'
import { WalletProvider } from '@/context/WalletContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartUSDC - Secure USDC Yield Platform',
  description: 'Earn attractive yields on your USDC deposits with our secure and user-friendly DeFi platform.',
  keywords: ['SmartUSDC', 'USDC', 'DeFi', 'Yield', 'Staking', 'Crypto'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  )
}
