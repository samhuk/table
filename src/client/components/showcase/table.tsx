import React from 'react'
import { SELECTION_CHECKBOX_COLUMN_OPTIONS } from '../../../component/columnOptionsPresets'
import { ColumnType, Table, TableOptions } from '../../../component/types'
import TableComponent from '../common/generic/table'
import ItemBase from './itemBase'

const createTestData = (rowCount: number) => {
  const items = []

  for (let i = 0; i < rowCount; i += 1) {
    const rand = Math.random()

    items.push({
      uuid: Math.random().toString(),
      field1: `${Math.random()}${Math.random()}`,
      field2: rand < 0.3
        ? 'A'
        : rand < 0.6
          ? 'B'
          : rand < 0.9
            ? 'C'
            : 'D',
      field3: Math.round(Math.random() * 10),
      field4: Math.random() > 0.5,
    })
  }

  return items
}

const TABLE_OPTIONS: TableOptions = {
  columnOptionsDict: {
    selected: SELECTION_CHECKBOX_COLUMN_OPTIONS,
    field1: {
      fieldName: 'field1',
      displayName: 'Field 123094823094823094238490380',
      filterable: true,
      resizable: true,
      sortable: true,
      type: ColumnType.STRING,
    },
    field2: {
      fieldName: 'field2',
      displayName: 'Field 2',
      filterable: true,
      resizable: true,
      sortable: true,
      type: ColumnType.STRING,
    },
    field3: {
      fieldName: 'field3',
      displayName: 'Field 3',
      filterable: true,
      resizable: true,
      sortable: true,
      type: ColumnType.STRING,
    },
    field4: {
      fieldName: 'field4',
      displayName: 'Field 4',
      filterable: true,
      resizable: true,
      sortable: true,
      type: ColumnType.BOOLEAN,
    },
  },
  customRowRenderers: [
    {
      dependsOnFields: 'selected',
      renderer: options => {
        if (options.rowData.selected)
          options.rendered.element.classList.add('selected')
        else
          options.rendered.element.classList.remove('selected')
      },
    },
  ],
  columnOrdering: ['selected', 'field1', 'field2', 'field3', 'field4'],
  initialData: createTestData(5),
  groupingOptions: {
    groupNameFieldName: 'field2',
    groupHeaderRowRenderer: options => {
      options.element.textContent = options.groupName
    },
  },
  defaultNoDataMessage: 'There is no data to display',
  footerRowOptions: {
    hideOnNoData: true,
    footerRowRenderer: options => {
      const spacerCell3 = document.createElement('td')
      spacerCell3.setAttribute('colspan', '2')
      const spacerCell1 = document.createElement('td')
      spacerCell1.setAttribute('colspan', '1')
      const nameCell = document.createElement('td')
      nameCell.textContent = 'Field 3 Sum:'
      nameCell.classList.add('footer-row-name-cell')
      const dataCell = document.createElement('td')
      dataCell.classList.add('footer-row-data-cell')
      let sum = 0
      options.rowDataList.forEach(r => sum += r.field3)
      dataCell.textContent = sum.toString()
      options.rowElement.appendChild(spacerCell3)
      options.rowElement.appendChild(nameCell)
      options.rowElement.appendChild(dataCell)
      options.rowElement.appendChild(spacerCell1)

      return {
        updateOnColumnOrderChange: undefined,
        updateOnDataChange: rowDataList => {
          sum = 0
          rowDataList.forEach(r => sum += r.field3)
          dataCell.textContent = sum.toString()
        },
      }
    },
  },
  appearance: {
  },
  events: {
    onValueChange: e => console.log(e.rowUuid, e.fieldName, e.newValue),
    onSortingChange: e => console.log(e),
    onRowClick: e => console.log(e),
    onFilterButtonClick: e => console.log(e),
  },
}

const Operations = (props: { component: Table }) => (
  <>
    <button
      type="button"
      className="button--white"
      onClick={() => props.component.addRow(createTestData(1)[0])}
    >
      Add new row
    </button>
  </>
)

export const render = () => (
  <ItemBase component={TableComponent} componentOptions={TABLE_OPTIONS} operationsComponent={Operations} />
)

export default render
