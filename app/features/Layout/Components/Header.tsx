'use client'

import { WalletConnection } from "@/features/Wallet/Components/WalletConnection";
import Link from "next/link";
import Image from "next/image"

export function Header() {
    return (
        <header  className="sticky z-50 top-0 backdrop-blur-xl backdrop-saturate-150 bg-neutral-800/40 shadow shadow-neutral-800/10 shadow-lg">
            <div className="container max-w-5xl mx-auto flex justify-between items-center px-4">
                <div className="animate-fade-in">
                    <Link href="/">
                        <Image src="/logo-white.png" width={200} height={120} alt="KII Logo" />
                    </Link>
                    {/* <p className="text-sm font-regular">Easily wrap and unwrap your KII tokens on the Oro Testnet</p> */}
                </div>
                <WalletConnection />
            </div>
        </header>
    );
};