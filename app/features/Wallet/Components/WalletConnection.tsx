'use client'

import React, { useState } from 'react'
import { useWalletConnection } from '../Hooks/useWalletConnection';
import { useWalletStore } from '../Store/useWalletStore';
import { formatAddress } from '@/libs/web3';
import Button from '@/components/Button';

export function WalletConnection() {
    const {
        disconnect,
        connect,
        isConnecting,
        switchToOroTestnet
    } = useWalletConnection();
    const { isConnected, isOroTestNetChain } = useWalletStore()

    return (
        <div className="flex items-center gap-3">
            {!isConnected ? (
                <Button
                    onClick={connect}
                    disabled={isConnecting}
                >

                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
            ) : (
                <>
                    <Button
                        onClick={disconnect}
                        disabled={isConnecting}
                    >
                        <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                        <p>Disconnect</p>
                    </Button>
                    {!isOroTestNetChain && (
                        <button
                            onClick={switchToOroTestnet}
                            className="text-white font-bold text-sm cursor-pointer"
                        >
                            Switch to Oro Testnet
                        </button>
                    )}

                </>
            )}
        </div>
    )
}
