import { create } from "zustand"

export interface UseWalletStore {
    wallets: { name: string; address: string }[]
    chainId: number | null
    isOroTestNetChain: boolean
    isConnected: boolean
    setWallets: (value: { name: string; address: string }[]) => void
    setChainId: (value: number | null) => void
    setIsOroTestNetChain: (value: boolean) => void
    setIsConnected: (value: boolean) => void
}

export const useWalletStore = create<UseWalletStore>((set) => ({
    wallets: [],
    chainId: null,
    isOroTestNetChain: false,
    isConnected: false,
    setWallets: (value) => set({ wallets: value }),
    setChainId: (value) => set({ chainId: value }),
    setIsConnected: (value) => set({ isConnected: value }),
    setIsOroTestNetChain: (value) => set({ isOroTestNetChain: value }),
}))