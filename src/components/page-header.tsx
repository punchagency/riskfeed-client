import { Button } from './ui/button'
import { type LucideIcon } from 'lucide-react'
import type { IconType } from 'react-icons';

interface PageHeaderProps {
    title: string;
    description?: string;
    onAction?: () => void;
    actionText?: string;
    ActionIcon?: LucideIcon | IconType
}

export const PageHeader = ({ title, description, onAction, ActionIcon, actionText }: PageHeaderProps) => {
    return (
        <div className='flex items-center justify-between mb-8'>
            <div className=''>
                <h1 className='font-semibold text-[36px] text-gray-900 dark:text-white mb-0'>{title}</h1>
                {description && <p className='font-normal text-[16px] text-gray-500 dark:text-gray-400'>{description}</p>}
            </div>
            {onAction &&
                <Button className='h-11.5'
                    onClick={onAction}
                >
                    {ActionIcon && <ActionIcon className='mr-2 h-4 w-4' />}
                    {actionText}
                </Button>
            }
        </div>
    )
}
