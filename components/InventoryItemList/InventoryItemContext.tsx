import React from 'react'
import { createContext } from 'react'

export type InventoryItemContextType = {
  refetch: () => void
}

export const InventoryItemContext =
  createContext<InventoryItemContextType | null>(null)

type InventoryItemProviderProps = {
  refetch: () => void
  children: React.ReactNode
}

const InventoryItemProvider = ({
  refetch,
  children,
}: InventoryItemProviderProps) => {
  return (
    <InventoryItemContext.Provider value={{ refetch }}>
      {children}
    </InventoryItemContext.Provider>
  )
}

export default InventoryItemProvider
