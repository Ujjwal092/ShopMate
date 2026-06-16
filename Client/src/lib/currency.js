export function formatINR(value) {
  if (value == null || value === undefined || Number.isNaN(Number(value))) return '₹0.00';
  const n = Number(value);
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}
