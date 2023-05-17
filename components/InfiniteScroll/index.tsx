import { CircularProgress } from '@mui/material'
import React from 'react'

interface InfiniteScrollProps {
  children: React.ReactNode
  next: () => Promise<void>
  hasMore: boolean
  setParentLoading: (loading: boolean) => void
}

export default function InfiniteScroll({
  children,
  next,
  hasMore,
  setParentLoading,
}: InfiniteScrollProps) {
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setParentLoading(false)
  }, [])

  const onScroll = React.useCallback(async () => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight && hasMore && !loading) {
      setLoading(true)
      setParentLoading(true)
      await next()
      setParentLoading(false)
      setLoading(false)
    }
  }, [hasMore, next, loading, setLoading])

  React.useEffect(() => {
    window.onscroll = onScroll
  }, [onScroll])

  return (
    <>
      {children}
      {hasMore && (
        <CircularProgress
          variant="indeterminate"
          color="inherit"
          sx={{ margin: 'auto' }}
        />
      )}
    </>
  )
}
