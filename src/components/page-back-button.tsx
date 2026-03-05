import React from 'react';
import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button';


interface PageBackButtonProps{
    text: string;
    onClick: () => void;
}
export const PageBackButton: React.FC<PageBackButtonProps> = ({text, onClick}) => {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className="flex items-center gap-2"
        >
            <ArrowLeft />
            {text}
        </Button>
    )
}
