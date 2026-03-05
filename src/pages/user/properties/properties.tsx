import React from 'react';
import { PageHeader } from '@/components/page-header'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import type { GetPropertiesDto } from '@/interfaces/properties/dto/create-property.dto';
import { useDeleteProperty, useProperties, usePropertiesAnalytics } from '@/hooks/use-properties';
import type { IProperties } from '@/interfaces/properties/properties.interface';
import { PropertyItem } from './components/property-item';
import { PropertyItemSkeleton } from './components/property-item-skeleton';
import { PropertiesAnalytics } from './components/properties-analytics';
import { AppPagination } from '@/components/app-pagination';
import ConfirmDelete from '@/components/confirm-delete';

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = React.useState<GetPropertiesDto>({
        page: 1,
        limit: 12,
    });
    const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean; propertyId: string | null; propertyName: string }>({ 
        open: false, 
        propertyId: null,
        propertyName: ''
    });
    
    const properties = useProperties(filters);
    const propertiesAnalytics = usePropertiesAnalytics();
    const deleteProperty = useDeleteProperty();

    const propertiesData: IProperties[] = properties.data?.data?.items || [];
    const pagination = properties.data?.data?.pagination;

    const handleDeleteClick = (propertyId: string, propertyName: string) => {
        setDeleteDialog({ open: true, propertyId, propertyName });
    };

    const handleDeleteConfirm = async () => {
        if (deleteDialog.propertyId) {
            await deleteProperty.mutateAsync(deleteDialog.propertyId);
        }
    };

    return (
        <>
            <PageHeader
                title="My Properties"
                description="Manage your property portfolio and track investments"
                onAction={() => navigate("/properties/create")}
                ActionIcon={Plus}
                actionText="Add Property"
            />

            <PropertiesAnalytics 
                data={propertiesAnalytics.data?.data} 
                isLoading={propertiesAnalytics.isLoading} 
            />

            {properties.isLoading ? (
                <div className="grid grid-cols-1 gap-6 mt-8">
                    {[...Array(4)].map((_, i) => (
                        <PropertyItemSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 mt-8">
                        {propertiesData.map((property: IProperties, index: number) => (
                            <PropertyItem
                                key={index}
                                property={property}
                                onClick={() => navigate(`/properties/${index}`)}
                                onDelete={(id, name) => handleDeleteClick(id, name)}
                            />
                        ))}
                    </div>
                </>
            )}

            {pagination?.pages > 1 && (
                <AppPagination
                    page={pagination.page}
                    pages={pagination.pages}
                    limit={pagination.limit}
                    total={pagination.total}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
            )}

            <ConfirmDelete
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, propertyId: null, propertyName: '' })}
                onConfirm={handleDeleteConfirm}
                title="Delete Property"
                description={`Are you sure you want to delete "${deleteDialog.propertyName}"? This action cannot be undone and will permanently remove this property and all associated data.`}
                isLoading={deleteProperty.isPending}
            />
        </>
    )
}

export default Properties