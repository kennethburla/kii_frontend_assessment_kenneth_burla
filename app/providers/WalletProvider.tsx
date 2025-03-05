'use client';

import { useWalletStore } from "@/features/Wallet/Store/useWalletStore";
import { useToast } from "@/hooks/useToast";
import { isWalletConnected, ORO_TESTNET_CHAIN_ID } from "@/libs/web3";
import { useCallback, useEffect } from "react";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setWallets, setChainId, setIsOroTestNetChain, setIsConnected } = useWalletStore();
    const { toast } = useToast();

    // Initialize wallet connection
    const init = useCallback(async () => {
        if (!window.ethereum) return;

        try {
            if (await isWalletConnected()) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    setWallets(accounts.map((address: string) => ({
                        name: address,
                        address
                    })));
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }

                // Check chain ID
                const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                const currentChainId = parseInt(chainIdHex, 16);
                setChainId(currentChainId);
                setIsOroTestNetChain(currentChainId === ORO_TESTNET_CHAIN_ID);
            }
        } catch (err: any) {
            console.error("Failed to initialize wallet connection:", err);
            toast({ title: "Failed to connect wallet", description: err.message });
        }
    }, [setWallets, setIsConnected, setChainId, setIsOroTestNetChain, toast]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            init();
        }
    }, [init]);

    // Handle account and chain changes
    useEffect(() => {
        if (typeof window === "undefined" || !window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setWallets(accounts.map((address) => ({ name: address, address })));
            } else {
                setWallets([]);
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            const newChainId = parseInt(chainIdHex, 16);
            setChainId(newChainId);
            setIsOroTestNetChain(newChainId === ORO_TESTNET_CHAIN_ID);
            setIsConnected(true);
            if (newChainId !== ORO_TESTNET_CHAIN_ID)
                setWallets([]);
        };

        // Subscribe to events
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        // Cleanup listeners on unmount
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, [setWallets, setIsConnected, setChainId, setIsOroTestNetChain]);

    return children;
};
