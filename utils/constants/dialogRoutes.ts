import TestDialog from 'pages/dialog/testDialog'
import AttributeEditForm from 'pages/settings/attributes/[attributeId]/edit'
import { ReactElement } from 'react'

interface RouterQueryParams {
  [key: string]: string | string[] | undefined
}

export interface DialogProps {
  params: RouterQueryParams
  dialogState: any
  setDialogState: (state: any) => void
  [key: string]: any
}
export interface DialogRoute {
  name: string
  path: string
  component: (props: DialogProps) => ReactElement
  componentPath: string
}

export const dialogRoutes: DialogRoute[] = [
  // {
  //   name: 'test',
  //   path: '/dialog/test',
  //   component: TestDialog,
  // },
  {
    name: 'editAttribute',
    path: '/settings/attributes/:id/edit',
    component: AttributeEditForm,
    componentPath: 'pages/settings/attributes/[attributeId]/edit',
  },
]
