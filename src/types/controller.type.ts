import { IncomingMessage, ServerResponse } from 'http'

// todo rm enum and use something like Record instead (6 / 10)
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type IncomingRequest = {
  request: IncomingMessage,
  query: Record<string, string>,
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
