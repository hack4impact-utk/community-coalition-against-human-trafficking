export interface DialogRoute {
  name: string
  path: string
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
  },
  {
    name: 'createItem',
    path: '/items/new',
  },
]
