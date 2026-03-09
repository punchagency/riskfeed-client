import { useState, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useLocation, useNavigate } from 'react-router-dom';
import type { CreateProjectDto } from '@/interfaces/project/dto/create-project.dto';

import { PageHeader } from '@/components/page-header';
import { PageBackButton } from '@/components/page-back-button';
import { useProperties } from '@/hooks/use-properties';
import type { IProperties } from '@/interfaces/properties/properties.interface';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PROJECT_TYPES } from '@/interfaces/project/project.interface';

const projectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(1, 'Description is required'),
    projectType: z.enum(PROJECT_TYPES),
    propertyId: z.string().min(1, 'Please select a property'),
    minBudget: z.string().min(1, 'Minimum budget is required'),
    maxBudget: z.string().min(1, 'Maximum budget is required'),
    useDurationRange: z.boolean(),
    durationDays: z.string().optional(),
    minDays: z.string().optional(),
    maxDays: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
}).superRefine((data, ctx) => {
    if (data.useDurationRange) {
        if (!data.minDays) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Minimum days is required",
                path: ["minDays"],
            });
        }
        if (!data.maxDays) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Maximum days is required",
                path: ["maxDays"],
            });
        }
        if (data.minDays && data.maxDays && Number(data.minDays) > Number(data.maxDays)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Min days cannot exceed max days",
                path: ["minDays"],
            });
        }
    } else {
        if (!data.durationDays) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Duration in days is required",
                path: ["durationDays"],
            });
        }
    }
    
    if (data.minBudget && data.maxBudget && Number(data.minBudget) > Number(data.maxBudget)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Min budget cannot exceed max budget",
            path: ["minBudget"],
        });
    }
});

const CreateProject = () => {

    const [step, setStep] = useState(1);
    const [projectImages, setProjectImages] = useState<File[]>([]);
    const [projectDocuments, setProjectDocuments] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo: string | undefined = location.state?.returnTo;
    const createProject = useCreateProject();
    const properties = useProperties({ page: 1, status: "active", lite: true });

    const propertiesData: IProperties[] = properties.data?.data?.items || [];

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            propertyId: '',
            minBudget: '',
            maxBudget: '',
            useDurationRange: false,
            durationDays: '',
            minDays: '',
            maxDays: '',
            startDate: '',
        },
    });

    const useDurationRange = useWatch({ control: form.control, name: 'useDurationRange' });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProjectImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProjectDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setProjectImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeDocument = (index: number) => {
        setProjectDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = async (currentStep: number) => {
        let fieldsToValidate: (keyof z.infer<typeof projectSchema>)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['propertyId'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['title', 'description', 'projectType', 'minBudget', 'maxBudget', 'startDate'];
            const useRange = form.getValues('useDurationRange');
            if (useRange) {
                fieldsToValidate.push('minDays', 'maxDays');
            } else {
                fieldsToValidate.push('durationDays');
            }
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
            projectType: data.projectType,
            propertyId: data.propertyId,
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

        if (projectImages.length > 0 || projectDocuments.length > 0) {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description);
            formData.append('projectType', payload.projectType);
            formData.append('propertyId', payload.propertyId);
            formData.append('minBudget', payload.minBudget.toString());
            formData.append('maxBudget', payload.maxBudget.toString());
            if (payload.startDate) formData.append('startDate', payload.startDate);
            if (payload.durationDays) formData.append('durationDays', payload.durationDays.toString());
            if (payload.durationRange) {
                formData.append('durationRange.minDays', payload.durationRange.minDays.toString());
                formData.append('durationRange.maxDays', payload.durationRange.maxDays.toString());
            }
            projectImages.forEach(image => {
                formData.append('projectImages', image);
            });
            projectDocuments.forEach(doc => {
                formData.append('projectDocuments', doc);
            });

            createProject.mutate(formData as unknown as CreateProjectDto, {
                onSuccess: () => {
                    navigate(returnTo || '/projects');
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
                onClick={() => navigate(returnTo || '/projects')}
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
                                <FormField
                                    control={form.control}
                                    name="propertyId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Property <span className='text-destructive'>*</span></FormLabel>
                                            <Select
                                                onValueChange={(val) => {
                                                    if (val === 'ADD_NEW') {
                                                        navigate('/properties/create', { state: { returnTo: '/projects/create' } });
                                                    } else {
                                                        field.onChange(val);
                                                    }
                                                }}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select a property" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {propertiesData.length === 0 && (
                                                        <div className="p-2 text-sm text-muted-foreground text-center">No properties found</div>
                                                    )}
                                                    {propertiesData.map(property => (
                                                        <SelectItem key={property._id} value={property._id}>
                                                            {property.name || `Property at ${property.address.street}`}
                                                        </SelectItem>
                                                    ))}
                                                    <div className="h-px bg-muted my-1" />
                                                    <SelectItem value="ADD_NEW" className="font-medium text-primary cursor-pointer focus:bg-primary/10">
                                                        + Add new property
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormLabel className="mb-2 block">Project Images</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-4">Upload relevant photos of the project and areas where work will be done</p>
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
                                    {projectImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            {projectImages.map((file, index) => (
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
                                    <FormLabel className="mb-2 block">Project Documents</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-4">Upload relevant project documents</p>
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
                                    {projectDocuments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {projectDocuments.map((file, index) => (
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
                                    name='projectType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Type <span className='text-destructive'>*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select project type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROJECT_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                                            <FormLabel>Start Date <span className='text-destructive'>*</span></FormLabel>
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
                                                <FormLabel>Duration (Days) <span className='text-destructive'>*</span></FormLabel>
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
                                                    <FormLabel>Minimum Days <span className='text-destructive'>*</span></FormLabel>
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
                                                    <FormLabel>Maximum Days <span className='text-destructive'>*</span></FormLabel>
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
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Property Information</h3>
                                        <Button variant="ghost" className='text-primary'
                                            onClick={() => setStep(1)}
                                        >Edit</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {(() => {
                                            const prop = propertiesData.find(p => p._id === form.getValues('propertyId'));
                                            if (!prop) return <div>No property selected</div>;
                                            return (
                                                <>
                                                    <div><span className="text-muted-foreground">Type:</span> {prop.propertyType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                                    <div><span className="text-muted-foreground">Name:</span> {prop.name || 'N/A'}</div>
                                                    <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {prop.address?.street}, {prop.address?.city}, {prop.address?.state} {prop.address?.zipCode}, {prop.address?.country}</div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Project Details</h3>
                                        <Button variant="ghost" className='text-primary'
                                            onClick={() => setStep(2)}
                                        >Edit</Button>
                                    </div>
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
                                        <div><span className="text-muted-foreground">Project Documents:</span> {projectDocuments.length} uploaded</div>
                                        <div><span className="text-muted-foreground">Project Images:</span> {projectImages.length} uploaded</div>
                                    </div>
                                </div>
                            </div>

                            <Alert className='mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800'>
                                <AlertTitle className='text-blue-900 dark:text-blue-300'>Next Steps: </AlertTitle>
                                <AlertDescription className='text-blue-900 dark:text-blue-300'>
                                    After creating this project, our AI will analyze your requirements and uploaded documents to match you with verified contractors. You'll receive contractor recommendations with detailed proposals within 24 hours. All uploaded documents and images will be securely stored and shared only with approved contractors.
                                </AlertDescription>
                            </Alert>

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
