import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNativeBalance, formatBalance, getWKIIBalance } from '@/libs/web3';

export function useTokenBalance(address: string | null) {
  const [formattedNativeBalance, setFormattedNativeBalance] = useState('0');
  const [formattedWKIIBalance, setFormattedWKIIBalance] = useState('0');

  // Query for native token balance
  const nativeBalanceQuery = useQuery({
    queryKey: ['nativeBalance', address],
    queryFn: async () => {
      if (!address) throw new Error('No address provided');
      const balance = await getNativeBalance(address);
      return balance;
    },
    enabled: !!address,
    refetchInterval: 15000 // Refetch every 15 seconds
  });

  // Query for WKII token balance
  const wkiiBalanceQuery = useQuery({
    queryKey: ['wkiiBalance', address],
    queryFn: async () => {
      if (!address) throw new Error('No address provided');
      const balance = await getWKIIBalance(address);
      return balance;
    },
    enabled: !!address,
    refetchInterval: 15000 // Refetch every 15 seconds
  });

  // Format balances when they change
  useEffect(() => {
    if (nativeBalanceQuery.data) {
      setFormattedNativeBalance(formatBalance(nativeBalanceQuery.data));
    }
    
    if (wkiiBalanceQuery.data) {
      setFormattedWKIIBalance(formatBalance(wkiiBalanceQuery.data));
    }
  }, [nativeBalanceQuery.data, wkiiBalanceQuery.data]);

  // Manual refresh function
  const refresh = useCallback(() => {
    nativeBalanceQuery.refetch();
    wkiiBalanceQuery.refetch();
  }, [nativeBalanceQuery, wkiiBalanceQuery]);

  return {
    nativeBalance: nativeBalanceQuery.data,
    wkiiBalance: wkiiBalanceQuery.data,
    formattedNativeBalance,
    formattedWKIIBalance,
    isLoading: nativeBalanceQuery.isLoading || wkiiBalanceQuery.isLoading,
    isError: nativeBalanceQuery.isError || wkiiBalanceQuery.isError,
    error: nativeBalanceQuery.error || wkiiBalanceQuery.error,
    refresh
  };
}