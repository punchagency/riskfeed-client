import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Star, Briefcase, Building2, Send, Info, Plus } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/page-header';
import { PageBackButton } from '@/components/page-back-button';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGetContractorById } from '@/hooks/use-contractor';
import { useInviteContractor, useProjects } from '@/hooks/use-project';
import type { IProject } from '@/interfaces/project/project.interface';
import type { IContractor } from '@/interfaces/user/user.interface';
import { getYearsFromNow } from '@/utils/getYearsfromNow';

const inviteSchema = z.object({
    projectId: z.string().min(1, 'Please select a project'),
    message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const formatCurrency = (value: number) =>
    `$${value?.toLocaleString()}`;

const getInitials = (name: string) =>
    name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

const formatSpecialty = (service: string) =>
    service.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const ContractorProfileCard = ({ contractor }: { contractor: IContractor }) => (
    <Card className="border-primary/20 bg-primary/5 p-0">
        <CardContent className="p-5">
            <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-semibold text-lg">
                        {getInitials(contractor.companyName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex justify-between items-start flex-1 min-w-0">
                    <div>
                        <h3 className="font-semibold text-lg truncate">
                            {contractor.companyName}
                        </h3>
                        {contractor.services?.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {formatSpecialty(contractor.services[0])}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {contractor.ratings && (
                            <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium">
                                    {contractor.ratings.averageRatings.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground">
                                    ({contractor.ratings.totalRatings})
                                </span>
                            </div>
                        )}
                        {contractor.completedProjects !== undefined && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Briefcase className="h-4 w-4" />
                                <span>{contractor.completedProjects} completed</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{getYearsFromNow(contractor.yearEstablished)} yrs in business</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ProjectInfoCard = ({ project }: { project: IProject }) => (
    <div className="rounded-lg border p-4 bg-muted/30">
        <p className="font-medium">{project.title}</p>
        <p className="text-sm text-muted-foreground mt-1">
            Budget: {formatCurrency(project.minBudget)} – {formatCurrency(project.maxBudget)}
        </p>
    </div>
);

const InviteSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4 p-5 border rounded-xl">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex gap-4 mt-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        </div>
        <div className="space-y-3 border rounded-xl p-6">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-1/4 mt-4" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-10 w-full" />
    </div>
);

const Invite: React.FC = () => {
    const { contractorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const projectFromState: IProject | null = location.state?.project ?? null;

    const contractorQuery = useGetContractorById(contractorId as string);
    const projectsQuery = useProjects({ page: 1, limit: 100 });
    const inviteContractor = useInviteContractor();

    const contractor: IContractor | undefined = contractorQuery.data?.data;

    const [hasProjectFromState] = useState(!!projectFromState);

    const availableProjects: IProject[] = useMemo(() => {
        if (hasProjectFromState) return [];
        const items: IProject[] = projectsQuery.data?.data?.items || [];
        return items.filter(
            (p) => p.status === 'published' || p.status === 'in_progress'
        );
    }, [projectsQuery.data, hasProjectFromState]);

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            projectId: projectFromState?._id || '',
            message: '',
        },
    });

    const onSubmit = (data: InviteFormValues) => {
        inviteContractor.mutate(
            {
                id: data.projectId,
                data: {
                    contractorId: contractorId as string,
                    message: data.message || undefined,
                },
            },
            {
                onSuccess: () => {
                    navigate('/contractors');
                },
            }
        );
    };

    return (
        <>
            <PageBackButton
                text="Back"
                onClick={() => navigate(-1)}
            />
            <PageHeader
                title="Invite Contractor to Project"
                description={
                    contractor
                        ? `Send an invitation to ${contractor.companyName} to bid on your project`
                        : 'Send an invitation to bid on your project'
                }
            />

            {contractorQuery.isLoading ? (
                <InviteSkeleton />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Contractor profile card */}
                    {contractor && <ContractorProfileCard contractor={contractor} />}

                    {/* Invitation form */}
                    <Card>
                        <CardContent className="p-6">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    {/* Project selection */}
                                    {hasProjectFromState && projectFromState ? (
                                        <div>
                                            <p className="text-sm font-medium mb-2">
                                                Project
                                            </p>
                                            <ProjectInfoCard
                                                project={projectFromState}
                                            />
                                        </div>
                                    ) : (
                                        <FormField
                                            control={form.control}
                                            name="projectId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Select Project{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(val) => {
                                                            if (val === 'CREATE_NEW') {
                                                                navigate(
                                                                    '/projects/create',
                                                                    {
                                                                        state: {
                                                                            returnTo: `/contractors/invite/${contractorId}`,
                                                                        },
                                                                    }
                                                                );
                                                            } else {
                                                                field.onChange(val);
                                                            }
                                                        }}
                                                        value={field.value || undefined}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Choose a project to invite for" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {availableProjects.length ===
                                                                0 && (
                                                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                                                        No eligible projects
                                                                        found
                                                                    </div>
                                                                )}
                                                            {availableProjects.map(
                                                                (project) => (
                                                                    <SelectItem
                                                                        key={project._id}
                                                                        value={
                                                                            project._id
                                                                        }
                                                                    >
                                                                        {project.title} (
                                                                        {formatCurrency(
                                                                            project.minBudget
                                                                        )}{' '}
                                                                        –{' '}
                                                                        {formatCurrency(
                                                                            project.maxBudget
                                                                        )}
                                                                        )
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                            <div className="h-px bg-muted my-1" />
                                                            <SelectItem
                                                                value="CREATE_NEW"
                                                                className="font-medium text-primary cursor-pointer focus:bg-primary/10"
                                                            >
                                                                <Plus className="inline-block h-4 w-4 mr-1 -mt-0.5" />
                                                                Create new project
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {/* Optional message */}
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Personal Message{' '}
                                                    <span className="text-muted-foreground font-normal">
                                                        (optional)
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Add a personal note for the contractor — mention any specific requirements, preferred timelines, or questions you may have..."
                                                        rows={4}
                                                        className='resize-none min-h-[180px]'
                                                    />
                                                </FormControl>
                                                    <small className='text-secondary-foreground'>A personal message can help contractors understand your needs better and improve response rates.</small>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* What Happens Next alert */}
                                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <AlertTitle className="text-blue-900 dark:text-blue-300">
                                            What Happens Next?
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-800 dark:text-blue-300/90">
                                            <ul className="list-disc pl-4 space-y-1 mt-2 text-sm">
                                                <li>
                                                    The contractor will receive your
                                                    invitation and project details
                                                </li>
                                                <li>
                                                    They'll review your requirements and
                                                    respond within 48 hours
                                                </li>
                                                <li>
                                                    You'll receive a detailed quote and
                                                    timeline proposal
                                                </li>
                                                <li>
                                                    If accepted, the project will be set
                                                    up in escrow for secure payment
                                                </li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>

                                    {/* Submit */}
                                    <div className="flex justify-between pt-2 gap-3">
                                        <Button
                                            type="button"
                                            className='flex-1'
                                            variant="outline"
                                            onClick={() => navigate('/contractors')}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className='flex-1'
                                            disabled={inviteContractor.isPending}
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            {inviteContractor.isPending
                                                ? 'Sending Invitation...'
                                                : 'Send Invitation'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </>
    );
};

export default Invite;
