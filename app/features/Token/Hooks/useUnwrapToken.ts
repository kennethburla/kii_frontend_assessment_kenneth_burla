import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGetTokenBalancesKey } from "./useGetTokenBalances"
import { getProvider, formatError, WKII_TOKEN_ABI, WKII_TOKEN_ADDRESS } from "@/libs/web3"
import { ethers } from "ethers"
import { useToast } from "@/hooks/useToast"

interface UseUnwrapTokenProps {
    callback?: () => void
}

export function useUnwrapToken(props?: UseUnwrapTokenProps) {
    const { callback } = props || {}
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const mutation = useMutation({
        mutationFn,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: [useGetTokenBalancesKey] })
            callback?.()
        },
        onError(error) {
            console.log(error)
            toast({
                title: formatError(error)
            })
        },
    })


    return {
        data: mutation.data,
        mutate: mutation.mutate,
        isPending: mutation.isPending,
        error: mutation.error,
    }

    async function mutationFn({
        amount,
        walletAddress
    }: {
        amount: string,
        walletAddress: string
    }) {
        try {
            const provider = getProvider();
            const signer = await (await provider).getSigner(walletAddress); // ✅ Get signer with wallet address
            const contract = new ethers.Contract(WKII_TOKEN_ADDRESS, WKII_TOKEN_ABI, signer); // ✅ Attach signer

            const amountWei = ethers.parseEther(amount);

            const tx = await contract.withdraw(amountWei);
            return await tx.wait();
        } catch (error) {
            console.error('Error unwrapping tokens:', error);
            throw error;
        }
    }
}