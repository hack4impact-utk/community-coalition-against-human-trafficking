import React from 'react'
import { createContext } from 'react'
import { ItemDefinitionResponse } from 'utils/types'

export type ItemDefinitionContextType = {
  itemDefinitions: ItemDefinitionResponse[]
  deleteItemDefinition: (id: string) => void
}

export const ItemDefinitionContext =
  createContext<ItemDefinitionContextType | null>(null)

type ItemDefinitionProviderProps = {
  initialItemDefinitions: ItemDefinitionResponse[]
  children: React.ReactNode
}

const ItemDefinitionProvider = ({
  initialItemDefinitions,
  children,
}: ItemDefinitionProviderProps) => {
  const [itemDefinitions, setItemDefinitions] = React.useState<
    ItemDefinitionResponse[]
  >(initialItemDefinitions)

  React.useEffect(() => {
    setItemDefinitions(initialItemDefinitions)
  }, [initialItemDefinitions])

  const deleteItemDefinition = (id: string) => {
    setItemDefinitions((itemDefs) =>
      itemDefs.filter((itemDef) => itemDef._id !== id)
    )
  }

  return (
    <ItemDefinitionContext.Provider
      value={{ itemDefinitions, deleteItemDefinition }}
    >
      {children}
    </ItemDefinitionContext.Provider>
  )
}

export default ItemDefinitionProvider
