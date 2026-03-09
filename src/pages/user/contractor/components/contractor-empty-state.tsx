import React from 'react';

import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export const ContractorEmptyState: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-5">
                <SearchX className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No contractors found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
                We couldn&apos;t find any contractors matching your criteria. Try adjusting your search or filters.
            </p>
        </motion.div>
    );
};
