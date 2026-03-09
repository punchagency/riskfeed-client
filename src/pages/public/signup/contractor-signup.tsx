import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FaUser, FaBriefcase, FaCheckCircle, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import Logo from '@/assets/images/logo.png';
import type { RegisterUserDto } from '@/interfaces/user/dto/register-user.dto';
import { TEAM_SIZE_BUCKETS } from '@/interfaces/user/user.interface';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { PROJECT_TYPES } from '@/interfaces/project/project.interface';

const contractorSchema = z.object({
    // Step 1: Personal Information
    firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Invalid phone number format'),
    
    // Step 2: Business Information
    companyName: z.string().min(1, 'Business name is required'),
    licenseNumber: z.string().min(1, 'License number is required'),
    taxId: z.string().min(1, 'Tax ID is required'),
    yearsInBusiness: z.coerce.number().min(0, 'Years in business must be 0 or greater'),
    businessWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
    teamSize: z.enum(TEAM_SIZE_BUCKETS),
    services: z.array(z.enum(PROJECT_TYPES)).min(1, 'Please select at least one service'),
    businessAddress: z.object({
        street: z.string().min(1, 'Business street address is required'),
        city: z.string().min(1, 'Business city is required'),
        state: z.string().min(1, 'Business state is required').length(2, 'State must be 2 characters (e.g., OR)'),
        zipcode: z.string().min(1, 'Business ZIP code is required').regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
        country: z.string()
    }),
    
    // Step 3: Password & Terms
    password: z.string()
        .min(1, 'Password is required')
        .min(7, 'Password must be at least 7 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

type ContractorFormData = z.infer<typeof contractorSchema>;

const ContractorSignup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const registerUser = useRegister();

    const form = useForm<ContractorFormData>({
        resolver: zodResolver(contractorSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            companyName: '',
            licenseNumber: '',
            taxId: '',
            yearsInBusiness: 0,
            businessWebsite: '',
            teamSize: 'one_to_five',
            services: [],
            businessAddress: {
                street: '',
                city: '',
                state: '',
                zipcode: '',
                country: 'USA'
            },
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        }
    });

    const onSubmit = (data: ContractorFormData) => {
        const payload: RegisterUserDto = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
            address: data.businessAddress,
            role: 'contractor',
            status: 'pending',
            contractorData: {
                companyName: data.companyName,
                licenseNumber: data.licenseNumber,
                taxId: data.taxId,
                yearsInBusiness: data.yearsInBusiness,
                businessEmail: data.email,
                businessPhone: data.phoneNumber,
                businessWebsite: data.businessWebsite,
                businessAddress: data.businessAddress,
                services: data.services,
                serviceAreas: [], // Default or add field if needed
                teamSize: data.teamSize
            }
        };
        registerUser.mutate(payload);
        navigate("/signin")
    };

    const nextStep = async () => {
        let fields: FieldPath<ContractorFormData>[] = [];
        if (step === 1) {
            fields = ['firstName', 'lastName', 'email', 'phoneNumber'];
        } else if (step === 2) {
            fields = [
                'companyName', 'licenseNumber', 'taxId', 'yearsInBusiness', 
                'businessWebsite', 'teamSize', 'services',
                'businessAddress.street', 'businessAddress.city', 
                'businessAddress.state', 'businessAddress.zipcode'
            ];
        }

        const isValid = await form.trigger(fields);
        if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const steps = [
        { id: 1, title: 'Personal Info', description: 'Your basic details', icon: FaUser },
        { id: 2, title: 'Business Info', description: 'Company details', icon: FaBriefcase },
        { id: 3, title: 'Finalize', description: 'Review and password', icon: FaCheckCircle },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <img src={Logo} alt="Riskfeed logo" className="h-12 mx-auto mb-4" />
                    <h1 className="text-4xl font-semibold text-slate-900 mb-2">Contractor Registration</h1>
                    <p className="text-secondary-foreground max-w-md mx-auto">
                        Complete three simple steps to join the Riskfeed network and start connecting with clients.
                    </p>
                </div>

                {/* Progress Tracker */}
                <div className="mb-10 relative">
                    <div className="flex justify-between items-center relative z-10">
                        {steps.map((s, idx) => {
                            const Icon = s.icon;
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;
                            
                            return (
                                <div key={s.id} className="flex flex-col items-center flex-1 relative">
                                    {/* Connector Line */}
                                    {idx < steps.length - 1 && (
                                        <div className={cn(
                                            "hidden md:block absolute top-6 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 z-0 bg-secondary",
                                            // step > s.id ? "bg-secondary" : "bg-slate-200"
                                        )} />
                                    )}
                                    
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm bg-white relative z-10",
                                        isActive ? "bg-primary border-primary text-white scale-110" : 
                                        isCompleted ? "bg-primary border-primary text-white" : 
                                        "text-slate-400 border-slate-200"
                                    )}>
                                        {isCompleted ? <FaCheck /> : <Icon className="text-lg" />}
                                    </div>
                                    <div className="mt-3 text-center relative z-10">
                                        <p className={cn(
                                            "text-sm font-semibold",
                                            isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-slate-400"
                                        )}>{s.title}</p>
                                        <p className="text-xs text-slate-400 hidden md:block">{s.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Container */}
                <div className="rounded-2xl border overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10">
                            {/* Step 1: Personal Information */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-semibold text-slate-800">Personal Information</h2>
                                        <p className="text-slate-500">How should we contact you?</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="firstName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary-foreground font-semibold">First Name <span className="text-destructive">*</span></FormLabel>
                                                <FormControl><Input placeholder="John" className="h-12" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="lastName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary-foreground font-semibold">Last Name <span className="text-destructive">*</span></FormLabel>
                                                <FormControl><Input placeholder="Doe" className="h-12" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-secondary-foreground font-semibold">Email Address <span className="text-destructive">*</span></FormLabel>
                                            <FormControl><Input type="email" placeholder="john.doe@example.com" className="h-12" {...field} /></FormControl>
                                            <FormDescription>We'll use this for account verification and communications.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-secondary-foreground font-semibold">Phone Number <span className="text-destructive">*</span></FormLabel>
                                            <FormControl><Input placeholder="(555) 123-4567" className="h-12" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                            {/* Step 2: Business Information */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-semibold text-slate-800">Business Information</h2>
                                        <p className="text-slate-500">Tell us about your company and expertise.</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <FormField control={form.control} name="companyName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary-foreground font-semibold">Business Name <span className="text-destructive">*</span></FormLabel>
                                                <FormControl><Input placeholder="Acme Contracting LLC" className="h-12" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">License Number <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl><Input placeholder="LIC-12345678" className="h-12" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="taxId" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">Tax ID / EIN <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl><Input placeholder="XX-XXXXXXX" className="h-12" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField control={form.control} name="yearsInBusiness" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">Years in Business <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl><Input type="number" min="0" className="h-12" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="teamSize" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">Team Size <span className="text-destructive">*</span></FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select size" /></SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {TEAM_SIZE_BUCKETS.map(size => (
                                                                <SelectItem key={size} value={size}>
                                                                    {size.replace(/_/g, ' ').replace(/-/g, '-').replace(/\b\w/g, l => l.toUpperCase())}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={form.control} name="businessWebsite" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-secondary-foreground font-semibold">Business Website (Optional)</FormLabel>
                                                <FormControl><Input placeholder="https://www.acme.com" className="h-12" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="space-y-4 pt-4">
                                            <h3 className="font-semibold text-secondary-foreground">Business Address</h3>
                                            <FormField control={form.control} name="businessAddress.street" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Street Address <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl><Input placeholder="123 Builder Lane" className="h-12" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <FormField control={form.control} name="businessAddress.city" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="Portland" className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="businessAddress.state" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>State (2 letters) <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="OR" maxLength={2} className="h-12 uppercase" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="businessAddress.zipcode" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>ZIP Code <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl><Input placeholder="97201" className="h-12" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        <FormField control={form.control} name="services" render={() => (
                                            <FormItem className="pt-4">
                                                <FormLabel className="text-secondary-foreground font-semibold">Services Offered <span className="text-destructive">*</span></FormLabel>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl mt-2 border border-slate-100">
                                                    {PROJECT_TYPES.map((service) => (
                                                        <FormField key={service} control={form.control} name="services" render={({ field }) => (
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(service)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, service])
                                                                                : field.onChange(field.value?.filter((val) => val !== service));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="flex-1 font-medium text-secondary-foreground cursor-pointer select-none">
                                                                    {service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )} />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Password */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="border-b border-slate-100 pb-4 mb-6">
                                        <h2 className="text-2xl font-semibold text-slate-800">Finalize Account</h2>
                                        <p className="text-slate-500">Set your password and review your information.</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
                                                    <FaUser className="text-sm" /> Personal Details
                                                </h3>
                                                <div className="space-y-1 text-sm text-secondary-foreground">
                                                    <p><span className="font-semibold">Name:</span> {form.getValues('firstName')} {form.getValues('lastName')}</p>
                                                    <p><span className="font-semibold">Email:</span> {form.getValues('email')}</p>
                                                    <p><span className="font-semibold">Phone:</span> {form.getValues('phoneNumber')}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
                                                    <FaBriefcase className="text-sm" /> Business Details
                                                </h3>
                                                <div className="space-y-1 text-sm text-secondary-foreground">
                                                    <p><span className="font-semibold">Company:</span> {form.getValues('companyName')}</p>
                                                    <p><span className="font-semibold">Address:</span> {form.getValues('businessAddress.street')}, {form.getValues('businessAddress.city')}</p>
                                                    <p><span className="font-semibold">Services:</span> {form.getValues('services').length} Selected</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField control={form.control} name="password" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">Create Password <span className="text-destructive">*</span></FormLabel>
                                                    <div className="relative">
                                                        <FormControl>
                                                            <Input type={showPassword ? "text" : "password"} className="h-12 pr-10" {...field} />
                                                        </FormControl>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary-foreground"
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-secondary-foreground font-semibold">Confirm Password <span className="text-destructive">*</span></FormLabel>
                                                    <div className="relative">
                                                        <FormControl>
                                                            <Input type={showConfirmPassword ? "text" : "password"} className="h-12 pr-10" {...field} />
                                                        </FormControl>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary-foreground"
                                                        >
                                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-medium text-secondary-foreground cursor-pointer">
                                                        I agree to the <span className="text-primary hover:underline">Terms of Service</span> and <span className="text-primary hover:underline">Privacy Policy</span>. <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            )}

                            {/* Footer / Navigation */}
                            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-4">
                                {step > 1 && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={prevStep} 
                                        className="h-12 px-8 font-semibold text-secondary-foreground"
                                    >
                                        <FaArrowLeft className="mr-2" /> Previous
                                    </Button>
                                )}
                                <div className="sm:ml-auto w-full sm:w-auto">
                                    {step < 3 ? (
                                        <Button 
                                            type="button" 
                                            onClick={nextStep} 
                                            className="h-12 px-10 w-full sm:w-auto font-semibold"
                                        >
                                            Next Step <FaArrowRight className="ml-2" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            disabled={registerUser.isPending} 
                                            className=""
                                        >
                                            {registerUser.isPending ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </span>
                                            ) : (
                                                "Complete Registration"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
                
                {/* Support Footer */}
                <p className="text-center text-secondary-foreground mt-8 text-sm">
                    Already have an account? <a href="/login" className="text-primary font-semibold hover:underline">Log in here</a>
                </p>
            </div>
        </div>
    );
};

export default ContractorSignup;