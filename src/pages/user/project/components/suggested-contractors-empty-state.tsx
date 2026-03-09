import { UserSearch } from "lucide-react";

export const SuggestedContractorsEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-lg bg-card/50">
            <div className="bg-muted/50 rounded-full p-4 mb-4">
                <UserSearch className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No matches found</h3>
            <p className="text-sm text-muted-foreground max-w-xl text-center">
                We couldn't find any contractors matching your specific project requirements at this time. Try updating your project details or broadening your search parameters.
            </p>
        </div>
    );
};
