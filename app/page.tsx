'use client'

import Image from "next/image";
import { useEffect } from "react";
import { toast } from 'sonner';
import { TokenBalance } from "./features/Token/Components/TokenBalance";
import { Header } from "./features/Layout/Components/Header";
import { useWalletStore } from "./features/Wallet/Store/useWalletStore";
import { Footer } from "./features/Layout/Components/Footer";

export default function Home() {
  const { wallets, chainId, isOroTestNetChain } = useWalletStore();

  // Show toast when chain changes
  useEffect(() => {
    if (chainId !== null) {
      if (!isOroTestNetChain) {
        toast.warning('Please switch to Oro Testnet', {
          description: 'This dApp requires the Oro Testnet to function correctly.',
          duration: 5000,
        });
      } else {
        toast.success('Connected to Oro Testnet', {
          description: 'You are now connected to the correct network.',
          duration: 3000,
        });
      }
    }
  }, [chainId, isOroTestNetChain]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-4 mt-20 flex flex-col flex-1">
        <div className="flex flex-col flex-1">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent-2">
              KII Token Wrapper
            </h1>
            <p className="text-muted-foreground">
              Easily wrap and unwrap your KII tokens on the Oro Testnet
            </p>
          </div>
          <TokenBalance />
          {/* <div className="pb-6 animate-fade-in opacity-80">
            <h2 className="text-lg font-semibold mb-3">About KII Wrapping</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                The WKII token (Wrapped KII) is an ERC20 token that represents KII at a 1:1 ratio.
              </p>
              <p>
                Wrapping KII allows you to use the native token in DeFi applications and smart contracts
                that require ERC20 compatibility.
              </p>
              <p>
                You can wrap and unwrap tokens at any time with no fees (other than gas costs).
              </p>
            </div>
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
