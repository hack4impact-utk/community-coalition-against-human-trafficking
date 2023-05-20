import React from 'react'
import { createContext } from 'react'
import { AttributeResponse } from 'utils/types'

export type AttributeContextType = {
  attributes: AttributeResponse[]
  deleteAttribute: (id: string) => void
  setAttributes: (attributes: AttributeResponse[]) => void
}

export const AttributeContext = createContext<AttributeContextType | null>(null)

type AttributeProviderProps = {
  initialAttributes: AttributeResponse[]
  children: React.ReactNode
}

const AttributeProvider = ({
  initialAttributes,
  children,
}: AttributeProviderProps) => {
  const [attributes, setAttributes] =
    React.useState<AttributeResponse[]>(initialAttributes)

  React.useEffect(() => {
    setAttributes(initialAttributes)
  }, [initialAttributes])

  const deleteAttribute = (id: string) => {
    setAttributes((attrs) => attrs.filter((attr) => attr._id !== id))
  }

  return (
    <AttributeContext.Provider
      value={{ attributes, deleteAttribute, setAttributes }}
    >
      {children}
    </AttributeContext.Provider>
  )
}

export default AttributeProvider
