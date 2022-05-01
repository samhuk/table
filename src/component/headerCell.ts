import { addDragResistantClickListener } from 'drag-resistant-click-listener'
import { camelCaseToTitleCase } from './helpers/string'
import { Rendered } from './types'
import { createResizer, Resizer } from './resizer'
import { createSorter, Sorter } from './sorter'
import { HeaderCell, HeaderCellOptions, Sorting } from './types'

const TEST_ELEMENT = document.createElement('div')
document.body.appendChild(TEST_ELEMENT)

export const measureText = (options: { textElement: HTMLElement }) => {
  TEST_ELEMENT.textContent = options.textElement.textContent
  const style = window.getComputedStyle(options.textElement)
  TEST_ELEMENT.style.padding = style.padding
  TEST_ELEMENT.style.fontSize = style.fontSize
  TEST_ELEMENT.style.fontWeight = style.fontWeight
  TEST_ELEMENT.style.visibility = 'none'
  TEST_ELEMENT.style.position = 'absolute'
  TEST_ELEMENT.style.display = 'inline-block'
  TEST_ELEMENT.style.top = '0'
  TEST_ELEMENT.style.zIndex = '-1'

  const domRect = TEST_ELEMENT.getBoundingClientRect()
  const textWidth = domRect.width

  return textWidth
}

export const createHeaderCell = (options: HeaderCellOptions): HeaderCell => {
  let headerCell: HeaderCell
  const initialSorting = options.sorting ?? Sorting.NONE

  const element = document.createElement('div')
  const rendered: Rendered = { element }

  const nameElement = document.createElement('div')
  nameElement.classList.add('com-table__header-row__header-cell__name')

  const displayName = options.columnOptions.displayName ?? camelCaseToTitleCase(options.columnOptions.fieldName)

  if (!options.columnOptions.disableDefaultHeaderCellRendering)
    nameElement.textContent = displayName

  nameElement.title = displayName

  element.style.width = `${options.columnOptions.initialWidthPx ?? 150}px`

  let filterButton: HTMLButtonElement
  let sorter: Sorter

  if (options.columnOptions.sortable ?? false) {
    sorter = createSorter({ initialSorting })
    addDragResistantClickListener({
      element,
      onClick: () => {
        sorter.iterateSorting()
        headerCell.sorting = sorter.sorting
        options.events?.onSortingChange?.({ newSorting: sorter.sorting })
      },
    })
  }
  else {
    element.classList.add('unsortable')
  }

  const rhsContainer = document.createElement('div')
  rhsContainer.classList.add('com-table__header-row__header-cell__rhs-container')
  element.appendChild(nameElement)

  if (sorter != null)
    rhsContainer.appendChild(sorter.rendered.element)

  if (options.columnOptions.filterable ?? false) {
    filterButton = document.createElement('button')
    filterButton.type = 'button'
    filterButton.classList.add('button--white')
    const icon = document.createElement('div')
    icon.classList.add('com-table__filter-button')
    icon.textContent = 'F'
    filterButton.appendChild(icon)
    rhsContainer.appendChild(filterButton)
    filterButton.addEventListener('mousedown', e => {
      e.stopPropagation()
      return false
    })
    filterButton.addEventListener('click', () => {
      options.events?.onFilterButtonClick?.()
    })
  }

  let resizer: Resizer
  if (options.columnOptions?.resizable ?? true) {
    resizer = createResizer({
      element,
      events: {
        onResize: newWidthPx => options.events?.onResize?.({ newWidthPx }),
        onResizeCancel: initialWidthPx => options.events?.onResize?.({ newWidthPx: initialWidthPx }),
        onResizeEnd: newWidthPx => options.events?.onResizeEnd?.({ newWidthPx }),
        onDoubleClick: options.events?.onResizerDoubleClick,
      },
    })
  }

  element.appendChild(rhsContainer)
  if (resizer != null)
    element.appendChild(resizer.rendered.element)

  if (options.columnOptions.customHeaderCellRenderers != null) {
    options.columnOptions.customHeaderCellRenderers.forEach(renderer => renderer({
      rendered,
      rows: options.rows,
    }))
  }

  return headerCell = {
    rendered: { element },
    sorting: initialSorting,
    setWidth: newWidthPx => element.style.width = `${newWidthPx}px`,
    updateSorting: newSorting => {
      sorter.setSorting(newSorting)
      headerCell.sorting = sorter.sorting
    },
    measureContentWidth: () => {
      if (options.columnOptions.headerCellContentWidthMeasurer != null) {
        return typeof options.columnOptions.headerCellContentWidthMeasurer === 'number'
          ? options.columnOptions.headerCellContentWidthMeasurer
          : options.columnOptions.headerCellContentWidthMeasurer()
      }

      return measureText({ textElement: nameElement })
    },
  }
}
