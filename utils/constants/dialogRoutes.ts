export interface DialogRoute {
  name: string
  path: string
}

export const dialogRoutes: DialogRoute[] = [
  {
    name: 'editAttribute',
    path: '/settings/attributes/:id/edit',
  },
  {
    name: 'createAttribute',
    path: '/settings/attributes/create',
  },
  {
    name: 'createItem',
    path: '/items/new',
  },
]
