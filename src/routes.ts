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

export const EndpointRoutes: Routes = {
  basePath: '/endpoint',
  routes: {
    listAll: () => '/',
    getOne: (endpointId = ':endpointId') => `/${endpointId}`,
    createOne: () => '/',
    updateOne: (endpointId = ':endpointId') => `/${endpointId}`,
    deleteOne: (endpointId = ':endpointId') => `/${endpointId}`,
  }
}

export const EndpointApiRoutes: Routes = {
  basePath: '/api',
  routes: {
    listAll: (endpointPath = ':endpointPath') => `/${endpointPath}`,
    getOne: (endpointPath = ':endpointPath', entityId = ':entityId') => `/${endpointPath}/${entityId}`,
    createOne: (endpointPath = ':endpointPath') => `/${endpointPath}`,
    updateOne: (endpointPath = ':endpointPath', entityId = ':entityId') => `/${endpointPath}/${entityId}`,
    deleteOne: (endpointPath = ':endpointPath', entityId = ':entityId') => `/${endpointPath}/${entityId}`,
  }
}