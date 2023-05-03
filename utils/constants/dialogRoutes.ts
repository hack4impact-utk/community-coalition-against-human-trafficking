import NewItemPage from 'pages/items/new'
import { ReactElement } from 'react'

interface DialogProps {
  backHref?: string
  [key: string]: any
}

export interface DialogRoute {
  name: string
  path: string
  // todo: fix this type
  component: (props: DialogProps) => ReactElement
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'createItem',
    path: '/items/new',
    component: NewItemPage,
  },
]
