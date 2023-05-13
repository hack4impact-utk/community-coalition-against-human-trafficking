import urls from 'utils/urls'

export interface DialogRoute {
  name: string
  path: string
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'editAttribute',
    path: urls.pages.dialogs.editAttribute,
  },
  {
    name: 'createAttribute',
    path: urls.pages.dialogs.createAttribute,
  },
  {
    name: 'editCategory',
    path: '/settings/categories/:id/edit',
  },
  {
    name: 'createCategory',
    path: '/settings/categories/create',
  },
  {
    name: 'createItem',
    path: urls.pages.dialogs.createItem,
  },
]
