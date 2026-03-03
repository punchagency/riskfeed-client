import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

interface AppPaginationProps {
    page: number;
    pages: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
}

export const AppPagination: React.FC<AppPaginationProps> = ({ page, pages, limit, total, onPageChange }) => {
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const getPageNumbers = () => {
        const items: (number | 'ellipsis')[] = [];
        
        if (pages <= 7) {
            for (let i = 1; i <= pages; i++) items.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) items.push(i);
                items.push('ellipsis', pages);
            } else if (page >= pages - 3) {
                items.push(1, 'ellipsis');
                for (let i = pages - 4; i <= pages; i++) items.push(i);
            } else {
                items.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pages);
            }
        }
        return items;
    };

    return (
        <div className="flex flex-col items-center justify-between my-8">
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span> results
            </p>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => page > 1 && onPageChange(page - 1)}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    {getPageNumbers().map((item, idx) => (
                        <PaginationItem key={idx}>
                            {item === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(item)}
                                    isActive={page === item}
                                    className="cursor-pointer"
                                >
                                    {item}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => page < pages && onPageChange(page + 1)}
                            className={page === pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
