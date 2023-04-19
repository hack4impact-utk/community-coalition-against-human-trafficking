import TestDialog from 'pages/dialog/testDialog'
import { ReactElement } from 'react'

export interface DialogRoute {
  name: string
  path: string
  component: () => ReactElement
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'test',
    path: '/dialog/test',
    component: TestDialog,
  },
]
