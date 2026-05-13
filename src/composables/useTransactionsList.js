import { ref } from 'vue'

/**
 * Pagination + fetch state for any transactions endpoint that returns
 * a Spring Page<TransactionResponse>. Pass a fetcher(params) that returns
 * the axios response — the composable owns all the bookkeeping.
 *
 * 404 is treated as an empty result set (no distinct "not found" UI),
 * so callers can't distinguish "wrong customer", "wrong role", or
 * "really empty" — keeps the backend's oracle defense honest.
 */
export function useTransactionsList(fetcher) {
    const items         = ref([])
    const page          = ref(0)
    const size          = ref(20)
    const sort          = ref('timestamp,desc')
    const totalElements = ref(0)
    const totalPages    = ref(0)
    const first         = ref(true)
    const last          = ref(true)
    const loading       = ref(false)
    const error         = ref(null)

    const fetch = async () => {
        loading.value = true
        error.value   = null

        try {
            const res = await fetcher({
                page: page.value,
                size: size.value,
                sort: sort.value,
            })

            items.value         = res.data.content
            totalElements.value = res.data.totalElements
            totalPages.value    = res.data.totalPages
            first.value         = res.data.first
            last.value          = res.data.last
        } catch (err) {
            const status = err.response?.status

            if (status === 404) {
                items.value         = []
                totalElements.value = 0
                totalPages.value    = 0
                first.value         = true
                last.value          = true
            } else {
                error.value = err.response?.data?.message || 'Failed to load transactions'
            }
        } finally {
            loading.value = false
        }
    }

    const goToPage = (target) => {
        if (target < 0 || (totalPages.value > 0 && target >= totalPages.value)) return
        page.value = target
        return fetch()
    }

    const reset = () => {
        items.value         = []
        page.value          = 0
        totalElements.value = 0
        totalPages.value    = 0
        first.value         = true
        last.value          = true
        error.value         = null
    }

    return {
        items, page, size, sort,
        totalElements, totalPages, first, last,
        loading, error,
        fetch, goToPage, reset,
    }
}
