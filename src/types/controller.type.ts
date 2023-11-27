import { IncomingMessage, ServerResponse } from 'http'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type IncomingRequest = {
  request: IncomingMessage,
  params: Record<string, string>,
  getBody<T>(): Promise<T>,
};

export type Handler = (req: IncomingRequest, res: ServerResponse) => unknown;

export type Controller = {
  path: string;
  method: HttpMethod;
  handler: Handler;
};


export type ControllerGroup = {
  controllers: Controller[];
  basePath: string;
};
