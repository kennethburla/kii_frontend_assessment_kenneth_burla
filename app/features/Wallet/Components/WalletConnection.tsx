'use client'

import React, { useEffect, useState } from 'react'
import { useWalletConnection } from '../Hooks/useWalletConnection';
import { useWalletStore } from '../Store/useWalletStore';
import Button from '@/components/Button';
import { Menu, X } from "lucide-react";

export function WalletConnection() {
    const {
        disconnect,
        connect,
        isConnecting,
        switchToOroTestnet
    } = useWalletConnection();
    const { isConnected, isOroTestNetChain } = useWalletStore()
    const [isOpen, setIsOpen] = useState(false);
    const [noWalletFound, setNoWalletFound] = useState(true)

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (window && typeof window.ethereum === 'undefined') {
            setNoWalletFound(true)
        } else {
            setNoWalletFound(false)
        }
    }, [])


    return (
        <div className="flex items-center gap-3">
            {!isConnected ? (
                <div className='flex flex-row items-center gap-x-3'>
                    <Button
                        onClick={connect}
                        disabled={isConnecting || noWalletFound}
                        className='disabled:opacity-40'
                    >

                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>

                </div>
            ) : (
                <>
                    <Button
                        onClick={disconnect}
                        disabled={isConnecting}
                    >
                        <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                        <p>Disconnect</p>
                    </Button>
                    {!isOroTestNetChain && <button
                        className="block md:hidden rounded-md focus:outline-none focus:ring-0 focus:ring-none cursor-pointer"
                        onClick={toggleMenu}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>}
                    {!isOroTestNetChain && (
                        <button
                            onClick={switchToOroTestnet}
                            className="text-white font-bold text-sm cursor-pointer hidden md:block"
                        >
                            Switch to Oro Testnet
                        </button>
                    )}
                    <nav
                        className={`${isOpen ? 'block' : 'hidden'
                            } absolute p-2 px-6 top-14 right-4 bg-gray-800 rounded-md md:hidden`}
                    >
                        <ul className="space-y-4 p-2">
                            <li className="w-fit">
                                <div className="w-full">
                                    {!isOroTestNetChain && (
                                        <button
                                            onClick={switchToOroTestnet}
                                            className="text-white font-bold text-sm cursor-pointer"
                                        >
                                            Switch to Oro Testnet
                                        </button>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    )
}
