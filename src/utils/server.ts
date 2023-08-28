import { IncomingMessage } from 'http'

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
    false
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

export async function extractBody<T>(req: IncomingMessage): Promise<T> {
  const bodyChunks: string[] = []
  req.on('data', (chunk) => bodyChunks.push(chunk))
  return await new Promise<T>((resolve) => {
    req.on('end', () => resolve(JSON.parse(bodyChunks.join('')) as T))
  })
}

// #endregion
