import { createHeaderRow } from './headerRow'
import { createNoDataRow } from './noDataRow'
import { createRows } from './rows'
import { Rows, Table, TableAppearanceOptions, TableOptions } from './types'

const applyAppearanceOptions = (element: HTMLElement, appearanceOptions: TableAppearanceOptions) => {
  if (appearanceOptions?.showEvenRowHighlight ?? true)
    element.classList.add('show-even-row-highlight')
  if (appearanceOptions?.showHorizontalGridLines ?? true)
    element.classList.add('show-horizontal-grid-lines')
  if (appearanceOptions?.showVerticalGridLines ?? true)
    element.classList.add('show-vertical-grid-lines')
  if (appearanceOptions?.showHeaderRowBorder ?? true)
    element.classList.add('show-header-row-border')
  if (appearanceOptions?.showDataRowsBorder ?? true)
    element.classList.add('show-data-rows-border')
  if (appearanceOptions?.showHeaderRowDataRowsSeparationBorder ?? true)
    element.classList.add('show-header-row-data-rows-separation-border')
  if (appearanceOptions?.showRowHoverHighlight ?? true)
    element.classList.add('show-row-hover-highlight')
  if (appearanceOptions?.showPointerCursorForDataRowHover ?? false)
    element.classList.add('show-pointer-cursor-for-data-row-hover')
}

export const createTable = <TData = any>(options: TableOptions<TData>): Table<TData> => {
  let table: Table
  const initialFieldSortingList = options.initialFieldSortingList ?? []
  const element = document.createElement('div')
  element.classList.add('com-table')

  let rows: Rows

  const noDataRow = createNoDataRow(options.defaultNoDataMessage)
  const updateNoDataRow = (rowCount: number) => {
    noDataRow.updateColSpan(options.columnOrdering.length)
    if (rowCount == null || rowCount === 0) {
      rows.rendered.table.appendChild(noDataRow.rendered.element)
      element.classList.add('no-data')
    }
    else {
      element.classList.remove('no-data')
      if (noDataRow.rendered.element.parentElement === rows.rendered.table)
        rows.rendered.table.removeChild(noDataRow.rendered.element)
    }
  }

  rows = createRows({
    columnOptionsDict: options.columnOptionsDict,
    columnOrdering: options.columnOrdering,
    customRowRenderers: options.customRowRenderers,
    initialData: options.initialData,
    footerRowOptions: options.footerRowOptions,
    listenForDataRowClick: options.events?.onRowClick != null,
    groupingOptions: options.groupingOptions,
    events: {
      onValueChange: e => options.events?.onValueChange?.(e),
      onRowCountChange: e => {
        table.rowCount = e.newRowCount
        options.events?.onRowCountChange?.(e)
        updateNoDataRow(e.newRowCount)
      },
      onRowClick: options.events?.onRowClick,
    },
  })

  const headerRow = createHeaderRow({
    columnOptionsDict: options.columnOptionsDict,
    columnOrdering: options.columnOrdering,
    rows,
    fieldSortingList: initialFieldSortingList,
    maxSortings: options.maxSortings,
    events: {
      onSortingChange: e => {
        options.events?.onSortingChange(e)
        table.fieldSortingList = e.newFieldSortingList
      },
      onFilterButtonClick: options.events?.onFilterButtonClick,
      onColumnResize: e => rows.updateColumnWidth(e.fieldName, e.newWidthPx),
      onColumnResizeEnd: e => {
        rows.updateColumnWidth(e.fieldName, e.newWidthPx)
        options.events?.onColumnResizeEnd?.(e)
      },
      onColumnResizerDoubleClick: e => {
        const headerCellWidth = headerRow.measureCellContentWidth(e.fieldName)
          + (options.columnOptionsDict[e.fieldName].resizable ? 50 : 35)
        const dataCellsWidths = rows.measureColumnContentWidths(e.fieldName)
        const maxDataCellsWidth = Math.max(...dataCellsWidths) + 5
        const maxWidth = Math.max(headerCellWidth, maxDataCellsWidth)

        headerRow.updateColumnWidth(e.fieldName, maxWidth)
        rows.updateColumnWidth(e.fieldName, maxWidth)
      },
    },
  })

  element.appendChild(headerRow.rendered.element)
  element.appendChild(rows.rendered.element)

  rows.rendered.element.addEventListener('scroll', e => headerRow.scrollX((e.target as HTMLElement).scrollLeft))

  applyAppearanceOptions(element, options.appearance)

  updateNoDataRow(options.initialData?.length)

  table = {
    rendered: { element },
    fieldSortingList: initialFieldSortingList,
    rowCount: options.initialData?.length ?? 0,
    doesRowUuidExist: rowUuid => table.getRowDataList().some(rd => rd.uuid === rowUuid),
    getRowDataList: () => rows.rowDataList,
    updateColumnWidth: (fieldName, newWidthPx) => {
      headerRow.updateColumnWidth(fieldName, newWidthPx)
      rows.updateColumnWidth(fieldName, newWidthPx)
    },
    addRowBefore: rows.addRowBefore,
    addRow: rows.addRow,
    removeRow: rows.removeRow,
    updateRowData: rows.updateRowData,
    updateTableData: rows.updateTableData,
    updateCellValue: rows.updateCellValue,
  }
  return table
}
