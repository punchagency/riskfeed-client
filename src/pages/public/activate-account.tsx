import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useActivateAccount, useResendActivationEmail } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Logo from '@/assets/images/logo.png';
import type { ActivateAccountDto } from '@/interfaces/user/dto/auth-requests.dto';
import { Label } from '@/components/ui/label';

const activateSchema = z.object({
    email: z.string().email('Invalid email address'),
    activationCode: z.string().min(6, 'Activation code must be 6 digits'),
});

const ActivateAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const activateAccount = useActivateAccount();
    const resendActivationEmail = useResendActivationEmail();

    const form = useForm<ActivateAccountDto>({
        resolver: zodResolver(activateSchema),
        mode: 'onChange',
        defaultValues: {
            email: location.state?.email || '',
            activationCode: '',
        },
    });

    const onSubmit = (data: ActivateAccountDto) => {
        activateAccount.mutate(data, {
            onSuccess: () => {
                toast.success('Account activated successfully');
                setTimeout(() => navigate('/signin'), 2000);
            },
        });
    };

    const handleResendCode = () => {
        const email = form.getValues('email');
        if (!email || form.getFieldState('email').invalid) {
            toast.error('Please enter a valid email address first');
            return;
        }
        resendActivationEmail.mutate({ email }, {
            onSuccess: () => {
                toast.success('Activation code resent to your email');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="logo" width={112} className="mb-4" />
                    <p className="text-gray-600 text-lg">Activate your account</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Email Address</Label>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="activationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Activation Code</Label>
                                        <FormControl>
                                            <div className="flex justify-center">
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup className="flex gap-2">
                                                        <InputOTPSlot index={0} className="w-12 h-12 first:rounded-l-xl rounded-r-xl border" />
                                                        <InputOTPSlot index={1} className="w-12 h-12 rounded-xl border" />
                                                        <InputOTPSlot index={2} className="w-12 h-12 rounded-xl border" />
                                                        <InputOTPSlot index={3} className="w-12 h-12 rounded-xl border" />
                                                        <InputOTPSlot index={4} className="w-12 h-12 rounded-xl border" />
                                                        <InputOTPSlot index={5} className="w-12 h-12 last:rounded-r-xl rounded-l-xl border" />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl font-semibold mt-6"
                                disabled={activateAccount.isPending}
                            >
                                {activateAccount.isPending ? 'Activating...' : 'Activate Account'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-8 flex flex-col items-center space-y-4">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendActivationEmail.isPending}
                            className="text-sm text-primary hover:underline font-medium"
                        >
                            {resendActivationEmail.isPending ? 'Sending...' : "Didn't receive a code? Resend"}
                        </button>

                        <div className="text-sm text-gray-600">
                            Back to{' '}
                            <Link to="/signin" className="text-primary hover:underline font-medium">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivateAccount;