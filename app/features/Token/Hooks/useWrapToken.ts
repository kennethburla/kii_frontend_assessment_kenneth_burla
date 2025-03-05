import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGetTokenBalancesKey } from "./useGetTokenBalances"
import { getProvider, formatError, WKII_TOKEN_ABI, WKII_TOKEN_ADDRESS } from "@/libs/web3"
import { ethers } from "ethers"
import { useToast } from "@/hooks/useToast"

interface UseWrapTokenProps {
    callback?: () => void
}

export function useWrapToken(props?: UseWrapTokenProps) {
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
            const tx = await contract.deposit({ value: amountWei });

            return await tx.wait();
        } catch (err) {
            console.error('Error wrapping tokens:', err);
            throw err;
        }
    }
}