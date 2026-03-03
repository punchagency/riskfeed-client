import React from "react";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Funnel, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/use-project";
import { PROJECT_RISK_LEVELS, PROJECT_STATUSES, type IProject } from "@/interfaces/project/project.interface";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRiskColor, ProjectItem } from "./components/project-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AppPagination } from "@/components/app-pagination";
import { useReduxAuth } from "@/hooks/use-auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProjectEmptyState } from "./components/project-empty-state";

const Project: React.FC = () => {
    const { user } = useReduxAuth();
    const navigate = useNavigate();
    const [filters, setFilters] = React.useState({
        page: 1,
        limit: 12,
        search: undefined as string | undefined,
        status: undefined as (typeof PROJECT_STATUSES)[number] | undefined,
        riskLevel: undefined as (typeof PROJECT_RISK_LEVELS)[number] | undefined,
        minBudget: undefined as number | undefined,
        maxBudget: undefined as number | undefined,
    });
    const [searchInput, setSearchInput] = React.useState("");
    const projects = useProjects(filters);

    const hasActiveFilters = !!(filters.search || filters.status || filters.riskLevel);

    const handleSearch = React.useCallback((value: string) => {
        setSearchInput(value);
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const clearFilters = () => {
        setFilters({ page: 1, limit: 12, search: undefined, status: undefined, riskLevel: undefined, minBudget: undefined, maxBudget: undefined });
        setSearchInput("");
    };

    return (
        <>
            <PageHeader
                title="Projects"
                description="Manage all your construction projects"
                onAction={() => navigate("/projects/create")}
                ActionIcon={Plus}
                actionText="New Project"
            />
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500" />
                        <Input
                            value={searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-normal text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600"
                            placeholder="Search projects..."
                        />
                        {searchInput && (
                            <button
                                onClick={() => handleSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className={cn(
                            "flex items-center gap-2 px-4 py-3 text-foreground bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors h-12",
                            filters.riskLevel && "border-primary"
                        )}>
                            <Funnel className="size-4" />
                            Risk Level
                            {filters.riskLevel && <span className="ml-1 text-xs">({filters.riskLevel})</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                        <div className="space-y-2">
                            <p className="text-sm font-medium mb-3">Filter by Risk Level</p>
                            {PROJECT_RISK_LEVELS.map((level) => (
                                <Button
                                    key={level}
                                    variant={filters.riskLevel === level ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        filters.riskLevel !== level && getRiskColor(level)
                                    )}
                                    onClick={() => setFilters(prev => ({ ...prev, riskLevel: prev.riskLevel === level ? undefined : level, page: 1 }))}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Tabs value={filters.status || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? undefined : value as typeof PROJECT_STATUSES[number], page: 1 }))}>
                <TabsList className="h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg justify-start overflow-x-auto flex-nowrap">
                    <TabsTrigger className="flex-1 min-w-24" value="all">All</TabsTrigger>
                    {PROJECT_STATUSES.map((status) => (
                        <TabsTrigger key={status} value={status} className="flex-1 min-w-24">{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {projects.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-1" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded" />
                                    <div className="flex-1">
                                        <Skeleton className="h-3 w-12 mb-1" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-4 rounded" />
                                    <div className="flex-1">
                                        <Skeleton className="h-3 w-12 mb-1" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ): projects.data?.data.items?.length === 0 ? (
                <ProjectEmptyState
                    hasFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                    onCreateProject={() => navigate("/projects/create")}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {projects?.data.data.items?.map((project: IProject) => (
                        <ProjectItem
                            key={project._id}
                            project={project}
                            user={user}
                            onClick={() => navigate(`/projects/${project._id}`)}
                        />
                    ))}
                </div>
            )}

            {projects?.data?.data?.pagination?.pages > 1 && (
                <AppPagination
                    page={projects.data.data.pagination.page}
                    pages={projects.data.data.pagination.pages}
                    limit={projects.data.data.pagination.limit}
                    total={projects.data.data.pagination.total}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
            )}
        </>
    );
};

export default Project;
