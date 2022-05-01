import { pushIfNotExists } from './helpers/array'
import { pushToArrayOfPropertyName } from './helpers/dict'
import { createRow } from './row'
import {
  ColumnOptionsDict,
  CustomRowRenderer,
  CustomRowRendererWithDependencies,
  CustomRowRendererWithoutDependencies,
  FooterRow,
  GroupHeaderRowRenderer,
  GroupingOptions,
  Row,
  RowClickEvent,
  RowData,
  Rows,
  RowsOptions,
  RowsValueChangeEvent,
} from './types'

type DataGrouping = {
  groupToRowUuidsDict: { [groupName: string]: string[] },
  groupOrdering: string[]
  groupToHeaderRowElementDict: { [groupName: string]: HTMLElement }
  removeGroupHeaderElements: () => void
  removeRow: (rowUuid: string) => { wasGroupRemoved: boolean }
  addRow: (rowData: RowData) => { wasGroupCreated: boolean, groupName: string, proceeding: string, proceedingType: 'group'|'row' }
  addRowBefore: (rowData: RowData, proceedingRowUuid: string) => void
}

type CustomRowRendererInfo = {
  fieldNameToCustomRowRenderersWithDependenciesMap: { [fieldName: string]: CustomRowRendererWithDependencies[] }
  customRowRenderersWithoutDependencies: CustomRowRendererWithoutDependencies[]
  customRowRenderersWithDependencies: CustomRowRendererWithDependencies[]
}

const createDataRows = (options: {
  tableElement: HTMLElement
  columnOptionsDict: ColumnOptionsDict
  columnOrdering: string[]
  rowDataList: RowData[]
  fieldNameToCustomRowRenderersWithDependenciesMap: { [fieldName: string]: CustomRowRendererWithDependencies[] }
  customRowRenderersWithoutDependencies: CustomRowRendererWithoutDependencies[]
  customRowRenderersWithDependencies: CustomRowRendererWithDependencies[]
  listenForRowClick: boolean
  dataGrouping: DataGrouping
  onValueChange: (e: RowsValueChangeEvent) => void
  onRowClick: (e: RowClickEvent) => void
}): { [rowUuid: string]: Row } => {
  const rowsDict: { [rowUuid: string]: Row } = {}
  options.rowDataList?.forEach(rowData => {
    const row = createRow({
      rowData,
      columnOptionsDict: options.columnOptionsDict,
      columnOrdering: options.columnOrdering,
      customRowRenderersWithDependencies: options.customRowRenderersWithDependencies,
      customRowRenderersWithoutDependencies: options.customRowRenderersWithoutDependencies,
      fieldNameToCustomRowRenderersWithDependenciesMap: options.fieldNameToCustomRowRenderersWithDependenciesMap,
      listenForClick: options.listenForRowClick,
      events: {
        onValueChange: e => options.onValueChange({ rowUuid: rowData.uuid, fieldName: e.fieldName, newValue: e.newValue }),
        onClick: () => options.onRowClick({ rowUuid: rowData.uuid }),
      },
    })
    rowsDict[rowData.uuid] = row
  })
  return rowsDict
}

const createGroupRowHeaderElement = (groupName: string, columnOrdering: string[], renderer: GroupHeaderRowRenderer) => {
  const groupHeaderRowElement = document.createElement('tr')
  const cellElement = document.createElement('td')
  groupHeaderRowElement.appendChild(cellElement)
  groupHeaderRowElement.classList.add('com-table__group-header-row')
  cellElement.setAttribute('colspan', columnOrdering.length.toString())
  renderer({ groupName, element: cellElement })
  return groupHeaderRowElement
}

