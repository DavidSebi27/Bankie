export const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n ?? 0)

export const formatIban = (iban) =>
  iban?.replace(/(.{4})/g, '$1 ').trim() ?? '—'

export const formatTimestamp = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
