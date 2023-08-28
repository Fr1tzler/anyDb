import { IncomingMessage, ServerResponse } from 'http'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type Controller = {
  path: string;
  method: HttpMethod;
  executor: (req: IncomingMessage, res: ServerResponse) => unknown;
};

export type ControllerGroup = {
  controllers: Controller[];
  basePath: string;
};
