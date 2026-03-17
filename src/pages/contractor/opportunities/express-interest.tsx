import { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin, Home, DollarSign, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateProposal } from '@/hooks/use-proposal';
import type { IProject } from '@/interfaces/project/project.interface';
import type { CreateProposalDto } from '@/interfaces/proposal/dto/create-proposal.dto';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PageBackButton } from '@/components/page-back-button';
import { Separator } from '@/components/ui/separator';

const milestoneSchema = z.object({
    name: z.string().min(1, 'Milestone name is required'),
    description: z.string().optional(),
    percentage: z.number().min(0.01, 'Percentage must be greater than 0').max(100, 'Percentage cannot exceed 100'),
    amount: z.number(),
    sequence: z.number(),
});

const proposalSchema = z.object({
    project: z.string(),
    coverLetter: z.string().optional(),
    hourlyRate: z.number().optional(),
    estimatedAmount: z.number().min(1, 'Estimated amount is required'),
    useDurationRange: z.boolean(),
    estimatedDurationDays: z.number().optional(),
    minEstimatedDurationDays: z.number().optional(),
    maxEstimatedDurationDays: z.number().optional(),
    estimatedStartDate: z.string().min(1, 'Start date is required'),
    estimatedEndDate: z.string().min(1, 'End date is required'),
    milestones: z.array(milestoneSchema).min(1, 'At least one milestone is required'),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
}).refine((data) => {
    if (data.useDurationRange) {
        return data.minEstimatedDurationDays && data.maxEstimatedDurationDays;
    }
    return data.estimatedDurationDays;
}, {
    message: 'Duration is required',
    path: ['estimatedDurationDays'],
});

type ProposalFormData = z.infer<typeof proposalSchema>;

