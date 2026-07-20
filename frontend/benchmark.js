// Mock supabase
const generateRows = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Product ${i}`,
    category: 'pickles',
    actualPrice: 100,
    sellingPrice: 120,
  }));
};

const mockSupabase = {
  from: (table) => ({
    insert: async (data) => {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 5));
      return { error: null };
    }
  })
};

const rows = generateRows(100);

async function runOriginal() {
  const start = performance.now();
  let count = 0;
  for (const row of rows) {
    const { error } = await mockSupabase.from('products').insert({
      name: row.name || row.Name || '',
      category: (row.category || row.Category || 'pickles').toLowerCase(),
      actual_price: Number(row.actualPrice || row['Actual Price'] || 0),
      selling_price: Number(row.sellingPrice || row['Selling Price'] || 0),
      sku: `RKF${Math.floor(100000 + Math.random() * 900000)}`,
      in_stock: true,
    });
    if (error) throw error;
    count++;
  }
  const end = performance.now();
  console.log(`Original: ${end - start}ms`);
}

async function runOptimized() {
  const start = performance.now();
  const productsToInsert = rows.map((row) => ({
    name: row.name || row.Name || '',
    category: (row.category || row.Category || 'pickles').toLowerCase(),
    actual_price: Number(row.actualPrice || row['Actual Price'] || 0),
    selling_price: Number(row.sellingPrice || row['Selling Price'] || 0),
    sku: `RKF${Math.floor(100000 + Math.random() * 900000)}`,
    in_stock: true,
  }));
  const { error } = await mockSupabase.from('products').insert(productsToInsert);
  if (error) throw error;
  let count = productsToInsert.length;
  const end = performance.now();
  console.log(`Optimized: ${end - start}ms`);
}

async function run() {
  await runOriginal();
  await runOptimized();
}

run();
