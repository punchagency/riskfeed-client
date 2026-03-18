import React from 'react'
import { PageBackButton } from '@/components/page-back-button'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjectById, useSuggestContractors } from '@/hooks/use-project'
import type { IProject } from '@/interfaces/project/project.interface'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Edit, TriangleAlert } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { IContractor } from '@/interfaces/user/user.interface'
import { SuggestedContractorCard } from './components/suggested-contractor-card'
import { SuggestedContractorsEmptyState } from './components/suggested-contractors-empty-state'
import { Button } from '@/components/ui/button'
import { useGetProjectProposals } from '@/hooks/use-proposal'
import type { IProposal } from '@/interfaces/proposal/proposal.interface'
import { ProposalCard } from './components/proposal-card'
import { ProposalsEmptyState } from './components/proposals-empty-state'

const ProjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;

    const projectQuery = useProjectById(id || "")
    const proposals = useGetProjectProposals(id || "")
    const suggestedContractors = useSuggestContractors(id || "")

    const project: IProject = projectQuery?.data?.data
    const proposalsData: IProposal[] = proposals?.data?.data || [];
    const formatBudget = (min: number, max: number) => {
        return `$${min?.toLocaleString()} / $${max?.toLocaleString()}`;
    };

    const acceptedProposal = proposalsData.find((p) => p.status === 'accepted');
    const hasAcceptedProposal = !!acceptedProposal;
    const displayedProposals: IProposal[] = hasAcceptedProposal ? [acceptedProposal as IProposal] : proposalsData;

    const handleInviteContractor = (contractorId: string) => {
        navigate(`/contractors/invite/${contractorId}`, { state: { project } });
    };


    return (
        <>
            <PageBackButton
                text='Back to Projects'
                onClick={() => navigate('/projects')}
            />
            {projectQuery.isLoading ? (
                <>

                    <div className='flex items-center justify-between mb-8'>
                        <div className='w-full'>
                            <Skeleton className="h-10 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>

                    <Card className='p-0 mb-6'>
                        <CardContent className='space-y-3 p-6'>
                            <div>
                                <Skeleton className="h-6 w-1/4 mb-4" />
                                <div className="space-y-2 mb-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>

                            <div>
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-5 w-1/4" />
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <>
                    <div className='flex flex-col md:flex-row items-start justify-between mb-8'>
                        <div className=''>
                            <h1 className='font-semibold text-[36px] text-gray-900 dark:text-white mb-0'>{project?.title || "Project Details"}</h1>
                            <p className='font-normal text-[16px] text-gray-500 dark:text-gray-400'>{project ? `${project?.property?.address.street}, ${project?.property?.address.city}, ${project?.property?.address.state}` : ""}</p>
                            {hasAcceptedProposal ? (
                                <Badge className='mt-1 py-1 px-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'>
                                    <CheckCircle2 className='size-4' />
                                    Contractor Assigned
                                </Badge>
                            ) : project?.status === "published" && (
                                <Badge className='mt-1 py-1 px-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'>
                                    <TriangleAlert className='size-5' />
                                    No Contractor Assigned
                                </Badge>
                            )}
                        </div>
                        <div>
                            <Button onClick={() => navigate(`/projects/${id}/edit`)}>
                                <Edit className='size-5' />
                                Edit Project
                            </Button>
                        </div>
                    </div>

                    <Card className='p-0 mb-6'>
                        <CardContent className='space-y-3 p-6'>
                            <div>
                                <CardTitle className='mb-4 font-semibold'>Project Description</CardTitle>
                                <p className='font-normal text-[15px] text-gray-600 dark:text-gray-400 mb-4'>{project?.description}</p>
                            </div>

                            <div>
                                <p className='text-secondary-foreground text-xs mb-1'>Budget</p>
                                <h3 className='font-semibold'>{formatBudget(project?.minBudget, project?.maxBudget)}</h3>
                            </div>

                        </CardContent>
                    </Card>
                </>
            )}

            <div className='mb-4'>
                <h2 className='font-semibold text-[28px] text-gray-900 dark:text-white mb-2'>
                    {hasAcceptedProposal ? 'Accepted Proposal' : 'Contractors Proposal'}
                </h2>
            </div>

            {proposals.isLoading ? (
                <div className="space-y-4 mb-6">
                    {[1, 2].map((i) => (
                        <Card key={i} className="p-0">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <div className="flex gap-4">
                                        <Skeleton className="size-12 rounded-xl shrink-0" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 items-end flex flex-col">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-7 w-28" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <div className="flex gap-3 pt-4 border-t border-border/50">
                                    <Skeleton className="h-10 flex-1 rounded-md" />
                                    <Skeleton className="h-10 flex-1 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : displayedProposals.length > 0 ? (
                <div className="mb-6">
                    {displayedProposals.map((proposal: IProposal) => (
                        <ProposalCard
                            key={proposal._id}
                            proposal={proposal}
                            onViewProfile={(contractorId) => console.log("View Contractor Profile:", contractorId)}
                        />
                    ))}
                </div>
            ) : (
                <div className="mb-6">
                    <ProposalsEmptyState
                        onInviteContractor={() => navigate(`/projects/${project?._id}/invite-your-contractor`, { state: project })}
                    />
                </div>
            )}


            {!hasAcceptedProposal && (
                <>
                    <div className='mb-4'>
                        <h2 className='font-semibold text-[28px] text-gray-900 dark:text-white mb-2'>Suggested Contractors</h2>
                        <p className='font-normal text-[15px] text-gray-500 dark:text-gray-400'>Based on your project requirements and location, we've found the best matching contractors</p>
                    </div>

                    <div>
                        {suggestedContractors.isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="p-0 overflow-hidden mb-4 border-border/50">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                                                <div className="flex gap-4 items-start w-full">
                                                    <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-6 w-1/3 min-w-32" />
                                                            <Skeleton className="h-5 w-20 rounded-md" />
                                                        </div>
                                                        <Skeleton className="h-4 w-1/4 min-w-24" />
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 space-y-4">
                                                <Skeleton className="h-16 w-full rounded-lg" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-6 w-24 rounded-full" />
                                                    <Skeleton className="h-6 w-32 rounded-full" />
                                                    <Skeleton className="h-6 w-28 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
                                                <Skeleton className="h-10 flex-1 rounded-md" />
                                                <Skeleton className="h-10 flex-1 rounded-md" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : suggestedContractors.data?.data && suggestedContractors.data.data.length === 0 ? (
                            <SuggestedContractorsEmptyState />
                        ) : (
                            <div className="space-y-4">
                                {suggestedContractors?.data?.data?.map((contractorData: { contractor: IContractor, matchPercentage: number, riskFactor: number }) => (
                                    <SuggestedContractorCard
                                        key={contractorData.contractor._id}
                                        contractor={contractorData.contractor}
                                        matchPercentage={Math.round(contractorData.matchPercentage)}
                                        riskFactor={contractorData.riskFactor}
                                        onInvite={handleInviteContractor}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <Button className='w-full h-12 mt-6' onClick={() => navigate(`/projects/${project?._id}/invite-your-contractor`, { state: project })}>Invite Your Own Contractor</Button>
                </>
            )}
        </>
    )
}

export default ProjectDetails