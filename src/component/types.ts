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
  updateCellValue: (fieldName: string, newValue: any) => void
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
  updateCellValue: (rowUuid: string, fieldName: string, newValue: any) => void
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
  /**
   * Called whenever the data of the table changes.
   */
  updateOnDataChange: (rowDataList: RowData<TData>[]) => void
}

export type FooterRowRendererOptions<TData = any> = {
  /**
   * The element of the footer row the render contents into.
   */
  rowElement: HTMLElement
  /**
   * The current data of the table.
   */
  rowDataList: RowData<TData>[]
}

export type FooterRowRenderer = (options: FooterRowRendererOptions) => FooterRowRendererOutput

/**
 * Options for customizing the behavior of the footer row.
 */
export type FooterRowOptions = {
  /**
   * function that renders the footer row.
   */
  footerRowRenderer: FooterRowRenderer
  /**
   * If true, the footer row will be hidden when the table has no data (row count is zero).
   */
  hideOnNoData?: boolean
}

export type GroupHeaderRowRendererOptions = {
  /**
   * The name of the group. This is the value of the field for the group.
   */
  groupName: string
  /**
   * The element of the group header row.
   */
  element: HTMLElement
}

export type GroupHeaderRowRenderer = (options: GroupHeaderRowRendererOptions) => void

/**
 * Options that describe how data will be grouped.
 */
export type GroupingOptions = {
  /**
   * Field that is used to group the data by.
   */
  groupNameFieldName: string
  /**
   * Function that renders the group header row, which is inserted at the start
   * of each group. Group header rows are dynamically added and removed as rows
   * are added and removed.
   */
  groupHeaderRowRenderer: GroupHeaderRowRenderer
}

/**
 * Options for the creation of a Table
 */
export type TableOptions<TData = any> = {
  /**
   * Array of the field names that controls the ordering of the columns.
   */
  columnOrdering: string[]
  /**
   * A dictionary that maps each field name to the field's column options.
   */
  columnOptionsDict: ColumnOptionsDict
  /**
   * Array of functions that customizes each row element. The function can optionally depend on the
   * change in value of one or more fields.
   */
  customRowRenderers?: CustomRowRenderer[]
  /**
   * The initial data to use for the table.
   */
  initialData?: RowData<TData>[]
  /**
   * The default text to display when the table has no data to display.
   */
  defaultNoDataMessage?: string
  /**
   * Various options that customizes the overall appearance of the table.
   */
  appearance?: TableAppearanceOptions
  /**
   * Optional options for grouping the data by a particular field.
   */
  groupingOptions?: GroupingOptions
  /**
   * Optional options for the footer row.
   */
  footerRowOptions?: FooterRowOptions
  /**
   * The maximum number of column sortings the table can have. Default: 3
   */
  maxSortings?: number
  /**
   * The initial field sorting list to use.
   */
  initialFieldSortingList?: FieldSorting[]
  /**
   * The various event handlers that can be provided.
   */
  events?: {
    /**
     * Called when the value of a particular cell changes.
     */
    onValueChange?: (e: RowsValueChangeEvent) => void
    /**
     * Called when the field sorting of the table changes.
     */
    onSortingChange?: (e: HeaderRowSortingChangeEvent) => void
    /**
     * Called whenever the row count of the table changes.
     */
    onRowCountChange?: (e: RowsRowCountChangeEvent) => void
    /**
     * Called when a row is clicked (and not dragged).
     */
    onRowClick?: (e: RowClickEvent) => void
    /**
     * Called when the filter button for a particular column is clicked.
     */
    onFilterButtonClick?: (e: FilterButtonClickEvent) => void
    /**
     * Called when a column has been resized (dragged to a new width).
     */
    onColumnResizeEnd?: (e: HeaderRowColumnResizeEvent) => void
  }
}

/**
 * A table component that displays an array of data as rows and columns.
 */
export type Table<TData = any> = {
  /**
   * The rendered elements of the table.
   */
  rendered: Rendered
  /**
   * The current row count of the table.
   */
  rowCount: number
  /**
   * The current field sorting list of the table.
   */
  fieldSortingList: FieldSorting[]
  /**
   * Checks whether a row with the given uuid exists in the table.
   */
  doesRowUuidExist: (rowUuid: string) => boolean
  /**
   * Gets the current row data list.
   */
  getRowDataList: () => RowData<TData>[]
  /**
   * Updates the width of a column.
   */
  updateColumnWidth: (fieldName: string, newWidthPx: number) => void
  /**
   * Updates the loaded data in the table.
   */
  updateTableData: (newRowDataList: RowData<TData>[]) => void
  /**
   * Updates the data for a single row.
   */
  updateRowData: (newRowData: RowData<TData>) => void
  /**
   * Adds a new row (at the end of the table).
   */
  addRow: (rowData: RowData<TData>) => void
  /**
   * Adds a new row before the specified row.
   */
  addRowBefore: (rowData: RowData<TData>, proceedingRowUuid: string) => void
  /**
   * Removes a row with the given uuid.
   */
  removeRow: (rowUuid: string) => void
  /**
   * Updates the value for the cell of the given field and row uuid.
   */
  updateCellValue: (rowUuid: string, fieldName: string, newValue: any) => void
}
