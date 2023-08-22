import { createServer, ServerResponse, IncomingMessage } from 'http'
import { applyMigrations } from './database/apply-migrations'
import { dbQuery } from './database/connection'

applyMigrations(dbQuery)

createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(req)
  
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.write(JSON.stringify({ hello: 'world' }))
  res.end()
}).listen(3000)
