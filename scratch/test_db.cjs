const pool = require('./backend-jamur/db');

async function testInsert() {
  const recipientName = 'Test User';
  const phone = '08123456789';
  const address = 'Test Address, Way Kanan';
  const notes = 'Test notes';
  const items = [{ product_id: 1, name: 'Test Product', price: 10000, quantity: 1 }];
  const subtotal = 10000;
  const shippingCost = 0;
  const serviceFee = 2000;
  const discount = 0;
  const grandTotal = 12000;
  const courier = 'Kaesang Express';
  const paymentMethod = 'COD';
  const paymentToken = 'SIM-TEST-123';
  const isCOD = 1;
  const isFreeShipping = 1;

  try {
    const [result] = await pool.query(
      `INSERT INTO orders 
        (recipient_name, phone, address, notes, items, subtotal, shipping_cost, service_fee, discount, grand_total,
         status, courier, payment_method, payment_status, payment_token, is_cod, is_free_shipping)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, 'Pending', ?, ?, ?)`,
      [
        recipientName, phone, address, notes,
        JSON.stringify(items), subtotal, shippingCost, serviceFee, discount, grandTotal,
        courier, paymentMethod, paymentToken, isCOD, isFreeShipping
      ]
    );
    console.log('✅ INSERT SUCCESS, id:', result.insertId);
  } catch (err) {
    console.error('❌ INSERT FAILED:', err.message);
    console.error('SQL State:', err.sqlState);
    console.error('Error Code:', err.code);
  } finally {
    process.exit();
  }
}

testInsert();
