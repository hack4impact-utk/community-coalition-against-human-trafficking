import urls from 'utils/urls'

export interface DialogRoute {
  name: string
  path: string
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'editAttribute',
    path: urls.pages.dialogs.editAttribute(':id'),
  },
  {
    name: 'createAttribute',
    path: urls.pages.dialogs.createAttribute,
  },
  {
    name: 'editCategory',
    path: urls.pages.dialogs.editCategory(':id'),
  },
  {
    name: 'createCategory',
    path: urls.pages.dialogs.createCategory,
  },
  {
    name: 'createItem',
    path: urls.pages.dialogs.createItemDefinition,
  },
]
