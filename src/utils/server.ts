import { IncomingMessage, ServerResponse, createServer } from 'http'
import { Controller } from '../types'
import { Handler, HttpMethod, IncomingRequest } from '../types/controller.type'
import { Logger } from './logger'

const logger = new Logger('Server')

// #region URL PARSING

/**
 * Returns the base URL from the given request URL by removing any query parameters.
 *
 * @param {string | undefined} requestUrl - The request URL to extract the base URL from.
 * @return {string} The base URL extracted from the request URL,
 *                  or '/' if the request URL is undefined.
 */
export function getBaseUrl(requestUrl: string | undefined) {
  return requestUrl ? requestUrl.split('?')[0] : '/'
}

/**
 * Validates if the request path matches the controller path.
 *
 * @param {string} requestPath - the path sent in the request
 * @param {string} controllerPath - the path defined in the controller
 * @return {boolean} true if the paths match, false otherwise
 */
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

/**
 * Returns the path parameters extracted from the request path
 * based on the controller path.
 *
 * @param {string} requestPath - The request path
 * @param {string} controllerPath - The controller path
 * @return {T} The path parameters as an object
 */
export function getPathParams<T extends { [key: string]: string }>(
  requestPath: string,
  controllerPath: string,
): T {
  if (!validatePathMatch(requestPath, controllerPath)) {
    logger.error(`url "${requestPath}" can't be mapped to "${controllerPath}"`)
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

/**
 * Retrieves the query parameters from the incoming message and returns them as a record of strings.
 *
 * @param {IncomingMessage} req - the incoming message object
 * @return {Record<string, string>} the query parameters as a record of strings
 */
export function getRequestQuery(req: IncomingMessage): Record<string, string> {
  const query = new URLSearchParams(req.url?.split('?')[1] || '')
  const result: Record<string, string> = {}
  query.forEach((value, key) => result[key] = value)
  return result
}

// #endregion

// #region REQUEST PARSING

/**
 * Asynchronously extracts the body from the incoming message and parses it into the specified type.
 *
 * @param {IncomingMessage} req - the incoming message object
 * @return {Promise<T>} a promise that resolves to the parsed body of type T
 */
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

      const candidates = this.controllers
        .filter((controller) => controller.method === req.method)
        .filter((controller) => validatePathMatch(reqBaseUrl, controller.path))
      const [controller] = candidates
      if (!controller) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end()
        return
      }
      try {
        const params = getPathParams(req.url ?? '', controller.path)
        const parsedRequest: IncomingRequest = {
          params,
          request: req,
          query: getRequestQuery(req),
          getBody<T>() {
            return extractBody<T>(req)
          },
        }
        const responseData = await controller.handler(parsedRequest, res)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(responseData || {}))
        res.end()
      } catch (error) {
        logger.error(error)
        if (error instanceof Error) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          const { name, message, stack } = error
          res.write(JSON.stringify({ name, message, stack }))
          res.end()
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.write(JSON.stringify(error))
          res.end()
        }
      }
    }).listen(port, () => logger.info(`Server is running on port ${port}`))
  }

  /**
   * Adds the controllers from the provided server to the current instance,
   * after modifying the paths to include the specified subpath.
   *
   * @param {string} subpath - the subpath to be included in the controller paths
   * @param {Server} server - the server containing controllers to be added
   */
  public use(subpath: string, server: Server) {
    this.controllers.push(...server.controllers.map((controller) => ({
      ...controller,
      path: `${subpath}${controller.path}`,
    })))
  }

  /**
   * Adds a new route with the specified path and handler for GET requests.
   *
   * @param {string} path - the path for the new route
   * @param {Handler} handler - the handler function for the new route
   * @return {void}
   */
  public get(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.GET })
  }

  /**
   * Adds a new route with the specified path and handler for POST requests.
   *
   * @param {string} path - the path for the new route
   * @param {Handler} handler - the handler function for the new route
   * @return {void}
   */
  public post(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.POST })
  }

  /**
   * Adds a new route with the specified path and handler for PUT requests.
   *
   * @param {string} path - the path for the new route
   * @param {Handler} handler - the handler function for the new route
   * @return {void}
   */
  public put(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.PUT })
  }

  /**
   * Adds a new route with the specified path and handler for DELETE requests.
   *
   * @param {string} path - the path for the new route
   * @param {Handler} handler - the handler function for the new route
   * @return {void}
   */
  public delete(path: string, handler: Handler) {
    this.controllers.push({ handler, path, method: HttpMethod.DELETE })
  }
}

// #endregion