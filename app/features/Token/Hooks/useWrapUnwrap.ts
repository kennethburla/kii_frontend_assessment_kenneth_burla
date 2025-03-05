"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getProvider, TransactionState, getWKIIContract, formatError } from "@/libs/web3";

export const useWrapUnwrapToken = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [status, setStatus] = useState<TransactionState>("idle");

    const monitorTransaction = async (hash: string) => {
        setStatus("pending");
        const provider = await getProvider();

        try {
            let receipt = null;
            while (!receipt) {
                receipt = await provider.getTransactionReceipt(hash);

                if (receipt && await receipt.confirmations() > 0) {
                    setStatus("success");
                    return;
                }
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3s
            }
        } catch (err) {
            setStatus("error");
            console.error("Transaction monitoring error:", err);
        }
    };

    const wrapTokens = async (amount: string) => {
        setLoading(true);
        setError(null);
        setTxHash(null);
        setStatus("idle");

        try {
            const contract = await getWKIIContract(true);
            const amountWei = ethers.parseEther(amount);

            const tx = await contract.deposit({ value: amountWei });
            setTxHash(tx.hash);

            await monitorTransaction(tx.hash);
            return tx;
        } catch (err) {
            setError(formatError(err));
            setStatus("error");
            console.error("Error wrapping tokens:", err);
        } finally {
            setLoading(false);
        }
    };

    const unwrapTokens = async (amount: string) => {
        setLoading(true);
        setError(null);
        setTxHash(null);
        setStatus("idle");

        try {
            const contract = await getWKIIContract(true);
            const amountWei = ethers.parseEther(amount);

            const tx = await contract.withdraw(amountWei);
            setTxHash(tx.hash);

            await monitorTransaction(tx.hash);
            return tx;
        } catch (err) {
            setError(formatError(err));
            setStatus("error");
            console.error("Error unwrapping tokens:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        wrapTokens,
        unwrapTokens,
        loading,
        error,
        txHash,
        status, // "idle", "pending", "success", "failed"
    };
};
