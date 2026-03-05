import { Building2, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioValue {
    total: number;
    progression: Array<{ date: string; value: number }>;
}

interface PropertySummary {
    totalProperties: number;
    activeProjectsCount: number;
}

interface DistributionByType {
    type: string;
    count: number;
    value: number;
}

interface FinancialHealth {
    totalAnnualCosts: number;
    totalEquity: number;
}

interface PropertiesAnalyticsData {
    portfolioValue: PortfolioValue;
    propertySummary: PropertySummary;
    distributionByType: DistributionByType[];
    financialHealth: FinancialHealth;
}

interface PropertiesAnalyticsProps {
    data?: PropertiesAnalyticsData;
    isLoading?: boolean;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const getPropertyTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const PropertiesAnalytics: React.FC<PropertiesAnalyticsProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4">
                        <Skeleton className="h-4 w-24 mb-4" />
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const { portfolioValue, propertySummary, distributionByType, financialHealth } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Portfolio Value */}
            <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <TrendingUp className="size-4" />
                    <span className="text-sm font-medium">Portfolio Value</span>
                </div>
                <p className="text-xl font-semibold text-primary-foreground mb-1">
                    {formatCurrency(portfolioValue.total)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {propertySummary.totalProperties} {propertySummary.totalProperties === 1 ? 'property' : 'properties'}
                </p>
            </Card>

            {/* Property Summary */}
            <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Building2 className="size-4" />
                    <span className="text-sm font-medium">Properties</span>
                </div>
                <p className="text-xl font-semibold text-primary-foreground mb-1">
                    {propertySummary.totalProperties}
                </p>
                <p className="text-xs text-muted-foreground">
                    {propertySummary.activeProjectsCount} active {propertySummary.activeProjectsCount === 1 ? 'project' : 'projects'}
                </p>
            </Card>

            {/* Distribution by Type */}
            <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <PieChart className="size-4" />
                    <span className="text-sm font-medium">Property Types</span>
                </div>
                <div className="space-y-2">
                    {distributionByType.slice(0, 2).map((dist, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-primary-foreground">{getPropertyTypeLabel(dist.type)}</span>
                            <span className="text-sm font-semibold text-primary-foreground">{dist.count}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Financial Health */}
            <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <DollarSign className="size-4" />
                    <span className="text-sm font-medium">Total Equity</span>
                </div>
                <p className="text-xl font-semibold text-primary-foreground mb-1">
                    {formatCurrency(financialHealth.totalEquity)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatCurrency(financialHealth.totalAnnualCosts)}/year costs
                </p>
            </Card>
        </div>
    );
};
