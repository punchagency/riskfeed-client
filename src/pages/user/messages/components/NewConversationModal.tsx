import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderOpen, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { IProject } from '@/interfaces/project/project.interface';

interface NewConversationModalProps {
    open: boolean;
    onClose: () => void;
    projects: IProject[];
    isLoadingProjects: boolean;
    onCreateConversation: (projectIds: string[]) => void;
    isCreating: boolean;
}

const formatProjectType = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const NewConversationModal = ({
    open,
    onClose,
    projects,
    isLoadingProjects,
    onCreateConversation,
    isCreating,
}: NewConversationModalProps) => {
    const [search, setSearch] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const eligibleProjects = projects.filter((p) => !!p.selectedContractor);

    const filtered = eligibleProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.projectType.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        if (!selectedProjectId) return;
        onCreateConversation([selectedProjectId]);
    };

    const handleClose = () => {
        setSearch('');
        setSelectedProjectId(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>New Group Message</DialogTitle>
                    <DialogDescription>
                        Select a project to start a conversation with its contractors.
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Project List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {isLoadingProjects ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                            <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
                            <div>
                                <p className="text-sm font-medium">No projects found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {eligibleProjects.length === 0
                                        ? 'You need a project with an invited or assigned contractor to start a conversation.'
                                        : 'No projects match your search.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filtered.map((project) => {
                                const isSelected = selectedProjectId === project._id;
                                const address = project.property?.address
                                    ? `${project.property.address.city}, ${project.property.address.state}`
                                    : null;
                                const contractorCount = (project?.acceptedProposal ? 1 : 0);

                                return (
                                    <motion.button
                                        key={project._id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => setSelectedProjectId(isSelected ? null : project._id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                                            isSelected
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/50'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                            )}
                                        >
                                            {project.title.slice(0, 2).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className='flex items-center justify-between'>
                                                <p className="font-semibold text-sm truncate">{project.title}</p>
                                                <Badge variant="default" className="text-[10px] h-4 px-1.5 border-0">
                                                    {formatProjectType(project.projectType)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">

                                                {address && (
                                                    <span className="text-[11px] text-muted-foreground truncate">
                                                        📍 {address}
                                                    </span>
                                                )}
                                            </div>
                                            {contractorCount > 0 && (
                                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                                    {contractorCount} contractor{contractorCount > 1 ? 's' : ''} involved
                                                </p>
                                            )}
                                        </div>

                                        <ChevronRight
                                            className={cn(
                                                'h-4 w-4 shrink-0 transition-colors',
                                                isSelected ? 'text-primary' : 'text-muted-foreground'
                                            )}
                                        />
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                    <Button variant="outline" onClick={handleClose} size="sm" disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate} size="sm" 
                        disabled={!selectedProjectId || isCreating}
                    >
                        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Start Conversation
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewConversationModal;
