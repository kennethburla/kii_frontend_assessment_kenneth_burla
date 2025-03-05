'use client';

import { ethers } from 'ethers';

// Constants for the Oro testnet
export const ORO_TESTNET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) ?? 0;
export const ORO_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? '';
export const ORO_TESTNET_EXPLORER = process.env.NEXT_PUBLIC_WKII_CONTRACT ?? '';

// Chain configuration
export const ORO_TESTNET = {
  id: ORO_TESTNET_CHAIN_ID,
  name: 'Oro Testnet',
  network: 'oro-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KII',
    symbol: 'KII',
  },
  rpcUrls: {
    public: { http: [ORO_TESTNET_RPC_URL] },
    default: { http: [ORO_TESTNET_RPC_URL] },
  },
};

// Initialize provider (Ensuring it works only on the client side)
export const getProvider = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(ORO_TESTNET_RPC_URL);
};

// Get signer
export const getSigner = async () => {
  const provider = await getProvider(); // Await the provider here
  if (provider instanceof ethers.BrowserProvider) {
    return await provider.getSigner();
  }
  throw new Error('No wallet connected');
};

// Connect wallet
export const connectWallet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this feature');
  }

  try {
    const provider = await getProvider();

    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);

    // Request to switch to Oro Testnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ORO_TESTNET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // If the chain is not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${ORO_TESTNET_CHAIN_ID.toString(16)}`,
              chainName: 'Oro Testnet',
              nativeCurrency: {
                name: 'KII',
                symbol: 'KII',
                decimals: 18,
              },
              rpcUrls: [ORO_TESTNET_RPC_URL],
              blockExplorerUrls: [ORO_TESTNET_EXPLORER],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }

    return accounts;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Format address for display
export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format balance with specific decimals
export const formatBalance = (balance: ethers.BigNumberish, decimals = 18) => {
  return ethers.formatUnits(balance, decimals);
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const provider = await getProvider();
    const accounts = await provider.send('eth_accounts', []);
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

// Get native balance
export const getNativeBalance = async (address: string) => {
  const provider = await getProvider();
  return await provider.getBalance(address);
};

// Add Oro Testnet to wallet
export const addOroTestnet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this feature');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${ORO_TESTNET_CHAIN_ID.toString(16)}`,
          chainName: 'Oro Testnet',
          nativeCurrency: {
            name: 'KII',
            symbol: 'KII',
            decimals: 18,
          },
          rpcUrls: [ORO_TESTNET_RPC_URL],
          blockExplorerUrls: [ORO_TESTNET_EXPLORER],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error adding Oro Testnet:', error);
    throw error;
  }
};

// WKII Token address (from specifications)
export const WKII_TOKEN_ADDRESS = '0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920';

// WKII Token ABI (Simplified for the required functions)
export const WKII_TOKEN_ABI = [
  // View functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',

  // Wrapped token specific functions
  'function deposit() payable',
  'function withdraw(uint256 wad)',

  // Standard ERC20 functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Deposit(address indexed dst, uint wad)',
  'event Withdrawal(address indexed src, uint wad)'
];

// Get WKII Token contract
export const getWKIIContract = async (withSigner = false) => {
  const provider = await getProvider();

  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(WKII_TOKEN_ADDRESS, WKII_TOKEN_ABI, signer);
  }

  return new ethers.Contract(WKII_TOKEN_ADDRESS, WKII_TOKEN_ABI, provider);
};

// Get WKII Token balance
export const getWKIIBalance = async (address: string) => {
  const contract = await getWKIIContract();
  return await contract.balanceOf(address);
};

// Get transaction details
export const getTransactionDetails = async (txHash: string) => {
  const provider = await getProvider();
  return provider.getTransaction(txHash);
};

// Format ethers error to user-friendly message
export const formatError = (error: any): string => {
  // Handle common Web3 errors
  if (error?.reason === 'rejected') {
    return 'Transaction was rejected by user.';
  }

  if (error?.action === 'estimateGas') {
    return 'Insufficient funds for this transaction.';
  }

  // Extract error message from ethers or provider errors
  const message =
    error?.reason ||
    error?.data?.message ||
    error?.error?.message ||
    error?.message ||
    'An unknown error occurred';

  // Clean up the message
  return message.replace(/\[ethjs-query\]|Error:/gi, '').trim();
};


export type TransactionState = 'idle' | 'pending' | 'success' | 'error';

// Global object to add ethers types for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
