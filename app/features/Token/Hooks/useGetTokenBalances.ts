'use client'

import { useWalletStore } from "@/features/Wallet/Store/useWalletStore"
import { formatBalance, getNativeBalance, getWKIIBalance } from "@/libs/web3"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTokenBalancesKey = "get-token-balances"

export type UseGetTokenBalancesData = {
  address: string,
  balance: {
    native: string,
    wkii: string,
  }
}[]

export function useGetTokenBalances() {
  const queryClient = useQueryClient()
  const { wallets } = useWalletStore()

  const query = useQuery({
    queryKey: [useGetTokenBalancesKey],
    queryFn,
    enabled: wallets.length > 0,
    // refetchInterval: 15000
  })

  return {
    data: query.data,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    refetch: query.refetch,
    error: query.error,
    invalidate,
  }

  async function invalidate() {
    queryClient.invalidateQueries({ queryKey: [useGetTokenBalancesKey] })
  }

  async function queryFn() {
    const balances: UseGetTokenBalancesData = await Promise.all(
      wallets.map(async ({ address }) => {
        const balance = await getNativeBalance(address)
        const wkiiBalance = await getWKIIBalance(address)

        return {
          address,
          balance: {
            native: formatBalance(balance) ?? "0",
            wkii: formatBalance(wkiiBalance) ?? "0",
          },
        }
      })
    )

    return balances
  }
}