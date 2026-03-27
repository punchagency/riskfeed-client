import React, { useRef, useState, useCallback } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AttachmentUploadProps {
    files: File[]
    onChange: (files: File[]) => void
    maxFiles?: number
    disabled?: boolean
    className?: string
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
    files,
    onChange,
    maxFiles = 10,
    disabled = false,
    className,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || [])
        if (files.length + newFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files.`)
            return
        }
        onChange([...files, ...newFiles])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index))
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled) return

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (files.length + droppedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files.`)
            return
        }
        onChange([...files, ...droppedFiles])
    }, [files, maxFiles, onChange, disabled])

    return (
        <div className={cn('space-y-3', className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={cn(
                    'group relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer text-center',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30',
                    disabled && 'opacity-60 cursor-not-allowed grayscale'
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    disabled={disabled}
                />
                
                <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                        "p-2.5 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors",
                        isDragging && "bg-primary/10 text-primary"
                    )}>
                        <Upload className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragging ? 'Drop files here' : 'Drop files or click to browse'}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Max {maxFiles} files. PNG, JPG, PDF, TXT supported.
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border group animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <FileText className="size-4 text-muted-foreground shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[12px] font-medium truncate leading-none">
                                        {file.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase mt-1">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile(i)
                                }}
                                disabled={disabled}
                            >
                                <X className="size-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
