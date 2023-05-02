import NewItemPage from 'pages/items/new'
import { ReactElement } from 'react'

export interface DialogRoute {
  name: string
  path: string
  // todo: fix this type
  component: (...args: any[]) => ReactElement
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'createItem',
    path: '/items/new',
    component: NewItemPage,
  },
]
