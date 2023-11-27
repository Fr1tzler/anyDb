import { applyMigrations } from './database/apply-migrations'
import { dbQuery } from './database/connection'
import { Server } from './utils/server'
import { appConfig } from './config'
import { schemaController } from './controllers/entity-schema.controller'
import { entityController } from './controllers/entity.controller'

const server = new Server()
server.use('/entity', entityController)
server.use('/schema', schemaController)

// todo implement logger
applyMigrations(dbQuery).then(() => server.listen(appConfig.port))
