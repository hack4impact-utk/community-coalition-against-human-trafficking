import DesktopHistoryListItemSkeleton from './DesktopHistoryListItemSkeleton'

interface DesktopHistoryListSkeletonProps {
  rowsPerPage: number
}

export default function DesktopHistoryListSkeleton({
  rowsPerPage,
}: DesktopHistoryListSkeletonProps) {
  return (
    <>
      {Array.from(Array(rowsPerPage).keys()).map((i) => (
        <DesktopHistoryListItemSkeleton key={i} />
      ))}
    </>
  )
}
