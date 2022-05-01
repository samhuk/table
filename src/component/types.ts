export type Rendered = { element: HTMLElement }

export enum ColumnType {
  NUMBER,
  BOOLEAN,
  STRING,
  DATE,
  CUSTOM
}

export type ColumnTypeToDataTypeMap = {
  [ColumnType.NUMBER]: number
  [ColumnType.BOOLEAN]: boolean
  [ColumnType.STRING]: string
  [ColumnType.DATE]: Date
  [ColumnType.CUSTOM]: any
}

type CustomCellRendererOptions<TType extends ColumnType = ColumnType> = {
  rendered: Rendered
  rowData: RowData
  value: ColumnTypeToDataTypeMap[TType]
  defaultRender: () => void
  onValueChange: (newValue: ColumnTypeToDataTypeMap[TType]) => void
}

export type CustomCellRendererOutput<TType extends ColumnType> = {
  updateValue: (newValue: ColumnTypeToDataTypeMap[TType]) => void
}

export type CustomCellRenderer<TType extends ColumnType>= (
  options: CustomCellRendererOptions<TType>
) => null | undefined | CustomCellRendererOutput<TType>

type CustomRowRendererOptions = {
  rendered: Rendered
  rowData: RowData
}

export type CustomRowRendererWithoutDependencies = (options: CustomRowRendererOptions) => void

export type CustomRowRendererWithDependencies = {
  renderer: (options: CustomRowRendererOptions) => void
  dependsOnFields: string | string[]
}

export type CustomRowRenderer = CustomRowRendererWithoutDependencies | CustomRowRendererWithDependencies

export type RowData<TData = any> = {
  uuid: string
} & TData

export type NoDataRow = {
  rendered: Rendered
  updateColSpan: (count: number) => void
  updateContent: (content: string | HTMLElement) => void
}

type CustomHeaderCellRendererOptions = {
  rendered: Rendered
  rows: Rows
}

export type CustomHeaderCellRenderer = (options: CustomHeaderCellRendererOptions) => void

export type ColumnOptions<TType extends ColumnType = ColumnType, TData = any> = {
  fieldName: string
  displayName?: string
  initialWidthPx?: number
  type?: TType
  customCellRenderers?: CustomCellRenderer<TType>[]
  customHeaderCellRenderers?: CustomHeaderCellRenderer[]
  disableDefaultCellRendering?: boolean | ((rowData: RowData<TData>) => boolean)
  disableDefaultHeaderCellRendering?: boolean
  filterable?: boolean
  resizable?: boolean
  sortable?: boolean
  setCellValueAsTitle?: boolean
  textAlignment?: 'left'|'center'|'right'
  dataCellContentWidthMeasurer?: number | ((value: ColumnTypeToDataTypeMap[TType]) => number)
  headerCellContentWidthMeasurer?: number | (() => number)
}

export type ColumnOptionsDict = { [fieldName: string]: ColumnOptions }

export type RowValueChangeEvent<TType extends ColumnType = ColumnType> = {
  fieldName: string
  newValue: ColumnTypeToDataTypeMap[TType]
}

export enum Sorting {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none'
}

export type CellValueChangeEvent<TType extends ColumnType = ColumnType> = {
  newValue: ColumnTypeToDataTypeMap[TType]
}

export type CellOptions<TType extends ColumnType = ColumnType, TData = any> = {
  columnOptions: ColumnOptions
  rowData: RowData<TData>
  value: ColumnTypeToDataTypeMap[TType]
  events?: {
    onValueChange?: (e: CellValueChangeEvent<TType>) => void
  }
}

export type Cell<TType extends ColumnType = ColumnType> = {
  rendered: Rendered
  value: ColumnTypeToDataTypeMap[TType]
  updateValue: (newValue: ColumnTypeToDataTypeMap[TType]) => void
  measureContentWidth: () => number
}

