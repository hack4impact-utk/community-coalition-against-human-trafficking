import React from 'react'

type Order = 'asc' | 'desc'

export default function useBackendPaginationCache<TData>(
  total: number,
  orderBy: string,
  order: Order
) {
  const [itemCache, setItemCache] = React.useState<TData[]>([])

  // whenever the total changes or orderBy changes, reset the cache to an empty array of size total
  React.useEffect(() => {
    setItemCache(Array(total).fill(undefined))
  }, [total, orderBy, order])

  const updateCache = React.useCallback(
    (data: TData[], page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = cacheStart + limit
      setItemCache((prev) => {
        for (let i = cacheStart; i < cacheEnd; i++) {
          const dataIdx = i - cacheStart
          prev[i] = data[dataIdx]
        }
        return prev
      })
    },
    [setItemCache]
  )

  const clearCache = React.useCallback((n: number) => {
    setItemCache(Array(n).fill(undefined))
  }, [])

  const cacheFor = React.useCallback(
    (page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = cacheStart + limit
      return itemCache.slice(cacheStart, cacheEnd)
    },
    [itemCache]
  )

  const isCached = React.useCallback(
    (page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = cacheStart + limit
      return (
        itemCache[cacheStart] !== undefined &&
        itemCache[cacheEnd - 1] !== undefined
      )
    },
    [itemCache]
  )

  return { itemCache, updateCache, clearCache, cacheFor, isCached }
}
