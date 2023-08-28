export interface IListAllResponse<T> {
  offset: number;
  limit: number;
  total: number;
  result: T[];
}
