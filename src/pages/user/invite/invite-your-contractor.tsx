import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, Info, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageBackButton } from '@/components/page-back-button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useInviteContractor, useProjectById } from '@/hooks/use-project';
import type { IProject } from '@/interfaces/project/project.interface';

const inviteSchema = z.object({
    contractorEmail: z.string().email('Please enter a valid email address'),
    message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const formatCurrency = (value: number) =>
    `$${value?.toLocaleString()}`;

const ProjectInfoCard = ({ project }: { project: IProject }) => (
    <div className="rounded-lg border p-4 bg-muted/30">
        <p className="font-medium">{project.title}</p>
        <p className="text-sm text-muted-foreground mt-1">
            Budget: {formatCurrency(project.minBudget)} – {formatCurrency(project.maxBudget)}
        </p>
    </div>
);

const InviteYourContractor: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const projectQuery = useProjectById(projectId as string);
    const inviteContractor = useInviteContractor();

    const project = projectQuery.data?.data;

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            contractorEmail: '',
            message: '',
        },
    });

    const onSubmit = (data: InviteFormValues) => {
        if (!projectId) return;

        inviteContractor.mutate(
            {
                id: projectId,
                data: {
                    contractorEmail: data.contractorEmail,
                    message: data.message || undefined,
                },
            },
            {
                onSuccess: () => {
                    navigate(`/projects/${projectId}`);
                },
            }
        );
    };

    return (
        <>
            <PageBackButton text="Back" onClick={() => navigate(-1)} />
            <PageHeader
                title="Invite Your Contractor"
                description="Send an invitation to a contractor you know to bid on your project"
            />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Project Info */}
                {project && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Project Details</p>
                        <ProjectInfoCard project={project} />
                    </div>
                )}

                {/* Invitation Form */}
                <Card>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Contractor Email */}
                                <FormField
                                    control={form.control}
                                    name="contractorEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Contractor Email
                                                <span className="text-destructive"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-4.5 size-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        placeholder="contractor@example.com"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Optional Message */}
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
                                                    placeholder="Add a personal note — mention any specific requirements, preferred timelines, or questions you may have..."
                                                    rows={4}
                                                    className="resize-none min-h-[150px]"
                                                />
                                            </FormControl>
                                            <small className="text-secondary-foreground">
                                                A personal message helps the contractor understand your needs better.
                                            </small>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Info Alert */}
                                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <AlertTitle className="text-blue-900 dark:text-blue-300">
                                        What Happens Next?
                                    </AlertTitle>
                                    <AlertDescription className="text-blue-800 dark:text-blue-300/90 text-sm">
                                        <ul className="list-disc pl-4 space-y-1 mt-2">
                                            <li>The contractor will receive an email invitation to join Riskfeed.</li>
                                            <li>Once they register, they can view your project details and submit a quote.</li>
                                            <li>You'll be notified when they respond to your invitation.</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>

                                {/* Buttons */}
                                <div className="flex justify-between pt-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
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
        </>
    );
};

export default InviteYourContractor;