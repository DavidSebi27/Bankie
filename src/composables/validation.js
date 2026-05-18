/**
 * Form validation helpers used across transfer / ATM flows.
 * Each validator returns an error string (or '' when valid) so call
 * sites can drop the result straight into a `:error` prop.
 */

export const IBAN_RE = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/

export const validateIban = (value) => {
    if (!value)                    return 'IBAN is required'
    if (!IBAN_RE.test(value))      return 'Invalid IBAN format'
    return ''
}

export const validateAmount = (value) => {
    if (value == null || value === '') return 'Amount is required'
    if (!(value > 0))                  return 'Amount must be greater than zero'
    return ''
}

/**
 * Map a transfer API error to a structured shape so the view can decide
 * whether to put the message under a field or above the form.
 *
 * Returns: { field: 'fromIban' | 'toIban' | 'amount' | null, message: string }
 *
 *  - 400 → tries to attribute the field from the message ("fromIban", "amount", …)
 *  - 422 → business-rule violation, surfaced verbatim at form level
 *  - 404 → auth-oracle defense → friendly "no permission" message
 */
export const mapTransferError = (err) => {
    const status  = err.response?.status
    const message = err.response?.data?.message || 'Transfer failed'
    const lower   = message.toLowerCase()

    if (status === 400) {
        if (lower.includes('fromiban') || lower.includes('source'))
            return { field: 'fromIban', message }
        if (lower.includes('toiban')   || lower.includes('destination'))
            return { field: 'toIban',   message }
        if (lower.includes('amount'))
            return { field: 'amount',   message }
        return { field: null, message }
    }

    if (status === 422) return { field: null, message }
    if (status === 404) return { field: null, message: "You don't have permission to initiate transfers." }

    return { field: null, message }
}
