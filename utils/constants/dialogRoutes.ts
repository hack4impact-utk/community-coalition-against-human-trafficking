import TestDialog from 'pages/dialog/testDialog'
import AttributeEditForm from 'pages/settings/attributes/[attributeId]/edit'
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
  {
    name: 'editAttribute',
    path: '/settings/attributes/:id/edit',
    component: AttributeEditForm,
  },
]
