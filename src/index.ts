import { applyMigrations } from './database/apply-migrations'
import { dbQuery } from './database/connection'
import { Server } from './utils/server'

import { schemaController } from './controllers/entity-schema.controller'
import { entityController } from './controllers/entity.controller'

const server = new Server()
server.use('/entity', entityController)
server.use('/schema', schemaController)

// todo get port from config
// todo make server able to handle errors in controllers
applyMigrations(dbQuery).then(() => server.listen(3000))
