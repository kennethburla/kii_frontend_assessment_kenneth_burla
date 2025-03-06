'use client'

import { useWalletStore } from '@/features/Wallet/Store/useWalletStore';
import { useGetTokenBalances } from '../Hooks/useGetTokenBalances';
import { Skeleton } from "@/components/ui/skeleton"
import TokenWrapForm from './TokenWrapForm';
import TokenUnwrapForm from './TokenUnwrapForm';
import { useEffect, useState } from 'react';

export function TokenBalance() {
  const { wallets, isOroTestNetChain } = useWalletStore()
  const {
    data,
    isLoading,
    refetch
  } = useGetTokenBalances();

  const [copied, setCopied] = useState("");

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(""), 2000);
  };

  const [noWalletFound, setNoWalletFound] = useState(true)

  useEffect(() => {
    if (window && typeof window.ethereum === 'undefined') {
      setNoWalletFound(true)
    } else {
      setNoWalletFound(false)
    }
  }, [])


  if (noWalletFound) {
    return (
      <div className="flex flex-col justify-start items-center flex-1 py-20 w-full">
        <h2 className="text-xl font-semibold text-center text-red-500/70 mb-4">Please install wallet or metamask to connect.</h2>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col justify-start items-center flex-1 py-20 w-full">
        <h2 className="text-2xl font-semibold text-center text-secondary/70 mb-4">Connect your wallet to view balances</h2>
      </div>
    );
  }

  if (!isOroTestNetChain) {
    return (
      <div className="flex flex-col justify-start items-center flex-1 py-20 w-full">
        <h2 className="text-2xl font-semibold text-center text-secondary/70 mb-4">Please Connect to Oro Testnet to see your balance</h2>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in flex-1 py-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Wallet Balances:</h2>
        <button
          onClick={() => refetch()}
          className="text-white p-1 rounded-full transition-colors cursor-pointer"
          title="Refresh balances"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
        </button>
      </div>
      <div className="flex flex-row flex-wrap justify-between gap-y-6 h-fit">
        {data?.map((balance, index) => (
          <div
            key={index}
            className="w-full h-auto"
          >
            <div className="flex flex-col p-6 bg-gray-800/40 rounded-xl bg-slate-500/10 shadow-lg shadow-slate-900/50 h-full w-full">
              <div className="flex flex-row justify-between h-fit w-full border-b-2 border-b-secondary/20 pb-2 mb-6">
                <p className="text-white font-bold text-xs sm:text-sm md:text-lg">Wallet Address: </p>
                <div className="flex flex-row items-center gap-x-2 text-white font-bold text-xs sm:text-sm md:text-lg">{balance.address}  {copied ? (
                  <span className="text-xs text-kii">Copied!</span>
                ) : (
                  <div onClick={() => copyAddress(balance.address)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </div>
                )}</div>
              </div>
              <div className='flex flex-col md:flex-row w-full gap-x-6 gap-y-6'>
                <div className='flex flex-col flex-1'>
                  <div className='flex flex-row justify-between mb-2 text-sm font-semibold text-white/60'>
                    <p>KII Balance:</p>
                    <p> {balance.balance.native} KII</p>
                  </div>
                  <TokenWrapForm
                    tokenBalance={{
                      native: balance.balance.native,
                      wkii: balance.balance.wkii
                    }}
                    address={balance.address}
                  />
                </div>
                <div className='flex flex-col flex-1'>
                  <div className='flex flex-row justify-between mb-2 text-sm font-semibold text-white/60'>
                    <p>WKII Balance:</p>
                    <p> {balance.balance.wkii} WKII</p>
                  </div>
                  <TokenUnwrapForm
                    tokenBalance={{
                      native: balance.balance.native,
                      wkii: balance.balance.wkii
                    }}
                    address={balance.address}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && Array.from(({ length: 4 }), (_, index) => <div
          key={index}
          className="w-full h-auto"
        ><Skeleton className="bg-primary w-full h-[150px] rounded-lg" /></div>)
        }
      </div>
    </div >
  );
};
