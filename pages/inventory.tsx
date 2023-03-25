import InventoryItemList from 'components/InventoryItemList'
import { useEffect, useState } from 'react'
import { InventoryItem } from 'utils/types'

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[] | null>(
    null
  )

  useEffect(() => {
    // TODO in the future, get a better way of constructing this URL. Perhaps a utils/urls.ts
    fetch(`http://localhost:3000/api/inventoryItems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setInventoryItems(res.payload as InventoryItem[]))
  }, [])

  return (
    <>
      {inventoryItems != null && (
        <InventoryItemList
          inventoryItems={inventoryItems}
          search={''}
          category={''}
        />
      )}
    </>
  )
}
