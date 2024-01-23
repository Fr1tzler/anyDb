export type EndpointType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  path: string;
  entitySchemaId: string;

  createOneEnabled: boolean;
  listAllEnabled: boolean;
  getOneEnabled: boolean;
  updateOneEnabled: boolean
  deleteOneEnabled: boolean;
}

export enum EndpointOperation {
  CREATE_ONE = 'createOne',
  LIST_ALL = 'listAll',
  GET_ONE = 'getOne',
  UPDATE_ONE = 'updateOne',
  DELETE_ONE = 'deleteOne',
}