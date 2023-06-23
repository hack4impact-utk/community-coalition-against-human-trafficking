import React from 'react'
import DesktopInventoryItemListItemSkeleton from './DesktopInventoryItemListItemSkeleton'

interface DesktopInventoryItemListSkeletonProps {
  rowsPerPage: number
}

export default function DesktopInventoryItemListSkeleton({
  rowsPerPage,
}: DesktopInventoryItemListSkeletonProps) {
  return (
    <>
      {Array.from(Array(rowsPerPage).keys()).map((i) => (
        <DesktopInventoryItemListItemSkeleton key={i} />
      ))}
    </>
  )
}
