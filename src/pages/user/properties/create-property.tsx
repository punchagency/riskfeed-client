import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageBackButton } from '@/components/page-back-button';
import { PageHeader } from '@/components/page-header';
import { useCreateProperty } from '@/hooks/use-properties';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CreatePropertyDto } from '@/interfaces/properties/dto/create-property.dto';
import { PROPERTIES_TYPES, PROPERTY_STATUS } from '@/interfaces/properties/properties.interface';
import { ImagePlus, X } from 'lucide-react';

const propertySchema = z.object({
    name: z.string().min(1, 'Property name is required'),
    propertyType: z.string().min(1, 'Property type is required'),
    status: z.string().optional(),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    purchaseDate: z.string().optional(),
    purchasePrice: z.string().optional(),
    estimatedValue: z.string().optional(),
    currentEstimatedValue: z.string().optional(),
    annualPropertyTax: z.string().optional(),
    annualInsurance: z.string().optional(),
    annualMaintenanceCosts: z.string().optional(),
    squareFeet: z.string().optional(),
    yearBuilt: z.string().optional(),
    noOfBedrooms: z.string().optional(),
    noOfBathrooms: z.string().optional(),
    lotSize: z.string().optional(),
    notes: z.string().optional(),
});

const CreateProperty = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const createProperty = useCreateProperty();
    const [propertyImages, setPropertyImages] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            propertyType: '',
            status: 'active',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            purchaseDate: '',
            purchasePrice: '',
            estimatedValue: '',
            currentEstimatedValue: '',
            annualPropertyTax: '',
            annualInsurance: '',
            annualMaintenanceCosts: '',
            squareFeet: '',
            yearBuilt: '',
            noOfBedrooms: '',
            noOfBathrooms: '',
            lotSize: '',
            notes: '',
        },
    });

    const validateStep = async (currentStep: number) => {
        let fieldsToValidate: (keyof z.infer<typeof propertySchema>)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['name', 'propertyType', 'street', 'city', 'state', 'zipCode', 'country'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['purchasePrice', 'purchaseDate'];
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

    const onSubmit = (data: z.infer<typeof propertySchema>) => {
        const payload: CreatePropertyDto = {
            name: data.name,
            propertyType: data.propertyType as typeof PROPERTIES_TYPES[number],
            status: data.status as typeof PROPERTY_STATUS[number],
            address: {
                street: data.street,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
            },
            purchaseDate: data.purchaseDate ? data.purchaseDate : undefined,
            purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
            estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : undefined,
            currentEstimatedValue: data.currentEstimatedValue ? Number(data.currentEstimatedValue) : undefined,
            annualPropertyTax: data.annualPropertyTax ? Number(data.annualPropertyTax) : undefined,
            annualInsurance: data.annualInsurance ? Number(data.annualInsurance) : undefined,
            annualMaintenanceCosts: data.annualMaintenanceCosts ? Number(data.annualMaintenanceCosts) : undefined,
            squareFeet: data.squareFeet ? Number(data.squareFeet) : undefined,
            yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
            noOfBedrooms: data.noOfBedrooms ? Number(data.noOfBedrooms) : undefined,
            noOfBathrooms: data.noOfBathrooms ? Number(data.noOfBathrooms) : undefined,
            lotSize: data.lotSize ? data.lotSize : undefined,
            notes: data.notes ? data.notes : undefined,
        };

        if (propertyImages.length > 0) {
            const formData = new FormData();
            formData.append('name', payload.name);
            formData.append('propertyType', payload.propertyType);
            if (payload.status) formData.append('status', payload.status);
            formData.append('address.street', payload.address.street);
            formData.append('address.city', payload.address.city);
            formData.append('address.state', payload.address.state);
            formData.append('address.zipCode', payload.address.zipCode);
            formData.append('address.country', payload.address.country);
            if (payload.purchaseDate) formData.append('purchaseDate', payload.purchaseDate);
            if (payload.purchasePrice) formData.append('purchasePrice', payload.purchasePrice.toString());
            if (payload.estimatedValue) formData.append('estimatedValue', payload.estimatedValue.toString());
            if (payload.currentEstimatedValue) formData.append('currentEstimatedValue', payload.currentEstimatedValue.toString());
            if (payload.annualPropertyTax) formData.append('annualPropertyTax', payload.annualPropertyTax.toString());
            if (payload.annualInsurance) formData.append('annualInsurance', payload.annualInsurance.toString());
            if (payload.annualMaintenanceCosts) formData.append('annualMaintenanceCosts', payload.annualMaintenanceCosts.toString());
            if (payload.squareFeet) formData.append('squareFeet', payload.squareFeet.toString());
            if (payload.yearBuilt) formData.append('yearBuilt', payload.yearBuilt.toString());
            if (payload.noOfBedrooms) formData.append('noOfBedrooms', payload.noOfBedrooms.toString());
            if (payload.noOfBathrooms) formData.append('noOfBathrooms', payload.noOfBathrooms.toString());
            if (payload.lotSize) formData.append('lotSize', payload.lotSize);
            if (payload.notes) formData.append('notes', payload.notes);
            propertyImages.forEach(image => {
                formData.append('propertyImages', image);
            });

            createProperty.mutate(formData as unknown as CreatePropertyDto, {
                onSuccess: () => {
                    navigate('/properties');
                },
            });
        } else {
            createProperty.mutate(payload, {
                onSuccess: () => {
                    navigate('/properties');
                },
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPropertyImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setPropertyImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <PageBackButton
                text='Back to Properties'
                onClick={() => navigate('/properties')}
            />
            <PageHeader
                title="Add New Property"
                description="Add a property to your portfolio and start managing it with AI-powered insights"
            />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            1
                        </div>
                        <div>
                            <p className="text-sm text-foreground font-semibold">Basic Information</p>
                            <p className="text-xs">Property name, type, and location</p>
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
                            <p className="text-sm text-foreground font-semibold">Financial Details</p>
                            <p className="text-xs">Purchase price, taxes, and expenses</p>
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
                            <p className="text-sm text-foreground font-semibold">Property Details</p>
                            <p className="text-xs">Size, rooms, and features</p>
                        </div>
                    </div>
                </div>
                <div className="h-px flex-1 mx-4 bg-secondary" />

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            4
                        </div>
                        <div>
                            <p className="text-sm text-foreground font-semibold">Photos & Review</p>
                            <p className="text-xs">Upload images and confirm details</p>
                        </div>
                    </div>
                </div>


            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <div className="backdrop-blur-sm rounded-2xl p-8 border">
                            <div className="mb-6">
                                <h2 className="text-2xl text-foreground font-bold mb-2">Basic Information</h2>
                                <p className="text-muted-foreground">Property name, type, and location</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Name <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter property name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                        {PROPERTIES_TYPES.map(type => (
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
                                </div>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_STATUS.map(status => (
                                                        <SelectItem key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                                        name="zipCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zip Code <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter zip code" />
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
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
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
                                <h2 className="text-2xl text-foreground font-bold mb-2">Financial Details</h2>
                                <p className="text-muted-foreground">Purchase price, taxes, and expenses</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="purchaseDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Purchase Date</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="date" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purchasePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Purchase Price ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 500000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="estimatedValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estimated Value ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 550000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currentEstimatedValue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Estimated Value ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 575000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="annualPropertyTax"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Annual Property Tax ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 8000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="annualInsurance"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Annual Insurance ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 2000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="annualMaintenanceCosts"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Annual Maintenance ($)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 3000" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
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
                                <h2 className="text-2xl text-foreground font-bold mb-2">Property Details</h2>
                                <p className="text-muted-foreground">Size, rooms, and features</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="squareFeet"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Square Feet</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 2500" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="yearBuilt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year Built</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 2010" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="noOfBedrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bedrooms</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 4" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="noOfBathrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bathrooms</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="e.g., 3" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lotSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lot Size</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., 0.25 acres" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Additional notes about the property" rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
                                    Cancel
                                </Button>
                                <div className='flex gap-4 items-center'>
                                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                                        Previous Step
                                    </Button>
                                    <Button type="button" onClick={() => handleNextStep(4)}>
                                        Next Step
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="backdrop-blur-sm rounded-2xl p-8 border">
                            <div className="mb-6">
                                <h2 className="text-2xl text-foreground font-bold mb-2">Photos & Review</h2>
                                <p className="text-muted-foreground">Upload images and review your property details before submission</p>
                            </div>

                            <div className="mb-6">
                                <FormLabel className="mb-2 block">Property Images</FormLabel>
                                <p className="text-sm text-muted-foreground mb-4">Upload photos of the property</p>
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

                            <div className="space-y-6">
                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-3">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">Name:</span> {form.getValues('name')}</div>
                                        <div><span className="text-muted-foreground">Type:</span> {form.getValues('propertyType').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                        <div><span className="text-muted-foreground">Status:</span> {form.getValues('status')?.charAt(0).toUpperCase()}{form.getValues('status')?.slice(1)}</div>
                                        <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {form.getValues('street')}, {form.getValues('city')}, {form.getValues('state')} {form.getValues('zipCode')}, {form.getValues('country')}</div>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-3">Financial Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">Purchase Date:</span> {form.getValues('purchaseDate') || 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Purchase Price:</span> {form.getValues('purchasePrice') ? `$${form.getValues('purchasePrice')}` : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Estimated Value:</span> {form.getValues('estimatedValue') ? `$${form.getValues('estimatedValue')}` : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Current Value:</span> {form.getValues('currentEstimatedValue') ? `$${form.getValues('currentEstimatedValue')}` : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Annual Tax:</span> {form.getValues('annualPropertyTax') ? `$${form.getValues('annualPropertyTax')}` : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Annual Insurance:</span> {form.getValues('annualInsurance') ? `$${form.getValues('annualInsurance')}` : 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Annual Maintenance:</span> {form.getValues('annualMaintenanceCosts') ? `$${form.getValues('annualMaintenanceCosts')}` : 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <h3 className="font-semibold mb-3">Property Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">Square Feet:</span> {form.getValues('squareFeet') || 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Year Built:</span> {form.getValues('yearBuilt') || 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Bedrooms:</span> {form.getValues('noOfBedrooms') || 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Bathrooms:</span> {form.getValues('noOfBathrooms') || 'N/A'}</div>
                                        <div><span className="text-muted-foreground">Lot Size:</span> {form.getValues('lotSize') || 'N/A'}</div>
                                        {form.getValues('notes') && (
                                            <div className="col-span-2"><span className="text-muted-foreground">Notes:</span> {form.getValues('notes')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
                                    Cancel
                                </Button>
                                <div className='flex gap-4 items-center'>
                                    <Button type="button" variant="outline" onClick={() => setStep(3)}>
                                        Previous Step
                                    </Button>
                                    <Button type="submit" disabled={createProperty.isPending}>
                                        {createProperty.isPending ? 'Creating...' : 'Create Property'}
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

export default CreateProperty;