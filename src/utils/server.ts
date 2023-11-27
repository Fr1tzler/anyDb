import { IncomingMessage, ServerResponse, createServer } from 'http'
import { Controller } from '../types'
import { Handler, HttpMethod, IncomingRequest } from '../types/controller.type'

// #region URL PARSING

export function getBaseUrl(requestUrl: string | undefined) {
  return requestUrl ? requestUrl.split('?')[0] : '/'
}

export function validatePathMatch(
  requestPath: string,
  controllerPath: string,
): boolean {
  const requestUrlParts = requestPath.split('/').filter(Boolean)
  const controllerUrlParts = controllerPath.split('/').filter(Boolean)
  if (requestUrlParts.length !== controllerUrlParts.length) {
    return false
  }
  for (let i = 0; i < controllerUrlParts.length; i++) {
    if (
      controllerUrlParts[i].startsWith(':') ||
      controllerUrlParts[i] === requestUrlParts[i]
    ) {
      continue
    }
    return false
  }
  return true
}

// todo handle numbers and boolean values
export function getPathParams<T extends { [key: string]: string }>(
  requestPath: string,
  controllerPath: string,
): T {
  if (!validatePathMatch(requestPath, controllerPath)) {
    console.warn(`url "${requestPath}" can't be mapped to "${controllerPath}"`)
    throw new Error(
      `url "${requestPath}" can't be mapped to "${controllerPath}"`,
    )
  }
  const requestUrlParts = requestPath.split('/').filter(Boolean)
  const controllerUrlParts = controllerPath.split('/').filter(Boolean)

  const result: { [key: string]: string } = {}
  for (let i = 0; i < controllerUrlParts.length; i++) {
    if (controllerUrlParts[i].startsWith(':')) {
      result[controllerUrlParts[i].replace(':', '')] = requestUrlParts[i]
    }
  }
  return result as T
}

// #endregion

// #region REQUEST PARSING

async function extractBody<T>(req: IncomingMessage): Promise<T> {
  const bodyChunks: string[] = []
  req.on('data', (chunk) => bodyChunks.push(chunk))
  return await new Promise<T>((resolve) => {
    req.on('end', () => resolve(JSON.parse(bodyChunks.join('')) as T))
  })
}

// #endregion

// #region SERVER

export class Server {
  private controllers: Controller[]

  constructor() {
    this.controllers = []
  }

  public listen(port: number = 3000) {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const reqBaseUrl = getBaseUrl(req.url)

      console.log('reqBaseUrl', reqBaseUrl)
      console.log('this.controllers', this.controllers)

      const candidates = this.controllers
        .filter((controller) => controller.method === req.method)
        .filter((controller) => validatePathMatch(reqBaseUrl, controller.path))
      console.log('candidates', candidates)
      const [controller] = candidates
      if (!controller) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end()
      }
      try {
        const params = getPathParams(req.url ?? '', controller.path)
        const parsedRequest: IncomingRequest = {
          params,
          request: req,
          getBody<T>() {
            return extractBody<T>(req)
          },
        }
        const responseData = await controller.handler(parsedRequest, res)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(responseData))
        res.end()
      } catch (error) {
        console.log(error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(error))
        res.end()
      }
    }).listen(port, () => console.log(`Server is running on port ${port}`))
  }

  public use(subpath: string, server: Server) {
    this.controllers.push(...server.controllers.map((controller) => ({
      ...controller,
      path: `${subpath}${controller.path}`,
    })))
  }

  public get(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.GET })
  }

  public post(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.POST })
  }

  public put(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.PUT })
  }

  public delete(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.DELETE })
  }
}

// #endregion