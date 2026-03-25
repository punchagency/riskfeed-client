import React, { useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FiAlertCircle, FiCheck, FiLock, FiDelete } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useSetTransactionPin } from '@/hooks/use-auth';
import { useAppSelector } from '@/store/hooks';
import { formatCurrency } from '@/utils/format-currency-price';

interface TransactionPinDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pin: string) => void;
    title?: string;
    description?: string;
    amount?: number;
    isLoading?: boolean;
}

const TransactionPinDrawer: React.FC<TransactionPinDrawerProps> = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Authorize Transaction",
    description = "Enter your 4-digit transaction PIN to proceed",
    amount,
    isLoading: actionLoading = false
}) => {
    const currentUser = useAppSelector((state) => state.user.user);
    const hasPin = currentUser?.user?.hasTransactionPin;

    const [step, setStep] = useState<'verify' | 'create' | 'confirm_create'>(hasPin ? 'verify' : 'create');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const setTransactionPin = useSetTransactionPin();

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    const [prevHasPin, setPrevHasPin] = useState(hasPin);

    // Reset state when opening or when hasPin changes (instead of using useEffect)
    // This avoids "Calling setState synchronously within an effect" warning
    if (isOpen !== prevIsOpen || hasPin !== prevHasPin) {
        setPrevIsOpen(isOpen);
        setPrevHasPin(hasPin);
        if (isOpen) {
            setStep(hasPin ? 'verify' : 'create');
            setPin('');
            setConfirmPin('');
            setError('');
        }
    }

    const handlePinComplete = (value: string) => {
        if (step === 'verify') {
            onSuccess(value);
        } else if (step === 'create') {
            setPin(value);
            setStep('confirm_create');
            setConfirmPin('');
        } else if (step === 'confirm_create') {
            if (value === pin) {
                setTransactionPin.mutateAsync({ pin: value });
                setStep('verify');
                setPin('');
                setConfirmPin('');
            } else {
                setError('PINs do not match');
                setConfirmPin('');
                // Shake animation could be added here
                setTimeout(() => {
                    setStep('create');
                    setPin('');
                    setError('');
                }, 1500);
            }
        }
    };

    const handleKeyClick = (key: string) => {
        const currentVal = step === 'confirm_create' ? confirmPin : pin;
        const setVal = step === 'confirm_create' ? setConfirmPin : setPin;

        setError(''); // Clear error on any key press

        if (key === 'delete') {
            setVal(currentVal.slice(0, -1));
        } else if (key === 'clear') {
            setVal('');
        } else if (currentVal.length < 4) {
            setVal(currentVal + key);
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && !actionLoading && !setTransactionPin.isPending && onClose()}>
            <DrawerContent className="max-h-[85vh]">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="pb-2">
                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <FiLock className="h-6 w-6 text-primary" />
                        </div>
                        <DrawerTitle className="text-center">
                            {step === 'verify' ? title : 'Create Transaction PIN'}
                        </DrawerTitle>
                        <DrawerDescription className="text-center">
                            {step === 'verify' ? description :
                                step === 'create' ? 'Set a 4-digit PIN for authorizing your transactions' :
                                    'Confirm your new 4-digit transaction PIN'}
                        </DrawerDescription>
                    </DrawerHeader>

                    {amount !== undefined && step === 'verify' && (
                        <div className="px-6 py-2 text-center">
                            <p className="text-2xl font-semibold">{formatCurrency(amount, 'USD')}</p>
                        </div>
                    )}

                    <div className="px-6 py-2 pb-0 space-y-2">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <InputOTP
                                maxLength={4}
                                value={step === 'confirm_create' ? confirmPin : pin}
                                disabled={actionLoading || setTransactionPin.isPending}
                                readOnly
                                className="pointer-events-none"
                            >
                                <InputOTPGroup className="gap-4">
                                    {[0, 1, 2, 3].map((index) => {
                                        const value = step === 'confirm_create' ? confirmPin : pin;
                                        return (
                                            <div key={index} className="relative">
                                                <InputOTPSlot
                                                    index={index}
                                                    className={cn(
                                                        "h-14 w-12 rounded-r-md text-transparent caret-transparent",
                                                        error ? "border-destructive" : ""
                                                    )}
                                                />
                                                {value[index] && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <span className="text-2xl text-foreground">•</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </InputOTPGroup>
                            </InputOTP>

                            {error && (
                                <p className="text-sm text-destructive flex items-center gap-1 animate-pulse">
                                    <FiAlertCircle className="h-4 w-4" />
                                    {error}
                                </p>
                            )}

                            {step === 'confirm_create' && !error && !setTransactionPin.isPending && pin === confirmPin && pin.length === 4 && (
                                <p className="text-sm text-primary flex items-center gap-1">
                                    <FiCheck className="h-4 w-4" />
                                    PINs match
                                </p>
                            )}

                            {(setTransactionPin.isPending || actionLoading) && (
                                <p className="text-sm text-muted-foreground animate-pulse">
                                    Processing...
                                </p>
                            )}
                        </div>

                        {/* Numeric Keypad */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-2 max-w-[280px] mx-auto pb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'del'].map((key) => (
                                <Button
                                    key={key}
                                    variant="ghost"
                                    className={cn(
                                        "h-11 w-11 text-xl font-normal rounded-full hover:bg-primary/5 active:scale-90 transition-all flex items-center justify-center p-0 mx-auto",
                                        (key === 'del' || key === 'C') ? "text-muted-foreground/70" : "text-foreground"
                                    )}
                                    onClick={() => handleKeyClick(key === 'del' ? 'delete' : key === 'C' ? 'clear' : key.toString())}
                                    disabled={actionLoading || setTransactionPin.isPending}
                                >
                                    {key === 'del' ? <FiDelete className="h-6 w-6" /> : key}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DrawerFooter className="pt-0 space-y-2">
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={
                                (step === 'confirm_create' ? confirmPin.length !== 4 : pin.length !== 4) ||
                                setTransactionPin.isPending ||
                                actionLoading
                            }
                            onClick={() => handlePinComplete(step === 'confirm_create' ? confirmPin : pin)}
                        >
                            {step === 'verify' ? 'Authorize' : step === 'create' ? 'Continue' : 'Confirm & Create'}
                        </Button>

                        {step === 'confirm_create' ? (
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    setStep('create');
                                    setPin('');
                                    setConfirmPin('');
                                }}
                                disabled={setTransactionPin.isPending || actionLoading}
                            >
                                Back
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full text-muted-foreground" onClick={onClose} disabled={setTransactionPin.isPending || actionLoading}>
                                Cancel
                            </Button>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default TransactionPinDrawer;
