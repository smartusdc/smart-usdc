import { ethers } from 'ethers'

export interface IUSDC {
  balanceOf(address: string): Promise<ethers.BigNumber>
  approve(spender: string, amount: ethers.BigNumber): Promise<ethers.ContractTransaction>
  allowance(owner: string, spender: string): Promise<ethers.BigNumber>
}

export interface ISmartUSDC {
  deposit(amount: ethers.BigNumber): Promise<ethers.ContractTransaction>
  withdraw(amount: ethers.BigNumber): Promise<ethers.ContractTransaction>
  getBalance(address: string): Promise<ethers.BigNumber>
  getRewards(address: string): Promise<ethers.BigNumber>
  getAPR(): Promise<ethers.BigNumber>
  generateReferralCode(): Promise<string>
  validateReferralCode(code: string): Promise<boolean>
}

export class USDC__factory {
  static connect(address: string, signer: ethers.Signer): IUSDC {
    return {
      balanceOf: async (address: string) => ethers.utils.parseEther('0'),
      approve: async (spender: string, amount: ethers.BigNumber) => ({} as ethers.ContractTransaction),
      allowance: async (owner: string, spender: string) => ethers.utils.parseEther('0'),
    }
  }
}

export class SmartUSDC__factory {
  static connect(address: string, signer: ethers.Signer): ISmartUSDC {
    return {
      deposit: async (amount: ethers.BigNumber) => ({} as ethers.ContractTransaction),
      withdraw: async (amount: ethers.BigNumber) => ({} as ethers.ContractTransaction),
      getBalance: async (address: string) => ethers.utils.parseEther('0'),
      getRewards: async (address: string) => ethers.utils.parseEther('0'),
      getAPR: async () => ethers.utils.parseEther('0'),
      generateReferralCode: async () => '',
      validateReferralCode: async (code: string) => true,
    }
  }
}

export const getContract = async () => {
  // This is a placeholder implementation
  return {
    deposit: async (amount: string) => {
      console.log('Depositing:', amount)
    },
    withdraw: async (amount: string) => {
      console.log('Withdrawing:', amount)
    },
    getBalance: async () => {
      return ethers.utils.parseEther('0')
    },
    getRewards: async () => {
      return ethers.utils.parseEther('0')
    }
  }
}

export const formatEther = (value: any) => {
  return ethers.utils.formatEther(value || '0')
}

export const parseEther = (value: string) => {
  return ethers.utils.parseEther(value || '0')
}