const createDataGrouping = (
  rowDataList: RowData[],
  groupingOptions: GroupingOptions,
  columnOrdering: string[],
): DataGrouping => {
  const groupToRowUuidsDict: { [groupName: string]: string[] } = {}
  const rowUuidToGroupNameDict: { [rowUuid: string]: string } = {}
  const groupOrdering: string[] = []
  const groupNameFieldName = groupingOptions.groupNameFieldName
  rowDataList?.forEach(rowData => {
    const groupName = rowData[groupNameFieldName]
    pushToArrayOfPropertyName(groupToRowUuidsDict, groupName, rowData.uuid)
    pushIfNotExists(groupOrdering, groupName)
    rowUuidToGroupNameDict[rowData.uuid] = groupName
  })

  let groupToHeaderRowElementDict: { [groupName: string]: HTMLElement }
  if (groupingOptions.groupHeaderRowRenderer != null) {
    groupToHeaderRowElementDict = {}
    groupOrdering.forEach(groupName => {
      groupToHeaderRowElementDict[groupName] = createGroupRowHeaderElement(groupName, columnOrdering, groupingOptions.groupHeaderRowRenderer)
    })
  }

  return {
    groupToRowUuidsDict,
    groupOrdering,
    groupToHeaderRowElementDict,
    removeGroupHeaderElements: () => {
      if (groupToHeaderRowElementDict != null)
        Object.values(groupToHeaderRowElementDict).forEach(el => el.remove())
    },
    removeRow: (rowUuid: string): { wasGroupRemoved: boolean } => {
      const groupName = rowUuidToGroupNameDict[rowUuid]
      const indexOfRowUuid = groupToRowUuidsDict[groupName].indexOf(rowUuid)
      groupToRowUuidsDict[groupName].splice(indexOfRowUuid, 1)
      delete rowUuidToGroupNameDict[rowUuid]
      if (groupToRowUuidsDict[groupName].length === 0) {
        delete groupToRowUuidsDict[groupName]
        const indexOfGroupName = groupOrdering.indexOf(groupName)
        groupOrdering.splice(indexOfGroupName, 1)
        groupToHeaderRowElementDict[groupName].remove()
        delete groupToHeaderRowElementDict[groupName]
        return { wasGroupRemoved: true }
      }

      return { wasGroupRemoved: false }
    },
    addRow: (rowData: RowData) => {
      const groupName = rowData[groupNameFieldName]
      let wasGroupCreated = false
      if (groupToRowUuidsDict[groupName] == null) {
        groupToRowUuidsDict[groupName] = []
        groupOrdering.push(groupName)
        if (groupToHeaderRowElementDict != null)
          groupToHeaderRowElementDict[groupName] = createGroupRowHeaderElement(groupName, columnOrdering, groupingOptions.groupHeaderRowRenderer)
        wasGroupCreated = true
      }
      groupToRowUuidsDict[groupName].push(rowData.uuid)
      rowUuidToGroupNameDict[rowData.uuid] = groupName

      const nextGroupName = groupOrdering[groupOrdering.indexOf(groupName) + 1]
      return {
        wasGroupCreated,
        groupName,
        proceeding: groupToHeaderRowElementDict != null
          ? nextGroupName
          : groupToRowUuidsDict[nextGroupName]?.[0],
        proceedingType: groupToHeaderRowElementDict != null ? 'group' : 'row',
      }
    },
    addRowBefore: (rowData: RowData, proceedingRowUuid: string) => {
      const groupName = rowData[groupNameFieldName]
      const indexOfProceedingRowUuid = groupToRowUuidsDict[groupName].indexOf(proceedingRowUuid)
      groupToRowUuidsDict[groupName].splice(indexOfProceedingRowUuid, 0, rowData.uuid)
      rowUuidToGroupNameDict[rowData.uuid] = groupName
    },
  }
}

const createFooterRow = (options: RowsOptions): FooterRow => {
  const rowElement = document.createElement('tr')
  rowElement.classList.add('com-table__footer-row')
  const footerRowRendererOutput = options.footerRowOptions.footerRowRenderer({
    rowDataList: options.initialData,
    rowElement,
  })

  return {
    element: rowElement,
    updateOnColumnOrderChange: footerRowRendererOutput.updateOnColumnOrderChange,
    updateOnDataChange: footerRowRendererOutput.updateOnDataChange,
  }
}

const createCustomRowRendererInfo = (customRowRenderers: CustomRowRenderer[]): CustomRowRendererInfo => {
  const fieldNameToCustomRowRenderersWithDependenciesMap: { [fieldName: string]: CustomRowRendererWithDependencies[] } = {}
  const customRowRenderersWithoutDependencies: CustomRowRendererWithoutDependencies[] = []
  const customRowRenderersWithDependencies: CustomRowRendererWithDependencies[] = []
  customRowRenderers?.forEach(renderer => {
    if (typeof renderer === 'function') {
      customRowRenderersWithoutDependencies.push(renderer)
    }
    else {
      customRowRenderersWithDependencies.push(renderer)
      if (typeof renderer.dependsOnFields === 'string') {
        fieldNameToCustomRowRenderersWithDependenciesMap[renderer.dependsOnFields] = [renderer]
      }
      else {
        renderer.dependsOnFields.forEach(fieldName => {
          if (fieldNameToCustomRowRenderersWithDependenciesMap[fieldName] == null)
            fieldNameToCustomRowRenderersWithDependenciesMap[fieldName] = []
          fieldNameToCustomRowRenderersWithDependenciesMap[fieldName].push(renderer)
        })
      }
    }
  })

  return {
    fieldNameToCustomRowRenderersWithDependenciesMap,
    customRowRenderersWithoutDependencies,
    customRowRenderersWithDependencies,
  }
}

