export const getFileType = (url: string) => {
    try {
        const cleanUrl = url.split('?')[0];
        const ext = cleanUrl.split('.').pop()?.toLowerCase() || '';

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'].includes(ext)) return 'document';
        
        return 'unknown';
    } catch {
        return 'unknown';
    }
};

export const getFileName = (url: string) => {
    try {
        const cleanUrl = url.split('?')[0];
        const parts = cleanUrl.split('/');
        let name = parts.pop() || 'Attachment';
        
        // Truncate if the name is unexpectedly long (e.g. AWS S3 hash names)
        if (name.length > 40) {
            name = name.slice(0, 25) + '...' + name.slice(-10);
        }
        
        // Decode URL to string (e.g. %20 -> space)
        return decodeURIComponent(name);
    } catch {
        return 'Attachment';
    }
};
