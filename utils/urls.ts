export default {
  pages: {
    checkIn: '/checkIn',
    checkOut: '/checkOut',
    history: '/history',
    inventory: '/inventory',
    dashboard: '/',
    settings: {
      general: '/settings',
      categories: 'settings/categories',
      itemDefinitions: 'settings/items',
      attributes: 'settings/attributes',
    },

    dialogs: {
      editAttribute: '/settings/attributes/:id/edit',
      createAttribute: '/settings/attributes/create',
      editCategory: (id: string) => `/settings/categories/${id}/edit`,
      createCategory: '/settings/categories/create',
      createItem: '/items/new',
    },
  },

  api: {
    attributes: {
      attributes: '/api/attributes',
      attribute: (attributeId: string) => `/api/attributes/${attributeId}`,
    },

    categories: {
      categories: '/api/categories',
      category: (categoryId: string) => `/api/categories${categoryId}`,
    },

    inventoryItems: {
      inventoryItems: '/api/inventoryItems',
      inventoryItem: (inventoryItemId: string) =>
        `/api/inventoryItems/${inventoryItemId}`,
      checkIn: '/api/inventoryItems/checkIn',
      checkOut: '/api/inventoryItems/checkOut',
      lowStock: '/api/inventoryItems/lowStock',
    },

    itemDefinitions: {
      itemDefinitions: '/api/itemDefinitions',
      itemDefinition: (itemDefinitionId: string) =>
        `/api/itemDefinitions/${itemDefinitionId}`,
    },

    logs: {
      logs: '/api/logs',
      log: (logId: string) => `/api/logs/${logId}`,
      export: (query: string) => `/api/logs/export${query}`,
    },

    notificationEmails: {
      notificationEmails: '/api/notificationEmails',
      notificationEmail: (notificationEmailId: string) =>
        `/api/notificationEmails${notificationEmailId}`,
    },

    users: {
      users: '/api/users',
      user: (userId: string) => `/api/users/${userId}`,
    },
  },
}