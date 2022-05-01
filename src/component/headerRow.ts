import { removeAtIndex, removeLastEntry } from './helpers/array'
import { createHeaderCell } from './headerCell'
import { FieldSorting, HeaderCell, HeaderRow, HeaderRowOptions, Sorting } from './types'

const updateFieldSortingList = (
  fieldSortingList: FieldSorting[],
  fieldName: string,
  newSorting: Sorting,
  maxSortings: number
): { removedFieldSorting?: FieldSorting } => {
  // Find existing field sorting entry and remove it, if it does exists
  removeAtIndex(fieldSortingList, fs => fs.fieldName === fieldName)

  // If new sorting is not NONE and add new sorting to start of list as "highest priority" sorting
  if (newSorting !== Sorting.NONE)
    fieldSortingList.unshift({ fieldName, sorting: newSorting })

  // If the field sorting list is now exceeding the max sortings, remove it and return the removed sorting
  if (fieldSortingList.length > maxSortings) {
    return { removedFieldSorting: removeLastEntry(fieldSortingList) }
  }

  return { }
}

export const createHeaderRow = (options: HeaderRowOptions): HeaderRow => {
  let headerRow: HeaderRow
  const maxSortings = options.maxSortings ?? 3
  const element = document.createElement('div')
  element.classList.add('com-table__header')

  const cellDict: { [fieldName: string]: HeaderCell } = {}
  options.columnOrdering.forEach(fieldName => {
    const sorting = options.fieldSortingList?.find(fs => fs.fieldName === fieldName)?.sorting
    const cell = createHeaderCell({
      columnOptions: options.columnOptionsDict[fieldName],
      rows: options.rows,
      sorting,
      events: {
        onSortingChange: e => {
          const result = updateFieldSortingList(headerRow.fieldSortingList, fieldName, e.newSorting, maxSortings)
          cellDict[result?.removedFieldSorting?.fieldName]?.updateSorting(Sorting.NONE)
          options.events?.onSortingChange?.({
            fieldNameCausingChange: fieldName,
            newFieldSortingList: headerRow.fieldSortingList,
          })
        },
        onFilterButtonClick: () => options.events?.onFilterButtonClick?.({ fieldName }),
        onResize: e => options.events?.onColumnResize?.({ fieldName, newWidthPx: e.newWidthPx }),
        onResizeEnd: e => options.events?.onColumnResizeEnd?.({ fieldName, newWidthPx: e.newWidthPx }),
        onResizerDoubleClick: () => options.events?.onColumnResizerDoubleClick?.({ fieldName }),
      },
    })
    cellDict[fieldName] = cell
    element.appendChild(cell.rendered.element)
  })

  return headerRow = {
    rendered: { element },
    fieldSortingList: options.fieldSortingList ?? [],
    scrollX: positionPx => element.style.marginLeft = `-${positionPx}px`,
    updateColumnWidth: (fieldName: string, newWidthPx: number) => cellDict[fieldName].setWidth(newWidthPx),
    updateSorting: (fieldName, newSorting) => cellDict[fieldName].updateSorting(newSorting),
    measureCellContentWidth: fieldName => cellDict[fieldName].measureContentWidth(),
  }
}
