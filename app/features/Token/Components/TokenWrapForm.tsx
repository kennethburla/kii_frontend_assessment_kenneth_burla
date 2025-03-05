import React, { useState } from 'react'
import { useWrapUnwrapToken } from '../Hooks/useWrapUnwrap';
import { useWrapToken } from '../Hooks/useWrapToken';
import { useUnwrapToken } from '../Hooks/useUnwrapToken';

interface TokenWrapFormProps {
    tokenBalance: {
        native: string,
        wkii: string
    }
    address: string
}

export default function TokenWrapForm({
    tokenBalance: {
        native,
        wkii
    },
    address
}: TokenWrapFormProps) {
    const [amount, setAmount] = useState("")
    const { mutate: wrapToken, isPending: wrapTokenPending } = useWrapToken({
        callback: () => setAmount("")
    })

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numbers with up to 18 decimal places
        const value = e.target.value;
        if (/^\d*\.?\d{0,18}$/.test(value) || value === '') {
            setAmount(value);
        }
    };

    const setMaxNative = () => {
        // Set max amount for native token (leaving some for gas)
        const maxAmount = parseFloat(native);
        if (maxAmount > 0.01) {
            setAmount((maxAmount - 0.01).toFixed(18).replace(/\.?0+$/, ""));
        }
    };

    return (
        <div className="flex flex-col">
            <div>
                <div className="relative border-2 border-primary flex flex-row item-center px-4 py-2 rounded-lg">
                    <input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        className="pr-16 flex-1 text-lg font-semibold"
                    />
                    <div className="absolute right-2">
                        <button
                            type="button"
                            onClick={setMaxNative}
                            className="text-xs px-2 py-1 rounded font-bold hover:bg-secondary/20 cursor-pointer transition-colors"
                        >
                            Max KII
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <button
                        onClick={() => wrapToken({ amount, walletAddress: address })}
                        disabled={!amount || parseFloat(amount) <= 0 || wrapTokenPending}
                        className="bg-secondary font-bold py-2 px-6 rounded-md text-sm mt-2 w-full cursor-pointer disabled:opacity-50"
                    >
                         {wrapTokenPending ? "Wrapping..." : "Wrap to KII"}
                    </button>
                </div>


            </div>

        </div>
    )
}
