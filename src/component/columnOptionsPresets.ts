import { ColumnOptions, ColumnType, CustomRowRenderer } from './types'

export const SELECTION_CHECKBOX_COLUMN_OPTIONS: ColumnOptions<ColumnType.BOOLEAN> = {
  fieldName: 'selected',
  displayName: null,
  filterable: false,
  resizable: false,
  sortable: false,
  type: ColumnType.BOOLEAN,
  disableDefaultCellRendering: true,
  initialWidthPx: 30,
  customHeaderCellRenderers: [
    options => {
      const checkboxElement = document.createElement('input')
      checkboxElement.type = 'checkbox'
      checkboxElement.addEventListener('change', () => {
        options.rows.rowDataList.forEach(rd => {
          // eslint-disable-next-line no-param-reassign
          rd.selected = checkboxElement.checked
        })
        options.rows.updateTableData(options.rows.rowDataList)
      })
      options.rendered.element.addEventListener('mousedown', e => {
        e.stopPropagation()
        return false
      })
      options.rendered.element.addEventListener('click', e => {
        if (e.target === checkboxElement)
          return
        checkboxElement.checked = !checkboxElement.checked
        options.rows.rowDataList.forEach(rd => {
          // eslint-disable-next-line no-param-reassign
          rd.selected = checkboxElement.checked
        })
        options.rows.updateTableData(options.rows.rowDataList)
      })
      options.rendered.element.classList.add('checkbox-cell')
      options.rendered.element.appendChild(checkboxElement)
    },
  ],
  disableDefaultHeaderCellRendering: true,
  customCellRenderers: [
    options => {
      const checkboxElement = document.createElement('input')
      checkboxElement.type = 'checkbox'
      checkboxElement.checked = options.value
      checkboxElement.addEventListener('change', () => {
        options.onValueChange(checkboxElement.checked)
      })
      // Prevent calling of row click handlers
      options.rendered.element.addEventListener('mousedown', e => {
        e.stopPropagation()
        return false
      })
      options.rendered.element.addEventListener('click', e => {
        if (e.target === checkboxElement)
          return
        checkboxElement.checked = !checkboxElement.checked
        options.onValueChange(checkboxElement.checked)
      })
      options.rendered.element.classList.add('checkbox-cell')
      options.rendered.element.appendChild(checkboxElement)

      return {
        updateValue: newValue => {
          checkboxElement.checked = newValue
          options.onValueChange(newValue)
        },
      }
    },
  ],
}

export const SELECTION_ROW_HIGHLIGHT_ROW_RENDERER: CustomRowRenderer = {
  dependsOnFields: 'selected',
  renderer: options => {
    if (options.rowData.selected)
      options.rendered.element.classList.add('selected')
    else
      options.rendered.element.classList.remove('selected')
  },
}