const ExpressInterest = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const project = location.state as IProject;
    const createProposal = useCreateProposal();
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<ProposalFormData>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            project: projectId || '',
            coverLetter: '',
            hourlyRate: undefined,
            estimatedAmount: undefined,
            useDurationRange: false,
            estimatedDurationDays: undefined,
            minEstimatedDurationDays: undefined,
            maxEstimatedDurationDays: undefined,
            estimatedStartDate: '',
            estimatedEndDate: '',
            milestones: [{ name: '', description: '', percentage: undefined, amount: undefined, sequence: 1 }],
            notes: '',
            termsAndConditions: '',
        },
    });

    const milestones = useWatch({ control: form.control, name: 'milestones' });
    const estimatedAmount = useWatch({ control: form.control, name: 'estimatedAmount' });
    const useDurationRange = useWatch({ control: form.control, name: 'useDurationRange' });

    const totalPercentage = milestones.reduce((sum, m) => sum + (m.percentage || 0), 0);
    const remainingPercentage = 100 - totalPercentage;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPropertyType = (type: string) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getDurationText = () => {
        if (project.durationRange) {
            const minWeeks = Math.ceil(project.durationRange.minDays / 7);
            const maxWeeks = Math.ceil(project.durationRange.maxDays / 7);
            return `${minWeeks}-${maxWeeks} weeks`;
        }
        if (project.durationDays) {
            const weeks = Math.ceil(project.durationDays / 7);
            return `${weeks} weeks`;
        }
        return 'TBD';
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'TBD';
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(date));
    };

    const addMilestone = () => {
        const currentMilestones = form.getValues('milestones');
        form.setValue('milestones', [
            ...currentMilestones,
            { name: '', description: '', percentage: 0.00, amount: 0.00, sequence: currentMilestones.length + 1 },
        ]);
    };

    const removeMilestone = (index: number) => {
        const currentMilestones = form.getValues('milestones');
        if (currentMilestones.length > 1) {
            form.setValue(
                'milestones',
                currentMilestones.filter((_, i) => i !== index).map((m, i) => ({ ...m, sequence: i + 1 }))
            );
        }
    };

    const updateMilestonePercentage = (index: number, percentage: number) => {
        const currentMilestones = form.getValues('milestones');
        const amount = (estimatedAmount * percentage) / 100;
        currentMilestones[index] = { ...currentMilestones[index], percentage, amount };
        form.setValue('milestones', currentMilestones);
    };

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof ProposalFormData)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ['project', 'estimatedAmount', 'estimatedStartDate', "estimatedEndDate"];
                if (useDurationRange) {
                    fieldsToValidate.push('minEstimatedDurationDays', 'maxEstimatedDurationDays');
                } else {
                    fieldsToValidate.push('estimatedDurationDays');
                }
                break;
            case 2:
                fieldsToValidate = ['milestones'];
                if (totalPercentage !== 100) {
                    toast.error('Milestone percentages must sum to 100%');
                    return false;
                }
                break;
        }

        const result = await form.trigger(fieldsToValidate);
        return result;
    };

    const nextStep = async (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        const isValid = await validateStep(currentStep);
        if (isValid && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: ProposalFormData) => {
        const payload: CreateProposalDto = {
            project: data.project,
            coverLetter: data.coverLetter,
            hourlyRate: data.hourlyRate,
            estimatedAmount: data.estimatedAmount,
            estimatedDurationDays: data.useDurationRange ? undefined : data.estimatedDurationDays,
            minEstimatedDurationDays: data.useDurationRange ? data.minEstimatedDurationDays : undefined,
            maxEstimatedDurationDays: data.useDurationRange ? data.maxEstimatedDurationDays : undefined,
            estimatedStartDate: data.estimatedStartDate,
            estimatedEndDate: data.estimatedEndDate,
            milestones: data.milestones,
            notes: data.notes,
            termsAndConditions: data.termsAndConditions,
        };

        createProposal.mutate(payload, {
            onSuccess: () => {
                navigate('/opportunities');
            },
        });
    };

    const steps = [
        { number: 1, title: 'Overview, Pricing & Timeline', description: 'Project details, pricing & duration' },
        { number: 2, title: 'Milestones', description: 'Payment schedule' },
        { number: 3, title: 'Review', description: 'Confirm & submit' },
    ];

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        );
    }

    return (
        <>
            <PageBackButton
                onClick={() => navigate(-1)}
                text='Back'
            />

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 mt-4">
                {steps.map((step, index) => (
                    <>
                        <div key={step.number} className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'flex items-center justify-center w-10 h-10 rounded-full',
                                    currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                )}>
                                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{step.title}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        </div>
                        {index < steps.length - 1 && <div key={`divider-${index}`} className="h-px flex-1 mx-4 bg-secondary" />}
                    </>
                ))}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">
                        {/* Step 1: Project Overview + Cover Letter + Timeline */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="backdrop-blur-sm rounded-2xl p-8 border">
                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold mb-0">Project Overview</h2>
                                        <p className="text-muted-foreground">Review the project details and introduce yourself</p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                                        <p className="text-muted-foreground mb-2">{project.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Home className="w-4 h-4" />
                                                <span>
                                                    {typeof project.homeowner === 'string'
                                                        ? 'Homeowner'
                                                        : `${project.homeowner?.firstName || ''} ${project.homeowner?.lastName || ''}`.trim() || 'Homeowner'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {project.property?.address?.city || 'N/A'}, {project.property?.address?.state || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="p-3 rounded-lg bg-muted">
                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs">Budget</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                                                    {formatCurrency(project.minBudget)} - {formatCurrency(project.maxBudget)}
                                                </span>
                                            </div>

                                            <div className="p-3 rounded-lg bg-muted">
                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs">Timeline</span>
                                                </div>
                                                <span className="text-sm font-semibold">{getDurationText()}</span>
                                            </div>

                                            <div className="p-3 rounded-lg bg-muted">
                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs">Start Date</span>
                                                </div>
                                                <span className="text-sm font-semibold">{formatDate(project.startDate)}</span>
                                            </div>

                                            <div className="p-3 rounded-lg bg-muted">
                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                    <Home className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs">Property</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                                                    {project.property?.propertyType ? formatPropertyType(project.property.propertyType) : 'Single Family Home'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className='my-4' />
                                    <FormField
                                        control={form.control}
                                        name="coverLetter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cover Letter (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Introduce yourself and explain why you're the best fit for this project..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="my-4">

                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="estimatedAmount"
                                                render={({ field }) => (
                                                    <FormItem className='space-y-1 gap-0'>
                                                        <FormLabel>Estimated Amount <span className='text-destructive'>*</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter estimated amount"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <small className='text-muted-foreground'>Set your estimated amount</small>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* <FormField
                                                control={form.control}
                                                name="hourlyRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hourly Rate (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter hourly rate"
                                                                {...field}
                                                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> */}
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="useDurationRange"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                        <div>
                                                            <FormLabel>Use Duration Range</FormLabel>
                                                            <p className="text-sm text-muted-foreground">
                                                                Toggle to provide a min-max duration range instead of a fixed duration
                                                            </p>
                                                        </div>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {!useDurationRange ? (
                                                <FormField
                                                    control={form.control}
                                                    name="estimatedDurationDays"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Estimated Duration (Days) <span className='text-destructive'>*</span></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Enter duration in days"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="minEstimatedDurationDays"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Min Duration (Days) <span className='text-destructive'>*</span></FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Min days"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="maxEstimatedDurationDays"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Max Duration (Days) <span className='text-destructive'>*</span></FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Max days"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="estimatedStartDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Estimated Start Date <span className='text-destructive'>*</span></FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="estimatedEndDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Estimated End Date <span className='text-destructive'>*</span></FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </motion.div>
                        )}

                        {/* Step 2: Milestones */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="backdrop-blur-sm rounded-2xl p-8 border">
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">Milestones</h2>
                                                <p className="text-muted-foreground">Break down the payment schedule</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Total: {totalPercentage}%</p>
                                                <p
                                                    className={cn(
                                                        'text-sm font-semibold',
                                                        remainingPercentage === 0 ? 'text-green-600' : 'text-orange-600'
                                                    )}
                                                >
                                                    Remaining: {remainingPercentage}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {milestones.map((_, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold">Milestone {index + 1}</h3>
                                                    {milestones.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeMilestone(index)}
                                                            className='text-destructive border-destructive hover:text-destructive/80 border:hover:bg-destructive/10'
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`milestones.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Name <span className='text-destructive'>*</span></FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g., Initial Deposit" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`milestones.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Description (Optional)</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="Describe this milestone..." {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`milestones.${index}.percentage`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Percentage <span className='text-destructive'>*</span></FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                const value = parseFloat(e.target.value) || 0;
                                                                                field.onChange(value);
                                                                                updateMilestonePercentage(index, value);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name={`milestones.${index}.amount`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Amount</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            disabled
                                                                            value={field.value ? field.value.toFixed(2) : 0.00}
                                                                            className="bg-muted text-foreground"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <Button type="button" variant="default" onClick={addMilestone} className="w-full">
                                            Add Milestone
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Terms & Review */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="backdrop-blur-sm rounded-2xl p-8 border">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold mb-2">Terms & Review</h2>
                                        <p className="text-muted-foreground">Add final details and review your proposal</p>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="notes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Additional Notes (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Any additional information..."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="termsAndConditions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Terms & Conditions (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Specify your terms and conditions..."
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="border-t pt-4 mt-6">
                                            <h3 className="font-semibold mb-3">Proposal Summary</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Estimated Amount:</span>
                                                    <span className="font-semibold">{formatCurrency(estimatedAmount)}</span>
                                                </div>
                                                {form.getValues('hourlyRate') && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Hourly Rate:</span>
                                                        <span className="font-semibold">{formatCurrency(form.getValues('hourlyRate')!)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Duration:</span>
                                                    <span className="font-semibold">
                                                        {useDurationRange
                                                            ? `${form.getValues('minEstimatedDurationDays')}-${form.getValues('maxEstimatedDurationDays')} days`
                                                            : `${form.getValues('estimatedDurationDays')} days`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Milestones:</span>
                                                    <span className="font-semibold">{milestones.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>

                        {currentStep <= 2 ? (
                            <div className="flex gap-4 items-center">
                                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                    Previous Step
                                </Button>
                                <Button type="button" onClick={(e) => nextStep(e)}>
                                    Next Step
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center">
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous Step
                                </Button>
                                <Button type="submit" disabled={createProposal.isPending}>
                                    {createProposal.isPending ? 'Submitting...' : 'Submit Proposal'}
                                </Button>
                            </div>
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
};

export default ExpressInterest;
