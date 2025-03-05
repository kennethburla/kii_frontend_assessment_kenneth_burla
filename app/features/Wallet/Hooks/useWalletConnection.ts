'use client'
import { useState, useCallback } from 'react';
import {
  connectWallet,
  addOroTestnet,
  ORO_TESTNET_CHAIN_ID,
} from '@/libs/web3';
import { useWalletStore } from '../Store/useWalletStore';

export function useWalletConnection() {
  const { wallets, setWallets, setChainId, setIsOroTestNetChain, setIsConnected } = useWalletStore()
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await connectWallet();

      setWallets(accounts.map((address: string) => ({
        name: address,
        address
      })));

      setIsConnected(accounts.length > 0);

      // Check chain after connection
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      setChainId(currentChainId);
      setIsOroTestNetChain(currentChainId === ORO_TESTNET_CHAIN_ID);

      return accounts;
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);


  const addWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }],
      });

      if (accounts && accounts.length > 0) {
        setWallets(accounts.map((address: string) => ({
          name: address,
          address
        })));

        setIsConnected(true);
      } else {
        setError("No wallet selected.");
      }
    } catch (err: any) {
      console.error("Failed to switch wallet:", err);
      setError(err.message || "Failed to switch wallet");
    }
  }, []);

  // Switch to Oro Testnet
  const switchToOroTestnet = useCallback(async () => {
    try {
      await addOroTestnet();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }],
      });

      if (accounts && accounts.length > 0) {
        setWallets(accounts.map((address: string) => ({
          name: address,
          address
        })));
      }
      
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      setChainId(currentChainId);
      setIsOroTestNetChain(currentChainId === ORO_TESTNET_CHAIN_ID);
      setIsConnected(true);
      return true;
    } catch (err: any) {
      console.error('Failed to switch chain:', err);
      setError(err.message || 'Failed to switch to Oro Testnet');
      return false;
    }
  }, []);

  // Disconnect wallet (this is mostly for UI state as MetaMask doesn't support programmatic disconnection)
  const disconnect = useCallback(() => {
    try {
      setWallets([]);
      setChainId(null);
      setIsOroTestNetChain(false);
      setIsConnected(false);

      if (window.ethereum && window.ethereum.request) {
        window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (err: any) {
      setError("Failed to disconnect wallet.");
    }

  }, []);

  return {
    isConnecting,
    error,
    connect,
    disconnect,
    addWallet,
    switchToOroTestnet
  };
}