import http, { RequestOptions, IncomingHttpHeaders, IncomingMessage } from 'http'
import https from 'https'

type Response<T> = {
  body: T;
  headers: IncomingHttpHeaders;
  statusCode: number;
}

export class Request {
  static getProtocolHandler(url: string) {
    if (url.startsWith('https:')) {
      return https
    }
    return http
  }

  static makeRequest<T>(
    method: string,
    url: string,
    body?: Record<string, unknown>
  ): Promise<Response<T>> {
    const options: RequestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...body && { 'Content-Length': Buffer.byteLength(JSON.stringify(body)) },
      },
    }

    return new Promise((resolve, reject) => {
      const handler = Request.getProtocolHandler(url)
      const req = handler.request(url, options, (res: IncomingMessage) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          resolve({
            body: (data && JSON.parse(data)) as T,
            headers: res.headers,
            statusCode: res.statusCode || 200,
          })
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      if (body) {
        req.write(JSON.stringify(body))
      }
      req.end()
    })
  }

  static get<T>(url: string): Promise<Response<T>> {
    return Request.makeRequest<T>('GET', url)
  }

  static post<T>(url: string, body: Record<string, unknown>): Promise<Response<T>> {
    return Request.makeRequest<T>('POST', url, body)
  }

  static put<T>(url: string, body: Record<string, unknown>): Promise<Response<T>> {
    return Request.makeRequest<T>('PUT', url, body)
  }

  static delete<T>(url: string): Promise<Response<T>> {
    return Request.makeRequest<T>('DELETE', url)
  }
}