import { TransactionState } from '@/libs/web3';
import { ORO_TESTNET_EXPLORER } from '@/libs/web3';

interface TransactionStatusProps {
  state: TransactionState;
  txHash: string | null;
  errorMessage: string | null;
  onReset?: () => void;
}

export function TransactionStatus({ 
  state, 
  txHash, 
  errorMessage, 
  onReset 
}: TransactionStatusProps) {
  const getStatusIcon = () => {
    switch (state) {
      case 'pending':
        return (
          <div className="h-12 w-12 rounded-full border-4 border-kii border-t-transparent animate-spin"></div>
        );
      case 'success':
        return (
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getStatusTitle = () => {
    switch (state) {
      case 'pending':
        return 'Transaction Pending';
      case 'success':
        return 'Transaction Successful';
      case 'error':
        return 'Transaction Failed';
      default:
        return '';
    }
  };
  
  const getStatusDescription = () => {
    switch (state) {
      case 'pending':
        return 'Your transaction is being processed. Please wait...';
      case 'success':
        return 'Your transaction has been successfully processed!';
      case 'error':
        return errorMessage || 'An error occurred while processing your transaction.';
      default:
        return '';
    }
  };
  
  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-4">
        {getStatusIcon()}
        
        <h2 className="text-lg font-semibold">
          {getStatusTitle()}
        </h2>
        
        <p className="text-muted-foreground">
          {getStatusDescription()}
        </p>
        
        {txHash && state !== 'pending' && (
          <a 
            href={`${ORO_TESTNET_EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-kii hover:text-kii-dark hover:underline transition-colors text-sm"
          >
            View on Explorer
          </a>
        )}
        
        {state !== 'pending' && (
          <button
            onClick={onReset}
            className="btn-secondary mt-4"
          >
            {state === 'success' ? 'Make Another Transaction' : 'Try Again'}
          </button>
        )}
      </div>
    </div>
  );
};