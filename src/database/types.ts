export type DbQueryExecutor = (query: string, params?: string[]) => Promise<unknown[]>

export type DatabaseMigrationType = {
  up(dbQuery: DbQueryExecutor): Promise<void>;
  down(dbQuery: DbQueryExecutor): Promise<void>;
  tag: string;
}

export type MigrationEntity = {
  id: number;
  key: string;
}