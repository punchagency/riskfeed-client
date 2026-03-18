import { cn } from '@/lib/utils';
import { getFileType, getFileName } from '@/lib/attachment-utils';
import { FileText, Download, Music, Video, X } from 'lucide-react';



interface MessageAttachmentProps {
    url: string;
    className?: string;
}

export const MessageAttachment = ({ url, className }: MessageAttachmentProps) => {
    const type = getFileType(url);
    const fileName = getFileName(url);

    if (type === 'image') {
        return (
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={cn("block relative group rounded-lg overflow-hidden border border-border shadow-sm", className)}
            >
                <img 
                    src={url} 
                    alt="attachment" 
                    className="max-w-[200px] sm:max-w-[250px] h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="text-white h-6 w-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                </div>
            </a>
        );
    }

    if (type === 'video') {
        return (
            <div className={cn("rounded-lg overflow-hidden border border-border shadow-sm max-w-[250px] bg-black", className)}>
                <video src={url} controls preload="metadata" className="w-full h-auto max-h-[250px] object-contain" />
            </div>
        );
    }

    if (type === 'audio') {
        return (
            <div className={cn("rounded-lg p-2 border border-border shadow-sm bg-card max-w-[250px] sm:max-w-[300px]", className)}>
                <audio src={url} controls preload="metadata" className="w-full h-10" />
            </div>
        );
    }

    // Fallback for document or unknown generic files
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-border shadow-sm bg-card group hover:bg-accent hover:border-accent-foreground/20 transition-all max-w-[250px] sm:max-w-[300px] overflow-hidden", 
                className
            )}
        >
            <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden w-full">
                <span className="text-sm font-medium truncate text-foreground group-hover:text-accent-foreground transition-colors" title={fileName}>
                    {fileName}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {type === 'unknown' ? 'FILE' : type}
                </span>
            </div>
        </a>
    );
};

interface PendingAttachmentProps {
    url: string;
    onRemove: () => void;
}

export const PendingAttachment = ({ url, onRemove }: PendingAttachmentProps) => {
    const type = getFileType(url);
    const fileName = getFileName(url);
    
    return (
        <div className="relative group shrink-0 animate-in zoom-in-95 duration-200">
            {type === 'image' ? (
                <img 
                    src={url} 
                    alt="pending attachment" 
                    className="h-14 w-14 object-cover rounded-lg border border-border shadow-sm" 
                />
            ) : type === 'video' ? (
                <div className="h-14 w-14 flex flex-col gap-1 items-center justify-center rounded-lg border border-border shadow-sm bg-muted text-muted-foreground">
                    <Video className="h-5 w-5" />
                    <span className="text-[8px] uppercase font-semibold">Video</span>
                </div>
            ) : type === 'audio' ? (
                <div className="h-14 w-14 flex flex-col gap-1 items-center justify-center rounded-lg border border-border shadow-sm bg-muted text-muted-foreground">
                    <Music className="h-5 w-5" />
                    <span className="text-[8px] uppercase font-semibold">Audio</span>
                </div>
            ) : (
                <div className="h-14 px-3 py-1 flex flex-col justify-center rounded-lg border border-border shadow-sm bg-muted max-w-[140px]">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground truncate" title={fileName}>
                            {fileName}
                        </span>
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                aria-label="Remove attachment"
            >
                <X className="h-3 w-3" />
            </button>
        </div>
    );
};
