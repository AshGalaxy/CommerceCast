
function convertToCsv(rows) {
    return rows.map(row => {
        return row.map(cell => {
            if (cell === null || cell === undefined) return '';
            const stringCell = String(cell);
            if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                return `"${stringCell.replace(/"/g, '""')}"`;
            }
            return stringCell;
        }).join(',');
    }).join('\n');
}

const testData = [
    ['Name', 'Description', 'Price'],
    ['Product A', 'Simple description', '10'],
    ['Product B', 'Description, with comma', '20'],
    ['Product C', 'Description with "quotes"', '30'],
    ['Product D', 'Description\nwith newline', '40']
];

console.log('Testing CSV Escaping:');
const csv = convertToCsv(testData);
console.log(csv);

// Check specific lines
const lines = csv.split('\n');
// Note: Newline in Product D splits it into two lines in the output string, so total lines will be 6, not 5.
// Line 0: Header
// Line 1: Product A
// Line 2: Product B
// Line 3: Product C
// Line 4: Product D (start)
// Line 5: Product D (end)

const passed = 
    lines[2] === 'Product B,"Description, with comma",20' &&
    lines[3] === 'Product C,"Description with ""quotes""",30';

if (passed) {
    console.log('\nResult: Passed');
} else {
    console.log('\nResult: Failed');
    console.log('Expected Line 2:', 'Product B,"Description, with comma",20');
    console.log('Actual Line 2:  ', lines[2]);
    console.log('Expected Line 3:', 'Product C,"Description with ""quotes""",30');
    console.log('Actual Line 3:  ', lines[3]);
}
