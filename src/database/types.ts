import { QueryResultRow } from 'pg'

export type DbQueryParameterType = (string | number | boolean | Record<string, unknown> | null | Date | DbQueryParameterType)[]

export type DbQueryExecutor = <T extends QueryResultRow>(query: string, params?: DbQueryParameterType) => Promise<T[]>

export type DatabaseMigrationType = {
  up(dbQuery: DbQueryExecutor): Promise<void>;
  down(dbQuery: DbQueryExecutor): Promise<void>;
  tag: string;
}

export type MigrationEntity = {
  id: number;
  tag: string;
}