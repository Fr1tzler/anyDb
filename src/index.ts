import { applyMigrations } from './database/apply-migrations'
import { dbQuery } from './database/connection'
import { Server } from './utils/server'
import { appConfig } from './config'
import { schemaController } from './controllers/entity-schema.controller'
import { entityController } from './controllers/entity.controller'
import { EndpointRoutes, EntityRoutes, SchemaRoutes } from './routes'
import { endpointController } from './controllers/endpoint.controller'

const server = new Server()
server.use(EntityRoutes.basePath, entityController)
server.use(SchemaRoutes.basePath, schemaController)
server.use(EndpointRoutes.basePath, endpointController)

applyMigrations(dbQuery).then(() => server.listen(appConfig.port))
