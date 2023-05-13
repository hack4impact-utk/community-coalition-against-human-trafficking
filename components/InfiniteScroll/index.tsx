import { CircularProgress } from '@mui/material'
import React from 'react'

interface InfiniteScrollProps {
  children: React.ReactNode
  next: () => Promise<void>
  hasMore: boolean
}

export default function InfiniteScroll({
  children,
  next,
  hasMore,
}: InfiniteScrollProps) {
  const [loading, setLoading] = React.useState(false)

  const onScroll = React.useCallback(async () => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight && hasMore && !loading) {
      setLoading(true)
      await next()
      setLoading(false)
    }
  }, [hasMore, next, loading, setLoading])

  React.useEffect(() => {
    window.onscroll = onScroll
  }, [onScroll])

  return (
    <>
      {children}
      {
        <CircularProgress
          variant="indeterminate"
          color="inherit"
          sx={{ margin: 'auto' }}
        />
      }
    </>
  )
}