const createColGroup = (columnOrdering: string[], columnOptionsDict: ColumnOptionsDict) => {
  const element = document.createElement('colgroup')
  const colGroupCellsDict: { [fieldName: string]: HTMLElement } = {}
  columnOrdering.forEach(fieldName => {
    const columnOptions = columnOptionsDict[fieldName]
    const colElement = document.createElement('col')
    colElement.style.width = `${columnOptions.initialWidthPx ?? 150}px`
    colElement.style.textAlign = columnOptions.textAlignment ?? 'left'
    colGroupCellsDict[fieldName] = colElement
    element.appendChild(colElement)
  })

  return {
    element,
    colGroupCellsDict,
  }
}

const appendRowElements = (
  tableElement: HTMLElement,
  rowsDict: { [rowUuid: string]: Row },
  dataGrouping: DataGrouping,
  rowDataList: RowData[],
) => {
  if (dataGrouping != null) {
    dataGrouping.groupOrdering.forEach(groupName => {
      if (dataGrouping.groupToHeaderRowElementDict != null)
        tableElement.appendChild(dataGrouping.groupToHeaderRowElementDict[groupName])

      dataGrouping.groupToRowUuidsDict[groupName].forEach(rowUuid => {
        tableElement.appendChild(rowsDict[rowUuid].rendered.element)
      })
    })
  }
  else {
    rowDataList?.forEach(rowData => {
      tableElement.appendChild(rowsDict[rowData.uuid].rendered.element)
    })
  }
}

