'use client';

import { ethers } from 'ethers';
import { getProvider, getSigner } from '@/libs/web3';

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
