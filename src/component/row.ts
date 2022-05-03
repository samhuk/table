import { addDragResistantClickListener } from 'drag-resistant-click-listener'
import { Rendered } from './types'
import { createCell } from './cell'
import { Cell, ColumnOptionsDict, Row, RowData, RowOptions, RowValueChangeEvent } from './types'

const createCells = (options: {
  rendered: Rendered
  columnOrdering: string[]
  columnOptionsDict: ColumnOptionsDict
  rowData: RowData
  onValueChange: (e: RowValueChangeEvent) => void
}) => {
  const cellsDict: { [fieldName: string]: Cell } = {}

  options.columnOrdering.forEach(fieldName => {
    const cell = createCell({
      columnOptions: options.columnOptionsDict[fieldName],
      rowData: options.rowData,
      value: options.rowData[fieldName],
      events: {
        onValueChange: e => options.onValueChange({ fieldName, newValue: e.newValue }),
      },
    })
    cellsDict[fieldName] = cell
    options.rendered.element.appendChild(cell.rendered.element)
  })

  return cellsDict
}

export const createRow = (options: RowOptions): Row => {
  const element = document.createElement('tr')
  const rendered: Rendered = { element }
  element.setAttribute('row-uuid', options.rowData.uuid)
  element.classList.add('com-table__data-row')

  const rowData = options.rowData

  const onValueChange = (e: RowValueChangeEvent) => {
    // eslint-disable-next-line no-param-reassign
    options.rowData[e.fieldName] = e.newValue
    options.fieldNameToCustomRowRenderersWithDependenciesMap[e.fieldName]?.forEach(renderer => renderer.renderer({
      rendered,
      rowData,
    }))
    options?.events?.onValueChange?.(e)
  }

  const cellsDict = createCells({
    rendered,
    columnOptionsDict: options.columnOptionsDict,
    columnOrdering: options.columnOrdering,
    rowData,
    onValueChange,
  })

  options.customRowRenderersWithoutDependencies.forEach(renderer => renderer({
    rendered,
    rowData,
  }))

  options.customRowRenderersWithDependencies.forEach(renderer => renderer.renderer({
    rendered,
    rowData,
  }))

  if (options.listenForClick) {
    addDragResistantClickListener({
      element,
      onClick: options.events?.onClick,
    })
  }

  const row: Row = {
    rendered: { element },
    rowData,
    updateCellValue: (fieldName: string, newValue: any) => {
      rowData[fieldName] = newValue
      cellsDict[fieldName].updateValue(newValue)
    },
    measureCellContentWidth: fieldName => cellsDict[fieldName].measureContentWidth(),
  }
  return row
}
