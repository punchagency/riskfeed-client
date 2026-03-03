import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import type { RegisterUserDto } from '@/interfaces/user/dto/register-user.dto';
import { PROPERTY_TYPES, OWNERSHIP_TYPES, HEARD_ABOUT_SOURCES } from '@/interfaces/user/user.interface';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number format'),
    address: z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
        zipcode: z.string().min(1, 'ZIP code is required').regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
        country: z.string()
    }),
    propertyType: z.enum(PROPERTY_TYPES).optional(),
    ownershipType: z.enum(OWNERSHIP_TYPES).optional(),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    heardAboutSource: z.enum(HEARD_ABOUT_SOURCES).optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>; 

const UserSignup = () => {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            address: { country: 'USA' }
        }
    });
    const registerUser = useRegister();
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = (data: RegisterFormData) => {
        const payload: RegisterUserDto = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: `+1${data.phoneNumber}`,
            password: data.password,
            address: { ...data.address, country: 'USA' },
            role: 'user',
            ownershipType: data.ownershipType,
            properties: data.propertyType ? [{
                type: data.propertyType,
                address: data.address,
                ownershipType: data.ownershipType
            }] : undefined,
            heardAboutRiskfeed: data.heardAboutSource ? {
                source: data.heardAboutSource
            } : undefined
        };
        registerUser.mutate(payload, {
            // onSuccess: () => navigate('/dashboard'),
            onError: (error) => console.error('Registration failed:', error)
        });
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className='text-center mb-3'>
                <h3 className='text-primary text-3xl font-bold'>Create Homeowner Account</h3>
                <p className='text-muted-foreground'>Join Indigo to start managing your construction projects safely</p>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FaUser className="text-gray-600" />
                                <h2 className="text-xl font-semibold">Personal Information</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FaEnvelope className="text-gray-600" />
                                <h2 className="text-xl font-semibold">Contact Information</h2>
                            </div>
                            <div className="space-y-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl><Input type="email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Property Information */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FaMapMarkerAlt className="text-gray-600" />
                                <h2 className="text-xl font-semibold">Property Information</h2>
                            </div>
                            <div className="space-y-4">
                                <FormField control={form.control} name="address.street" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="address.city" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.state" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl><Input placeholder="CA" maxLength={2} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="address.zipcode" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ZIP Code <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl><Input placeholder="94102" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="propertyType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Type <span className='text-destructive'>*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'><SelectValue placeholder="Select type" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_TYPES.map(type => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="ownershipType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ownership Status <span className='text-destructive'>*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'><SelectValue placeholder="Select status" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {OWNERSHIP_TYPES.map(type => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        </div>

                        {/* Create Password */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FaLock className="text-gray-600" />
                                <h2 className="text-xl font-semibold">Create Password</h2>
                            </div>
                            <div className="space-y-4">
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? 'text' : 'password'} {...field} />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {showPassword ? <FaEye className='size-5' /> : <FaEyeSlash className='size-5' />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {showConfirmPassword ? <FaEye className='size-5' /> : <FaEyeSlash className='size-5' />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* How did you hear about Indigo */}
                        <FormField control={form.control} name="heardAboutSource" render={({ field }) => (
                            <FormItem>
                                <FormLabel>How did you hear about Indigo?</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'><SelectValue placeholder="Select option" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {HEARD_ABOUT_SOURCES.map(source => (
                                            <SelectItem key={source} value={source}>
                                                {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Submit Button */}
                        <Button type="submit" className="w-full text-white py-6 text-lg" disabled={registerUser.isPending}>
                            {registerUser.isPending ? 'Creating Account...' : 'Create Homeowner Account'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default UserSignup;