export const createRows = (options: RowsOptions): Rows => {
  let rows: Rows
  let footerRow: FooterRow
  let dataGrouping: DataGrouping

  // Top-level element (a wrapper for the <table> element)
  const element = document.createElement('div')
  element.classList.add('com-table__rows-wrapper')
  // table element
  const tableElement = document.createElement('table')
  element.appendChild(tableElement)

  // Create and add col group element
  const colGroup = createColGroup(options.columnOrdering, options.columnOptionsDict)
  tableElement.appendChild(colGroup.element)

  // Precalculate some useful info for custom row renderers
  const customRowRendererInfo = createCustomRowRendererInfo(options.customRowRenderers)

  // Optionally create grouping info if grouping options supplied
  if (options.groupingOptions != null)
    dataGrouping = createDataGrouping(options.initialData, options.groupingOptions, options.columnOrdering)

  const onCellValueChangeFromInsideCell = (e: RowsValueChangeEvent) => {
    const rowData = rows.rowDataList.find(r => r.uuid === e.rowUuid)
    rowData[e.fieldName] = e.newValue
    options.events?.onValueChange?.(e)
  }

  const _createDataRow = (rowData: RowData) => createRow({
    rowData,
    columnOptionsDict: options.columnOptionsDict,
    columnOrdering: options.columnOrdering,
    customRowRenderersWithDependencies: customRowRendererInfo.customRowRenderersWithDependencies,
    customRowRenderersWithoutDependencies: customRowRendererInfo.customRowRenderersWithoutDependencies,
    fieldNameToCustomRowRenderersWithDependenciesMap: customRowRendererInfo.fieldNameToCustomRowRenderersWithDependenciesMap,
    listenForClick: options.listenForDataRowClick,
    events: {
      onValueChange: e => onCellValueChangeFromInsideCell({
        rowUuid: rowData.uuid,
        fieldName: e.fieldName,
        newValue: e.newValue,
      }),
      onClick: () => options.events?.onRowClick({ rowUuid: rowData.uuid }),
    },
  })

  const _createDataRows = (_rowDataList: RowData[]) => createDataRows({
    tableElement,
    columnOptionsDict: options.columnOptionsDict,
    columnOrdering: options.columnOrdering,
    rowDataList: _rowDataList,
    customRowRenderersWithDependencies: customRowRendererInfo.customRowRenderersWithDependencies,
    customRowRenderersWithoutDependencies: customRowRendererInfo.customRowRenderersWithoutDependencies,
    fieldNameToCustomRowRenderersWithDependenciesMap: customRowRendererInfo.fieldNameToCustomRowRenderersWithDependenciesMap,
    listenForRowClick: options.listenForDataRowClick,
    dataGrouping,
    onValueChange: onCellValueChangeFromInsideCell,
    onRowClick: options.events?.onRowClick,
  })

  const onDataChange = () => {
    if (footerRow != null) {
      if (options.footerRowOptions.hideOnNoData ?? true)
        footerRow.element.style.display = rows.rowCount === 0 ? 'none' : ''
      footerRow.updateOnDataChange(rows.rowDataList)
    }
  }

  const onRowCountChange = () => {
    options.events?.onRowCountChange?.({ newRowCount: rows.rowCount })

    // Ensure the footer row is always below the data rows
    if (footerRow != null)
      tableElement.appendChild(footerRow.element)
  }

  const initialRowsDict = _createDataRows(options.initialData)

  appendRowElements(tableElement, initialRowsDict, dataGrouping, options.initialData)

  if (options.footerRowOptions != null) {
    footerRow = createFooterRow(options)
    tableElement.appendChild(footerRow.element)
  }

  rows = {
    rendered: { element, table: tableElement },
    rowsDict: initialRowsDict,
    rowCount: options.initialData?.length,
    rowDataList: options.initialData,
    updateColumnWidth: (fieldName, newWidthPx) => colGroup.colGroupCellsDict[fieldName].style.width = `${newWidthPx}px`,
    addRowBefore: (rowData, proceedingRowUuid) => {
      dataGrouping?.addRowBefore(rowData, proceedingRowUuid)
      const proceedingRow = rows.rowsDict[proceedingRowUuid]
      const row = _createDataRow(rowData)
      rows.rowsDict[rowData.uuid] = row
      tableElement.insertBefore(row.rendered.element, proceedingRow.rendered.element)
      const indexOfProceedingRowData = rows.rowDataList.findIndex(rd => rd.uuid === proceedingRowUuid)
      rows.rowDataList.splice(indexOfProceedingRowData - 1, 0, rowData)
      rows.rowCount = rows.rowDataList.length
      onRowCountChange()
      onDataChange()
    },
    addRow: rowData => {
      const row = _createDataRow(rowData)
      rows.rowsDict[rowData.uuid] = row
      rows.rowDataList.push(rowData)
      if (dataGrouping != null) {
        const info = dataGrouping.addRow(rowData)
        if (info.wasGroupCreated) {
          if (dataGrouping.groupToHeaderRowElementDict != null)
            tableElement.appendChild(dataGrouping.groupToHeaderRowElementDict[info.groupName])
          tableElement.appendChild(row.rendered.element)
        }
        else {
          const proceedingElement = info.proceedingType === 'group'
            ? dataGrouping.groupToHeaderRowElementDict[info.proceeding]
            : info.proceeding != null
              ? rows.rowsDict[info.proceeding].rendered.element
              : null
          tableElement.insertBefore(row.rendered.element, proceedingElement)
        }
      }
      else {
        tableElement.appendChild(row.rendered.element)
      }

      rows.rowCount = rows.rowDataList.length
      onRowCountChange()
      onDataChange()
    },
    removeRow: rowUuid => {
      dataGrouping?.removeRow(rowUuid)
      tableElement.removeChild(rows.rowsDict[rowUuid].rendered.element)
      delete rows.rowsDict[rowUuid]
      const indexOfRowData = rows.rowDataList.findIndex(rd => rd.uuid === rowUuid)
      rows.rowDataList.splice(indexOfRowData, 1)
      rows.rowCount = rows.rowDataList.length
      onRowCountChange()
      onDataChange()
    },
    updateTableData: newRowDataList => {
      // Remove all row elements
      Object.values(rows.rowsDict).forEach(row => row.rendered.element.remove())
      rows.rowDataList = newRowDataList ?? []
      rows.rowsDict = _createDataRows(rows.rowDataList)
      rows.rowCount = rows.rowDataList.length
      // Update data grouping
      if (options.groupingOptions != null) {
        dataGrouping.removeGroupHeaderElements()
        dataGrouping = createDataGrouping(rows.rowDataList, options.groupingOptions, options.columnOrdering)
      }
      // Append new row elements
      appendRowElements(tableElement, rows.rowsDict, dataGrouping, rows.rowDataList)
      onRowCountChange()
      onDataChange()
    },
    updateRowData: newRowData => {
      const row = rows.rowsDict[newRowData.uuid]
      const newRow = _createDataRow(newRowData)
      row.rendered.element.replaceWith(newRow.rendered.element)
      rows.rowsDict[newRowData.uuid] = newRow
      onDataChange()
    },
    updateCellData: (rowUuid, fieldName, newValue) => {
      rows.rowDataList.find(rowData => rowData.uuid === rowUuid)[fieldName] = newValue
      rows.rowsDict[rowUuid].updateCellData(fieldName, newValue)
      onDataChange()
    },
    measureColumnContentWidths: fieldName => Object.values(rows.rowsDict).map(r => r.measureCellContentWidth(fieldName)),
  }
  return rows
}
