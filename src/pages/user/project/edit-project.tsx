import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';

import { useProjectById, useUpdateProject } from '@/hooks/use-project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/page-header';
import { PageBackButton } from '@/components/page-back-button';
import { PROJECT_TYPES } from '@/interfaces/project/project.interface';
import type { UpdateProjectDto } from '@/interfaces/project/dto/update-project.dto';
import type { IProject } from '@/interfaces/project/project.interface';

const editProjectSchema = z.object({
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(1, 'Description is required'),
    projectType: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: 'Project type is required' }) }),
    minBudget: z.string().min(1, 'Minimum budget is required'),
    maxBudget: z.string().min(1, 'Maximum budget is required'),
    useDurationRange: z.boolean(),
    durationDays: z.string().optional(),
    minDays: z.string().optional(),
    maxDays: z.string().optional(),
    startDate: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.useDurationRange) {
        if (!data.minDays) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Minimum days is required', path: ['minDays'] });
        }
        if (!data.maxDays) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Maximum days is required', path: ['maxDays'] });
        }
        if (data.minDays && data.maxDays && Number(data.minDays) > Number(data.maxDays)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Min days cannot exceed max days', path: ['minDays'] });
        }
    } else {
        if (!data.durationDays) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duration in days is required', path: ['durationDays'] });
        }
    }

    if (data.minBudget && data.maxBudget && Number(data.minBudget) > Number(data.maxBudget)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Min budget cannot exceed max budget', path: ['minBudget'] });
    }
});

type EditProjectSchema = z.infer<typeof editProjectSchema>;

const EditProject: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const projectQuery = useProjectById(projectId as string);
    const updateProject = useUpdateProject();

    const project: IProject = projectQuery?.data?.data;

    const form = useForm<EditProjectSchema>({
        resolver: zodResolver(editProjectSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            projectType: project ? project.projectType : undefined,
            minBudget: '',
            maxBudget: '',
            useDurationRange: false,
            durationDays: '',
            minDays: '',
            maxDays: '',
            startDate: '',
        },
    });

    useEffect(() => {
        if (project) {
            form.reset({
                title: project.title || '',
                description: project.description || '',
                projectType: project.projectType,
                minBudget: project.minBudget?.toString() || '',
                maxBudget: project.maxBudget?.toString() || '',
                useDurationRange: !!project.durationRange,
                durationDays: project.durationDays?.toString() || '',
                minDays: project.durationRange?.minDays?.toString() || '',
                maxDays: project.durationRange?.maxDays?.toString() || '',
                startDate: project.startDate
                    ? new Date(project.startDate).toISOString().split('T')[0]
                    : '',
            });
        }
    }, [project, form]);

    const useDurationRange = useWatch({ control: form.control, name: 'useDurationRange' });
    const projectTypeValue = useWatch({ control: form.control, name: 'projectType' });

    const onSubmit = (data: EditProjectSchema) => {
        const payload: UpdateProjectDto = {
            title: data.title,
            description: data.description,
            projectType: data.projectType,
            status: project?.status || 'draft',
            minBudget: Number(data.minBudget),
            maxBudget: Number(data.maxBudget),
            startDate: data.startDate ? new Date(data.startDate) : undefined,
        };

        if (data.useDurationRange) {
            payload.durationRange = {
                minDays: Number(data.minDays),
                maxDays: Number(data.maxDays),
            };
            payload.durationDays = undefined;
        } else {
            payload.durationDays = data.durationDays ? Number(data.durationDays) : undefined;
            payload.durationRange = undefined;
        }

        updateProject.mutate(
            { id: projectId as string, data: payload },
            { onSuccess: () => navigate(`/projects/${projectId}`) },
        );
    };


    return (
        <>
            <PageBackButton
                text="Back to Project"
                onClick={() => navigate(`/projects/${projectId}`)}
            />
            <PageHeader
                title="Edit Project"
                description="Update your project details"
            />
            {projectQuery.isLoading ? (
                <>
                    <Skeleton className="h-4 w-24 mb-6" />
                    <Skeleton className="h-10 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-8" />
                    <div className="backdrop-blur-sm rounded-2xl p-8 border space-y-6">
                        <Skeleton className="h-8 w-1/4 mb-2" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-14 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full" />
                        <div className="flex justify-between pt-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="backdrop-blur-sm rounded-2xl p-8 border">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Project Details</h2>
                                    <p className="text-muted-foreground">Update the details, timeline, and budget for your project</p>
                                </div>

                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project Title <span className="text-destructive">*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter project title" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="projectType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Project Type <span className="text-destructive">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={projectTypeValue || ''}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select project type">
                                                                {projectTypeValue
                                                                    ? projectTypeValue.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                                                    : ''}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {PROJECT_TYPES.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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
                                                <FormLabel>Project Description <span className="text-destructive">*</span></FormLabel>
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
                                                    <FormLabel>Minimum Budget ($) <span className="text-destructive">*</span></FormLabel>
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
                                                    <FormLabel>Maximum Budget ($) <span className="text-destructive">*</span></FormLabel>
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
                                                    <FormLabel>Duration (Days) <span className="text-destructive">*</span></FormLabel>
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
                                                        <FormLabel>Minimum Days <span className="text-destructive">*</span></FormLabel>
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
                                                        <FormLabel>Maximum Days <span className="text-destructive">*</span></FormLabel>
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

                                <div className="flex justify-between pt-8">
                                    <Button type="button" variant="outline" onClick={() => navigate(`/projects/${projectId}`)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={updateProject.isPending}>
                                        {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
};

export default EditProject;
