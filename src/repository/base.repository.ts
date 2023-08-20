import { EntitySchemaType, EntityType, SchemaFieldType, FieldValueType } from '../types'

type Indexable = {
  id: string;
}

export class BaseRepository {
  private _entitySchemaList: EntitySchemaType[]
  private _schemaFieldList: SchemaFieldType[]
  private _entityList: EntityType[]
  private _fieldValueList: FieldValueType[]

  constructor () {
    this._entitySchemaList = []
    this._schemaFieldList = []
    this._entityList = []
    this._fieldValueList = []
  }

  //#region GETTERS

  public get entitySchemaList() {
    return this._entitySchemaList
  }
  public get schemaFieldList() {
    return this._schemaFieldList
  }
  public get entityList() {
    return this._entityList
  }
  public get fieldValueList() {
    return this._fieldValueList
  }
  //#endregion

  //#region SETTERS

  public set entitySchemaList(newEntitySchemaList: EntitySchemaType[]) {
    const schemaIdDiff = this.getEntityIdDiff(this._entitySchemaList, newEntitySchemaList)
    
    this._entitySchemaList = newEntitySchemaList
    this.schemaFieldList = this._schemaFieldList.filter(({ entitySchemaId }) => !schemaIdDiff.includes(entitySchemaId))
    this.entityList = this._entityList.filter(({schemaId}) => !schemaIdDiff.includes(schemaId))
  }

  public set schemaFieldList(newSchemaFieldList: SchemaFieldType[]) {
    const fieldIdDiff = this.getEntityIdDiff(this._schemaFieldList, newSchemaFieldList)
    this._schemaFieldList = newSchemaFieldList
    this.fieldValueList = this._fieldValueList.filter(({schemaFieldId}) => !fieldIdDiff.includes(schemaFieldId))
  }

  public set entityList(newEntityList: EntityType[]) {
    const entityIdDiff = this.getEntityIdDiff(this._entityList, newEntityList)
    this._entityList = newEntityList
    this.fieldValueList = this._fieldValueList.filter(({ entityId }) => !entityIdDiff.includes(entityId))
  }

  public set fieldValueList(newFieldValueList: FieldValueType[]) {
    this._fieldValueList = newFieldValueList
  }

  //#endregion

  private getEntityIdDiff(first: Indexable[], second: Indexable[]) {
    return this.getArrayDiff(
      first.map(({ id }) => id),
      second.map(({ id }) => id)
    )
  }

  private getArrayDiff(first: string[], second: string[]): string[] {
    return first.filter(el => !second.includes(el))
  }
}

let baseRepository: BaseRepository | null = null 

export const getBaseRepository = () => {
  if (!baseRepository) {
    baseRepository = new BaseRepository()
  }
  return baseRepository
}