/**
 * Defensive helper — pastikan nilai selalu Array sebelum .filter/.map.
 * Mendukung respons API berbentuk array mentah atau objek pembungkus.
 */
export function toArray(value, keys = ['orders', 'data', 'items', 'products', 'results']) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    for (const key of keys) {
      if (Array.isArray(value[key])) return value[key];
    }
  }
  return [];
}

export function normalizeOrderItems(items) {
  return toArray(items).map((item) => ({
    id: item.id ?? item.order_item_id ?? item.product_id,
    product_id: item.product_id,
    name: item.product_name || item.name || 'Produk',
    price: Number(item.unit_price ?? item.price) || 0,
    quantity: Number(item.quantity) || 1,
    image: item.image || ''
  }));
}
