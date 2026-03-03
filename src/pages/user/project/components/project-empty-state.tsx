import { SearchX, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectEmptyStateProps {
    hasFilters: boolean;
    onClearFilters?: () => void;
    onCreateProject?: () => void;
}

export const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({
    hasFilters,
    onClearFilters,
    onCreateProject,
}) => {
    if (hasFilters) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-muted/50 rounded-full p-6 mb-4">
                    <SearchX className="size-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                    No projects match your search or filter criteria. Try adjusting your filters.
                </p>
                <Button onClick={onClearFilters} variant="outline">
                    Clear Filters
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
                <Briefcase className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Get started by creating your first construction project
            </p>
            <Button onClick={onCreateProject} className="gap-2">
                <Plus className="size-4" />
                Create Project
            </Button>
        </div>
    );
};
