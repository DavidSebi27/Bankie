export const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)

export const formatIban = (iban) =>
  iban?.replace(/(.{4})/g, '$1 ').trim() ?? '—'
