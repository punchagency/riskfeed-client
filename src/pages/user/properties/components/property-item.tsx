import { MapPin, Eye, Edit, Trash2, AlertTriangle, Info, FileChartColumn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IProperties, PROPERTIES_TYPES } from '@/interfaces/properties/properties.interface';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { FaPhotoVideo } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface PropertyItemProps {
    property: IProperties & { _id?: string };
    onClick?: () => void;
    onDelete?: (id: string, name: string) => void;
}

const getPropertyTypeLabel = (type: typeof PROPERTIES_TYPES[number]) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return `$${value.toLocaleString()}`;
};

const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const PropertyItem: React.FC<PropertyItemProps> = ({ property, onClick, onDelete }) => {
    const navigate = useNavigate();
    const validImages = property.images?.filter(img => img && img.trim() !== '') || [];
    const activeProject = property?.projects?.filter(project => project.status === 'in_progress')
    const valueChange = property.currentEstimatedValue && property.estimatedValue
        ? ((property.currentEstimatedValue - property.estimatedValue) / property.estimatedValue * 100).toFixed(1)
        : null;

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">

                <div className="relative w-full md:w-80 bg-muted shrink-0">
                    {validImages.length > 0 ? (
                        <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                                {validImages.map((image, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <img
                                            src={image}
                                            alt={`${property.name} - ${index + 1}`}
                                            className="w-full h-full object-fit"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {validImages.length > 1 && (
                                <>
                                    <CarouselPrevious
                                        className="left-3 bg-background/80 hover:bg-background border-border backdrop-blur-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <CarouselNext
                                        className="right-3 bg-background/80 hover:bg-background border-border backdrop-blur-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </>
                            )}
                            {/* Badges */}
                            <div className="absolute top-4 px-3 w-full flex justify-between items-center gap-2">
                                <span className="px-3 py-1 rounded-md text-xs font-medium bg-card/90 text-primary-foreground backdrop-blur-sm border border-border">
                                    {getPropertyTypeLabel(property.propertyType)}
                                </span>
                                {activeProject && activeProject?.length > 0 && (
                                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground backdrop-blur-sm">
                                        {activeProject?.length} Active Project
                                    </span>
                                )}
                            </div>
                        </Carousel>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-muted">
                            <div className="text-center">
                                <FaPhotoVideo className="size-16 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No images available</p>
                            </div>
                            {/* Badges for no image state */}
                            <div className="absolute top-4 px-3 w-full flex justify-between items-center gap-2">
                                <span className="px-3 py-1 rounded-md text-xs font-medium bg-card text-primary-foreground backdrop-blur-sm border border-border">
                                    {getPropertyTypeLabel(property.propertyType)}
                                </span>
                                {activeProject && activeProject?.length > 0 && (
                                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground backdrop-blur-sm">
                                        {activeProject?.length} Active Project
                                    </span>
                                )}

                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-semibold text-primary-foreground mb-2">{property.name}</h3>
                            <div className="flex items-center gap-1.5 text-primary-foreground mb-1">
                                <MapPin className="size-4" />
                                <span className="text-sm">{property.address.street}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {property.address.city}, {property.address.state} {property.address.zipCode}
                            </p>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                                variant="outline"
                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                aria-label="View property"
                            >
                                <Eye className="size-5 text-muted-foreground" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/properties/update/${property._id}`)
                                }}
                                variant="outline"
                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                aria-label="Edit property"
                            >
                                <Edit className="size-5 text-muted-foreground" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDelete && property._id) {
                                        onDelete(property._id, property.name);
                                    }
                                }}
                                variant="outline"
                                className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                                aria-label="Delete property"
                            >
                                <Trash2 className="size-5 text-destructive" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid - Top Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Est. Value</p>
                            <p className="font-medium text-primary-foreground">
                                {formatCurrency(property.currentEstimatedValue || property.estimatedValue)}
                            </p>
                            {valueChange && (
                                <p className={cn(
                                    'text-xs font-medium mt-0.5',
                                    parseFloat(valueChange) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                )}>
                                    {parseFloat(valueChange) >= 0 ? '↗' : '↘'} {valueChange}%
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
                            <p className="font-medium text-primary-foreground">{formatCurrency(property.purchasePrice)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(property.purchaseDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Size</p>
                            <p className="font-medium text-primary-foreground">
                                {property.squareFeet?.toLocaleString() || 'N/A'} sq ft
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {property.noOfBedrooms || 0} bed, {property.noOfBathrooms || 0} bath
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Projects</p>
                            <p className="font-medium text-primary-foreground">{property.projects?.length || 0} Total</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{activeProject?.length || 0} active</p>
                        </div>
                    </div>


                    <Separator className='my-3' />
                    {/* Stats Grid - Bottom Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pb-6">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Year Built</p>
                            <p className="text-base font-medium text-primary-foreground">{property.yearBuilt || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Property Tax</p>
                            <p className="text-base font-medium text-primary-foreground">{formatCurrency(property.annualPropertyTax)}/year</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Insurance</p>
                            <p className="text-base font-medium text-primary-foreground">{formatCurrency(property.annualInsurance)}/year</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Maintenance</p>
                            <p className="text-base font-medium text-primary-foreground">{formatCurrency(property.annualMaintenanceCosts)}/year</p>
                        </div>
                        <div className="">
                            <p className="text-xs text-muted-foreground mb-1">Documents</p>
                            <div className='flex gap-2'>
                                <FileChartColumn className='size4' />
                                <p className="text-base font-medium text-primary-foreground">{validImages.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert/Info Banner */}
                    {property.notes && (
                        <div className={cn(
                            'mt-4 p-3 rounded-lg flex items-start gap-3',
                            property.notes.toLowerCase().includes('urgent') || property.notes.toLowerCase().includes('expires')
                                ? 'bg-destructive/10 border border-destructive/20'
                                : 'bg-primary/10 border border-primary/20'
                        )}>
                            {property.notes.toLowerCase().includes('urgent') || property.notes.toLowerCase().includes('expires') ? (
                                <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
                            ) : (
                                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                            )}
                            <p className={cn(
                                'text-sm',
                                property.notes.toLowerCase().includes('urgent') || property.notes.toLowerCase().includes('expires')
                                    ? 'text-destructive'
                                    : 'text-primary'
                            )}>
                                {property.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
