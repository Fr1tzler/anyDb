import { createServer, ServerResponse, IncomingMessage } from 'http'
import { applyMigrations } from './database/apply-migrations'
import { dbQuery } from './database/connection'
import { getBaseUrl, validatePathMatch } from './utils/server'
import { ControllerGroup } from './types'

import { schemaControllerGroup } from './controllers/entity-schema.controller'
import { entityControllerGroup } from './controllers/entity.controller'

const controllerGroups: ControllerGroup[] = [
  schemaControllerGroup,
  entityControllerGroup,
]

// todo save source maps after build (?)
// todo make server able to handle errors in controllers
applyMigrations(dbQuery).then(() => {
  createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const reqBaseUrl = getBaseUrl(req.url)

    let responseData: unknown = {}

    for (const controllerGroup of controllerGroups) {
      if (!reqBaseUrl.startsWith(controllerGroup.basePath)) {
        continue
      }
      const subpath = reqBaseUrl.replace(controllerGroup.basePath, '')
      for (const controller of controllerGroup.controllers) {
        if (
          controller.method === req.method &&
          validatePathMatch(subpath, controller.path)
        ) {
          responseData = (await controller.executor(req, res)) || responseData
          break
        }
      }
      break
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(responseData))
    res.end()
  }).listen(3000, () => console.log('Server is running on port 3000'))
})
