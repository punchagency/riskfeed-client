import React from 'react';
import { Wallet, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency } from '@/utils/format-currency-price';

interface InsufficientFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: () => void;
  currentBalance: number;
  requiredAmount: number;
  message: string;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({
  isOpen,
  onClose,
  onTopUp,
  currentBalance,
  requiredAmount,
  message
}) => {
  const shortfall = requiredAmount - currentBalance;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-card p-0 rounded-xl max-w-sm mx-auto border-0 shadow-2xl">
        <div className="relative w-full">
                    
          {/* Content */}
          <div className="p-6 pt-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            {/* Title */}
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Insufficient Funds
            </h2>
            
            {/* Message */}
            <p className="text-sm text-muted-foreground mb-6">
              {message}
            </p>
            
            {/* Balance Info */}
            <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current balance:</span>
                <Badge variant="outline" className="font-medium">
                  <Wallet className="w-3 h-3 mr-1" />
                  {formatCurrency(currentBalance, 'USD')}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ride fare:</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(requiredAmount, 'USD')}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Amount needed:</span>
                  <span className="font-semibold text-destructive">
                    {formatCurrency(shortfall, 'USD')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <AlertDialogFooter className="pb-6 px-6 flex flex-col gap-3">
            <Button 
              onClick={onTopUp} 
              className="w-full py-3 rounded-lg font-medium"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Add Funds to Wallet
            </Button>
            <Button 
              onClick={onClose}
              variant="outline" 
              className="w-full py-3 rounded-lg font-medium"
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InsufficientFundsModal;