export type RowOptions<TData = any> = {
  columnOrdering: string[]
  columnOptionsDict: ColumnOptionsDict
  rowData: RowData<TData>
  customRowRenderersWithoutDependencies: CustomRowRendererWithoutDependencies[]
  customRowRenderersWithDependencies: CustomRowRendererWithDependencies[]
  fieldNameToCustomRowRenderersWithDependenciesMap: { [fieldName: string]: CustomRowRendererWithDependencies[] }
  listenForClick: boolean
  events?: {
    onValueChange?: (e: RowValueChangeEvent) => void
    onClick?: () => void
  }
}

export type Row<TData = any> = {
  rendered: Rendered
  rowData: RowData<TData>
  updateCellData: (fieldName: string, newValue: any) => void
  measureCellContentWidth: (fieldName: string) => number
}

export type HeaderCellSortingChangeEvent = {
  newSorting: Sorting
}

export type HeaderCellResizeEvent = {
  newWidthPx: number
}

export type HeaderCellOptions = {
  columnOptions: ColumnOptions
  sorting: Sorting
  rows: Rows
  events?: {
    onSortingChange: (e: HeaderCellSortingChangeEvent) => void
    onFilterButtonClick?: () => void
    onResize?: (e: HeaderCellResizeEvent) => void
    onResizeEnd?: (e: HeaderCellResizeEvent) => void
    onResizerDoubleClick?: () => void
  },
}

export type HeaderCell = {
  rendered: Rendered
  sorting: Sorting
  setWidth: (newWidthPx: number) => void
  updateSorting: (newSorting: Sorting) => void
  measureContentWidth: () => number
}

export type HeaderRowSortingChangeEvent = {
  fieldNameCausingChange: string
  newFieldSortingList: FieldSorting[]
}

export type FilterButtonClickEvent = {
  fieldName: string
}

export type HeaderRowColumnResizeEvent = {
  fieldName: string
  newWidthPx: number
}

export type HeaderRowColumnResizerDoubleClickEvent = {
  fieldName: string
}

export type FieldSorting = {
  fieldName: string
  sorting: Sorting
}

export type HeaderRowOptions = {
  columnOrdering: string[]
  columnOptionsDict: ColumnOptionsDict
  rows: Rows
  fieldSortingList: FieldSorting[]
  maxSortings?: number
  events?: {
    onSortingChange?: (e: HeaderRowSortingChangeEvent) => void
    onFilterButtonClick?: (e: FilterButtonClickEvent) => void
    onColumnResize?: (e: HeaderRowColumnResizeEvent) => void
    onColumnResizeEnd?: (e: HeaderRowColumnResizeEvent) => void
    onColumnResizerDoubleClick?: (e: HeaderRowColumnResizerDoubleClickEvent) => void
  },
}

export type HeaderRow = {
  rendered: Rendered
  fieldSortingList: FieldSorting[]
  scrollX: (positionPx: number) => void
  updateColumnWidth: (fieldName: string, newWidthPx: number) => void
  updateSorting: (fieldName: string, newSorting: Sorting) => void
  measureCellContentWidth: (fieldName: string) => number
}

export type RowsValueChangeEvent<TType extends ColumnType = ColumnType> = {
  rowUuid: string
  fieldName: string
  newValue: ColumnTypeToDataTypeMap[TType]
}

export type RowsRowCountChangeEvent = {
  newRowCount: number
}

export type RowClickEvent = {
  rowUuid: string
}

export type RowsOptions<TData = any> = {
  columnOrdering: string[]
  columnOptionsDict: ColumnOptionsDict
  customRowRenderers?: CustomRowRenderer[]
  initialData?: RowData<TData>[]
  footerRowOptions?: FooterRowOptions
  groupingOptions?: GroupingOptions
  listenForDataRowClick: boolean
  events?: {
    onValueChange?: (e: RowsValueChangeEvent) => void
    onRowCountChange?: (e: RowsRowCountChangeEvent) => void
    onRowClick?: (e: RowClickEvent) => void
  }
}

