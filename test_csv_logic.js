
function parseCsv(csv) {
  if (!csv) return [];
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const requiredHeaders = ['date', 'product_id'];
  const hasSales = headers.includes('sales') || headers.includes('quantity');

  console.log('Headers:', headers);
  console.log('Has Date:', headers.includes('date'));
  console.log('Has Product ID:', headers.includes('product_id'));
  console.log('Has Sales/Quantity:', hasSales);

  if (!requiredHeaders.every(h => headers.includes(h)) || !hasSales) {
    console.warn("CSV headers are missing required columns (date, product_id, sales/quantity). Using default data.");
    return [];
  }

  return ["Success"];
}

const validCsv = `date,product_id,sales
2023-01-01,123,10`;

const invalidCsv = `Date,Product ID,Sales
2023-01-01,123,10`;

console.log('Testing Valid CSV:');
const result1 = parseCsv(validCsv);
console.log('Result:', result1.length > 0 ? 'Passed' : 'Failed');

console.log('\nTesting Invalid CSV (Case mismatch/Spaces):');
const result2 = parseCsv(invalidCsv);
console.log('Result:', result2.length > 0 ? 'Passed' : 'Failed');
