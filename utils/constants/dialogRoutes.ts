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
    name: 'createItem',
    path: '/items/new',
  },
]
