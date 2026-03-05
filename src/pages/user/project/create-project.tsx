import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, FileText, X } from 'lucide-react';
import { useCreateProject } from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import type { CreateProjectDto } from '@/interfaces/project/dto/create-project.dto';
import { OWNERSHIP_TYPES, PROPERTY_TYPES } from '@/interfaces/user/user.interface';
import { useReduxAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/page-header';
import { PageBackButton } from '@/components/page-back-button';

const projectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(1, 'Description is required'),
    propertyType: z.string().min(1, 'Property type is required'),
    propertyName: z.string().optional(),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipcode: z.string().min(1, 'Zipcode is required'),
    country: z.string().min(1, 'Country is required'),
    ownershipType: z.string().optional(),
    propertySize: z.string().optional(),
    propertyOwnerName: z.string().optional(),
    minBudget: z.string().min(1, 'Minimum budget is required'),
    maxBudget: z.string().min(1, 'Maximum budget is required'),
    useDurationRange: z.boolean(),
    durationDays: z.string().optional(),
    minDays: z.string().optional(),
    maxDays: z.string().optional(),
    startDate: z.string().optional(),
});

const CreateProject = () => {
    const { user } = useReduxAuth();
    const [step, setStep] = useState(1);
    const [propertyImages, setPropertyImages] = useState<File[]>([]);
    const [propertyDocuments, setPropertyDocuments] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const createProject = useCreateProject();

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            propertyType: '',
            propertyName: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            ownershipType: '',
            propertySize: '',
            propertyOwnerName: '',
            minBudget: '',
            maxBudget: '',
            useDurationRange: false,
            durationDays: '',
            minDays: '',
            maxDays: '',
            startDate: '',
        },
    });

    const useDurationRange = form.watch('useDurationRange');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPropertyImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPropertyDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setPropertyImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeDocument = (index: number) => {
        setPropertyDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = async (currentStep: number) => {
        let fieldsToValidate: (keyof z.infer<typeof projectSchema>)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['propertyType', 'street', 'city', 'state', 'zipcode', 'country'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['title', 'description', 'minBudget', 'maxBudget'];
        }

        const result = await form.trigger(fieldsToValidate);
        return result;
    };

    const handleNextStep = async (nextStep: number) => {
        const isValid = await validateStep(step);
        if (isValid) {
            setStep(nextStep);
        }
    };

    const onSubmit = (data: z.infer<typeof projectSchema>) => {
        const payload: CreateProjectDto = {
            title: data.title,
            description: data.description,
            property: {
                type: data.propertyType,
                name: data.propertyName,
                address: {
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    zipcode: data.zipcode,
                    country: data.country,
                },
                ownershipType: data.ownershipType,
                sizeSqFt: data.propertySize ? Number(data.propertySize) : undefined,
                ownerName: data.propertyOwnerName,
            },
            minBudget: Number(data.minBudget),
            maxBudget: Number(data.maxBudget),
            startDate: data.startDate,
        };

        if (data.useDurationRange) {
            payload.durationRange = {
                minDays: Number(data.minDays),
                maxDays: Number(data.maxDays),
            };
        } else {
            payload.durationDays = data.durationDays ? Number(data.durationDays) : undefined;
        }

        if (propertyImages.length > 0 || propertyDocuments.length > 0) {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description);
            formData.append('property.type', payload.property.type);
            if (payload.property.name) formData.append('property.name', payload.property.name);
            formData.append('property.address.street', payload.property.address.street);
            formData.append('property.address.city', payload.property.address.city);
            formData.append('property.address.state', payload.property.address.state);
            formData.append('property.address.zipcode', payload.property.address.zipcode);
            formData.append('property.address.country', payload.property.address.country);
            if (payload.property.ownershipType) formData.append('property.ownershipType', payload.property.ownershipType);
            if (payload.property.sizeSqFt) formData.append('property.sizeSqFt', payload.property.sizeSqFt.toString());
            if (payload.property.ownerName) formData.append('property.ownerName', payload.property.ownerName);
            formData.append('minBudget', payload.minBudget.toString());
            formData.append('maxBudget', payload.maxBudget.toString());
            if (payload.startDate) formData.append('startDate', payload.startDate);
            if (payload.durationDays) formData.append('durationDays', payload.durationDays.toString());
            if (payload.durationRange) {
                formData.append('durationRange.minDays', payload.durationRange.minDays.toString());
                formData.append('durationRange.maxDays', payload.durationRange.maxDays.toString());
            }
            propertyImages.forEach(image => {
                formData.append('propertyImages', image);
            });
            propertyDocuments.forEach(doc => {
                formData.append('propertyDocuments', doc);
            });

            createProject.mutate(formData as unknown as CreateProjectDto, {
                onSuccess: () => {
                    navigate('/projects');
                },
            });
        } else {
            createProject.mutate(payload, {
                onSuccess: () => {
                    navigate('/projects');
                },
            });
        }
    };

    return (
        <>
            <PageBackButton
                text='Back to Projects'
                onClick={() => navigate('/projects')}
            />
            <PageHeader
                title="Create New Project"
                description="Let's get your construction project started"
            />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            1
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Property Details</p>
                            <p className="text-xs">Basic information & images</p>
                        </div>
                    </div>
                </div>

                <div className="h-px flex-1 mx-4 bg-secondary" />

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            2
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Project Scope</p>
                            <p className="text-xs">Timeline, budget & documents</p>
                        </div>
                    </div>
                </div>

                <div className="h-px flex-1 mx-4 bg-secondary" />

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            3
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Review & Submit</p>
                            <p className="text-xs">Confirm details</p>
                        </div>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <div className="backdrop-blur-sm rounded-2xl p-8 border">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Property Information</h2>
                                <p className="text-muted-foreground">Tell us about the property where the project will take place</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="propertyType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Type <span className='text-destructive'>*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select property type" />
                                                        </SelectTrigger>
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
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="propertyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter property name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter street address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter city" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter state" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="zipcode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zipcode <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter zipcode" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter country" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="ownershipType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ownership Type <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Select ownership type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {OWNERSHIP_TYPES.map(type => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="propertySize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Size (sq ft)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 2,500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="propertyOwnerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Owner Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter owner name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormLabel className="mb-2 block">Property Images</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-4">Upload photos of the property and areas where work will be done</p>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => imageInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer hover:border-primary"
                                    >
                                        <ImagePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="font-medium mb-1">Click to upload images</p>
                                        <p className="text-sm text-muted-foreground">PNG, JPG, HEIC up to 10MB each</p>
                                    </div>
                                    {propertyImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            {propertyImages.map((file, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <p className="text-xs mt-1 truncate">{file.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <FormLabel className="mb-2 block">Property Documents</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-4">Upload relevant property documents</p>
                                    <input
                                        ref={documentInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        multiple
                                        onChange={handleDocumentUpload}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => documentInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer hover:border-primary"
                                    >
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="font-medium mb-1">Click to upload documents</p>
                                        <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 10MB each</p>
                                    </div>
                                    {propertyDocuments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {propertyDocuments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                                        <span className="text-sm">{file.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(index)}
                                                        className="text-destructive hover:text-destructive/80"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type="button" onClick={() => handleNextStep(2)}>
                                    Next Step
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="backdrop-blur-sm rounded-2xl p-8 border">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Project Scope</h2>
                                <p className="text-muted-foreground">Define the project details, timeline, and budget</p>
                            </div>

                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Title <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter project title" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Description <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Describe the project scope and requirements" rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="minBudget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Minimum Budget ($) <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 50000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="maxBudget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Maximum Budget ($) <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 75000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="useDurationRange"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <FormLabel>Use Duration Range</FormLabel>
                                                <p className="text-sm text-muted-foreground">Toggle to specify a range instead of fixed duration</p>
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
                                        name="durationDays"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duration (Days)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 90" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="minDays"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Minimum Days</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" placeholder="e.g., 60" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="maxDays"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Maximum Days</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" placeholder="e.g., 120" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <div className='flex gap-4 items-center'>
                                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                        Previous Step
                                    </Button>
                                    <Button type="button" onClick={() => handleNextStep(3)}>
                                        Next Step
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="backdrop-blur-sm rounded-2xl p-8 border">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                                <p className="text-muted-foreground">Review your project details before submission</p>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-3">Property Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">Type:</span> {form.getValues('propertyType') ? form.getValues('propertyType').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Name:</span> {form.getValues('propertyName') || 'N/A'}</div>
                                        <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {form.getValues('street')}, {form.getValues('city')}, {form.getValues('state')} {form.getValues('zipcode')}, {form.getValues('country')}</div>
                                        <div><span className="text-muted-foreground">Ownership:</span> {form.getValues('ownershipType') ? form.getValues('ownershipType')?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : user?.role === 'user' ? 'Owner' : 'Tenant'}</div>
                                        <div><span className="text-muted-foreground">Size:</span> {form.getValues('propertySize') ? `${form.getValues('propertySize')} sq ft` : 'N/A'}</div>
                                        <div className="col-span-2"><span className="text-muted-foreground">Owner:</span> {form.getValues('propertyOwnerName') ? form.getValues('propertyOwnerName') : `${user?.firstName} ${user?.lastName}`}</div>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-3">Project Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-muted-foreground">Title:</span> {form.getValues('title')}</div>
                                        <div><span className="text-muted-foreground">Description:</span> {form.getValues('description')}</div>
                                        <div><span className="text-muted-foreground">Budget:</span> ${form.getValues('minBudget')} - ${form.getValues('maxBudget')}</div>
                                        <div><span className="text-muted-foreground">Start Date:</span> {form.getValues('startDate') || 'Not specified'}</div>
                                        <div>
                                            <span className="text-muted-foreground">Duration:</span>{' '}
                                            {form.getValues('useDurationRange')
                                                ? `${form.getValues('minDays')} - ${form.getValues('maxDays')} days`
                                                : form.getValues('durationDays') ? `${form.getValues('durationDays')} days` : 'Not specified'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <div className='flex gap-4 items-center'>
                                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                        Previous Step
                                    </Button>
                                    <Button type="submit" disabled={createProject.isPending}>
                                        {createProject.isPending ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </>
    );
};

export default CreateProject;
