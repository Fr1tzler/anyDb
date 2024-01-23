export type Routes = {
  basePath: string;
  routes: {
    [key: string]: (...pathSegments: string[]) => string
  }
}

export const SchemaRoutes: Routes = {
  basePath: '/schema',
  routes: {
    listAll: () => '/',
    getOne: (entityId = ':entitySchemaId') => `/${entityId}`,
    createOne: () => '/',
    updateOne: (entityId = ':entitySchemaId') => `/${entityId}`,
    deleteOne: (entityId = ':entitySchemaId') => `/${entityId}`,
  }
}

export const EntityRoutes: Routes = {
  basePath: '/entity',
  routes: {
    listAllBySchemaId: (entitySchemaId = ':entitySchemaId') => `/by-schema/${entitySchemaId}`,
    getOne: (entityId = ':entityId') => `/${entityId}`,
    createOne: () => '/',
    updateOne: (entityId = ':entityId') => `/${entityId}`,
    deleteOne: (entityId = ':entityId') => `/${entityId}`,
  }
}