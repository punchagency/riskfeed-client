import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Logo from '@/assets/images/logo.png';
import type { LoginDto } from '@/interfaces/user/dto/auth-requests.dto';
import { Label } from '@/components/ui/label';
import { isLoggedIn } from '@/utils/IsLoggedIn';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = isLoggedIn();
    if (isAuthenticated) navigate('/');
    const login = useLogin();

    const form = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginDto) => {
        login.mutate(data, {
            onSuccess: () => {
                toast.success('Login successful');
                setTimeout(()=> window.location.href = '/', 2000);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="logo" width={112} className="mb-4" />
                    <p className="text-gray-600 text-lg">Sign in to your account</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
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

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl font-semibold"
                                disabled={login.isPending}
                            >
                                {login.isPending ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-xs text-gray-600">
                        Don't have an account?{' '}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full mt-4 h-12 rounded-xl font-semibold"
                        onClick={() => navigate('/signup')}
                    >
                        Create Account
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signin;