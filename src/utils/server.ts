export function getBaseUrl(requestUrl: string | undefined) {
  return requestUrl ? requestUrl.split('?')[0] : '/'
}

// todo: handle numbers and boolean values
export function getPathParams<T extends {[key: string]: string}>(baseUrl: string, urlSchema: string): T | null {
  const baseUrlParts = baseUrl.split('/')
  const schemaParts = urlSchema.split('/')
  if (baseUrlParts.length !== schemaParts.length) {
    console.warn(`url "${baseUrl}" can't be mapped to "${urlSchema}"`)
    return null
  }
  const result: {[key: string]: string} = {}
  for (let i = 0; i < baseUrlParts.length; i++) {
    if (!schemaParts[i].startsWith(':')) {
      if (schemaParts[i] !== baseUrlParts[i]) {
        console.warn(`url "${baseUrl}" can't be mapped to "${urlSchema}"`)
        return null    
      }
      continue
    }
    result[schemaParts[i].replace(':', '')] = baseUrlParts[i]
  }
  return result as T
}