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
    clearCache(total)
  }, [total, orderBy, order])

  const updateCache = React.useCallback(
    (data: TData[], page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = Math.min(cacheStart + limit, total)
      setItemCache((prev) => {
        for (let i = cacheStart; i < cacheEnd; i++) {
          const dataIdx = i - cacheStart
          prev[i] = data[dataIdx]
        }
        return prev
      })
    },
    [setItemCache, total]
  )

  const clearCache = React.useCallback((n: number) => {
    setItemCache(Array(n).fill(undefined))
  }, [])

  const cacheFor = React.useCallback(
    (page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = Math.min(cacheStart + limit, total)
      return itemCache.slice(cacheStart, cacheEnd)
    },
    [itemCache, total]
  )

  const isCached = React.useCallback(
    (page: number, limit: number) => {
      const cacheStart = page * limit
      const cacheEnd = Math.min(cacheStart + limit, total)
      for (let i = cacheStart; i < cacheEnd; i += 5) {
        if (itemCache[i] === undefined) return false
      }
      if (itemCache[cacheEnd - 1] === undefined) return false
      return true
    },
    [itemCache, total]
  )

  return { itemCache, updateCache, clearCache, cacheFor, isCached }
}
