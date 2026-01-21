/**
 * Utility functions for exporting data to various formats.
 */

/**
 * Converts an array of objects to a CSV string.
 * @param data Array of objects to convert.
 * @param headers Optional array of header names. If not provided, keys of the first object are used.
 * @returns CSV string.
 */
export const convertToCSV = (data: any[], headers?: string[]): string => {
    if (!data || data.length === 0) return '';

    const keys = headers || Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(keys.join(','));

    // Add data rows
    for (const row of data) {
        const values = keys.map(key => {
            const val = row[key];
            // Handle null/undefined
            if (val === null || val === undefined) return '';
            // Escape quotes and wrap in quotes if necessary
            const stringVal = String(val);
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
                return `"${stringVal.replace(/"/g, '""')}"`;
            }
            return stringVal;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

/**
 * Triggers a browser download for a given content string.
 * @param content The string content to download.
 * @param filename The name of the file to save.
 * @param mimeType The MIME type of the content (default: 'text/csv;charset=utf-8;').
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);

    // Append to body, click, and remove
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the URL object
    URL.revokeObjectURL(url);
};

/**
 * Exports data to a CSV file.
 * @param data Array of objects to export.
 * @param filename Name of the file (without extension).
 * @param headers Optional headers to use.
 */
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
    try {
        const csvContent = convertToCSV(data, headers);
        const fullFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
        downloadFile(csvContent, fullFilename);
    } catch (error) {
        console.error('Export failed:', error);
        // Ideally, we would show a toast here, but this is a pure utility.
        // The caller should handle UI feedback if needed, or we can pass a callback.
    }
};
