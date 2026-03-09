import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useForgotPassword, useResendResetPasswordCode, useResetPassword } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Logo from '@/assets/images/logo.png';
import { Label } from '@/components/ui/label';

const step1Schema = z.object({
    email: z.string().email('Invalid email address'),
});

const step2Schema = z.object({
    email: z.string().email('Invalid email address'),
    resetPasswordCode: z.string().min(6, 'Reset code must be 6 digits'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const forgotPassword = useForgotPassword();
    const resendResetPasswordCode = useResendResetPasswordCode();
    const resetPassword = useResetPassword();

    const form1 = useForm<z.infer<typeof step1Schema>>({
        resolver: zodResolver(step1Schema),
        mode: 'onChange',
        defaultValues: { email: '' },
    });

    const form2 = useForm<z.infer<typeof step2Schema>>({
        resolver: zodResolver(step2Schema),
        mode: 'onChange',
        defaultValues: { email: '', resetPasswordCode: '', newPassword: '' },
    });

    const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
        forgotPassword.mutate(data, {
            onSuccess: () => {
                setEmail(data.email);
                form2.setValue('email', data.email);
                setStep(2);
                toast.success('Reset code sent to your email');
            }
        });
    };

    const onStep2Submit = (data: z.infer<typeof step2Schema>) => {
        resetPassword.mutate({
            email: data.email,
            resetPasswordCode: data.resetPasswordCode,
            newPassword: data.newPassword,
        }, {
            onSuccess: () => {
                toast.success('Password reset successfully');
                setTimeout(() => navigate('/signin'), 2000);
            }
        });
    };

    const handleResendCode = () => {
        resendResetPasswordCode.mutate({ email }, {
            onSuccess: () => {
                toast.success('Reset code resent to your email');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="logo" width={112} className="mb-4" />
                    <p className="text-gray-600 text-lg">
                        {step === 1 ? 'Reset your password' : 'Enter new password'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    {step === 1 ? (
                        <Form {...form1}>
                            <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                                <FormField
                                    control={form1.control}
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

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-semibold mt-6"
                                    disabled={forgotPassword.isPending}
                                >
                                    {forgotPassword.isPending ? 'Sending Link...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...form2}>
                            <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                                <FormField
                                    control={form2.control}
                                    name="resetPasswordCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Reset Code</Label>
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

                                <FormField
                                    control={form2.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>New Password</Label>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter your new password"
                                                        className="pl-10 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-semibold mt-6"
                                    disabled={resetPassword.isPending}
                                >
                                    {resetPassword.isPending ? 'Resetting Password...' : 'Reset Password'}
                                </Button>
                            </form>
                        </Form>
                    )}

                    <div className="mt-8 flex flex-col items-center space-y-4">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendResetPasswordCode.isPending}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {resendResetPasswordCode.isPending ? 'Sending...' : "Didn't receive a code? Resend"}
                            </button>
                        )}

                        <div className="text-sm text-gray-600 flex items-center">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            <Link to="/signin" className="text-primary hover:underline font-medium">
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;