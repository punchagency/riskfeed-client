export const parseCSV = (csvText: string): Record<string, string>[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data: Record<string, string>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return data;
};