export type Rows<TData = any> = {
  rendered: Rendered & { table: HTMLElement }
  rowsDict: { [rowUuid: string]: Row }
  rowCount: number
  rowDataList: RowData<TData>[]
  updateColumnWidth: (fieldName: string, newWidthPx: number) => void
  updateTableData: (newRowDataList: RowData<TData>[]) => void
  updateRowData: (newRowData: RowData<TData>) => void
  addRow: (rowData: RowData<TData>) => void
  addRowBefore: (rowData: RowData<TData>, preceedingRowUuid: string) => void
  removeRow: (rowUuid: string) => void
  updateCellData: (rowUuid: string, fieldName: string, newValue: any) => void
  measureColumnContentWidths: (fieldName: string) => number[]
}

export type TableAppearanceOptions = {
  showHorizontalGridLines?: boolean
  showVerticalGridLines?: boolean
  showEvenRowHighlight?: boolean
  showHeaderRowBorder?: boolean
  showHeaderRowDataRowsSeparationBorder?: boolean
  showDataRowsBorder?: boolean
  showRowHoverHighlight?: boolean
  showPointerCursorForDataRowHover?: boolean
}

export type FooterRow = FooterRowRendererOutput & {
  element: HTMLElement
}

export type FooterRowRendererOutput<TData = any> = {
  updateOnDataChange: (rowDataList: RowData<TData>[]) => void
  updateOnColumnOrderChange: (fieldName: string, fromIndex: number, toIndex: number) => void
}

export type FooterRowRendererOptions<TData = any> = {
  rowElement: HTMLElement
  rowDataList: RowData<TData>[]
}

export type FooterRowRenderer = (options: FooterRowRendererOptions) => FooterRowRendererOutput

export type FooterRowOptions = {
  footerRowRenderer: FooterRowRenderer
  hideOnNoData?: boolean
}

export type GroupHeaderRowRendererOptions = {
  groupName: string
  element: HTMLElement
}

export type GroupHeaderRowRenderer = (options: GroupHeaderRowRendererOptions) => void

export type GroupingOptions = {
  groupNameFieldName: string
  addGroupNameToRowElementClassList?: boolean
  groupHeaderRowRenderer: GroupHeaderRowRenderer
}

export type TableOptions<TData = any> = {
  columnOrdering: string[]
  columnOptionsDict: ColumnOptionsDict
  customRowRenderers?: CustomRowRenderer[]
  initialData?: RowData<TData>[]
  defaultNoDataMessage?: string
  appearance?: TableAppearanceOptions
  groupingOptions?: GroupingOptions
  footerRowOptions?: FooterRowOptions
  maxSortings?: number
  initialFieldSortingList?: FieldSorting[]
  events?: {
    onValueChange?: (e: RowsValueChangeEvent) => void
    // TODO
    // onColumnReorder?: (e: ColumnReorderEvent) => void
    onSortingChange?: (e: HeaderRowSortingChangeEvent) => void
    onRowCountChange?: (e: RowsRowCountChangeEvent) => void
    onRowClick?: (e: RowClickEvent) => void
    onFilterButtonClick?: (e: FilterButtonClickEvent) => void
    onColumnResizeEnd?: (e: HeaderRowColumnResizeEvent) => void
  }
}

export type Table<TData = any> = {
  rendered: Rendered
  rowCount: number
  fieldSortingList: FieldSorting[]
  doesRowUuidExist: (rowUuid: string) => boolean
  getRowDataList: () => RowData<TData>[]
  updateColumnWidth: (fieldName: string, newWidthPx: number) => void
  updateColumnVisibility: (fieldName: string, visibility: boolean) => void
  updateTableData: (newRowDataList: RowData<TData>[]) => void
  updateRowData: (newRowData: RowData<TData>) => void
  addRow: (rowData: RowData<TData>) => void
  addRowBefore: (rowData: RowData<TData>, proceedingRowUuid: string) => void
  removeRow: (rowUuid: string) => void
  updateCellData: (rowUuid: string, fieldName: string, newValue: any) => void
}
