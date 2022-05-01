import { Rendered } from './types'
import { measureText } from './headerCell'
import { Cell, CellOptions, CellValueChangeEvent, ColumnType, ColumnTypeToDataTypeMap, CustomCellRendererOutput } from './types'

const renderValue = <TColumnType extends ColumnType = ColumnType>(
  element: HTMLElement,
  disableDefaultCellRendering: boolean,
  setCellValueAsTitle: boolean,
  value: ColumnTypeToDataTypeMap[TColumnType],
  columnType: TColumnType
) => {
  if (disableDefaultCellRendering)
    return

  // Special rendering for boolean cell
  if (columnType === ColumnType.BOOLEAN) {
    const existingIconElement = element.getElementsByClassName('boolean-icon')[0]
    if (existingIconElement != null)
      element.removeChild(existingIconElement)
    // TODO: Make customizable
    const iconElement = document.createElement('div')
    iconElement.classList.add('boolean-icon')
    iconElement.textContent = value ? '✅' : '❌'
    element.appendChild(iconElement)
    return
  }

  // Set cell text content
  const valueAsString = value?.toString()
  element.textContent = valueAsString

  // Set cell title attribute
  if (setCellValueAsTitle && valueAsString != null && valueAsString.length > 0)
    element.title = valueAsString
}

const executeCustomCellRenderers = <TType extends ColumnType = ColumnType>(
  rendered: Rendered,
  options: CellOptions<TType>,
  setCellValueAsTitle: boolean,
  onValueChange: (e: CellValueChangeEvent<TType>) => void,
): CustomCellRendererOutput<TType>[] => {
  if (options.columnOptions.customCellRenderers == null)
    return []

  return options.columnOptions.customCellRenderers.map(renderer => renderer({
    rendered,
    rowData: options.rowData,
    value: options.value,
    onValueChange: newValue => onValueChange({ newValue }),
    defaultRender: () => renderValue(rendered.element, false, setCellValueAsTitle, options.value, options.columnOptions.type),
  })).filter(output => output != null)
}

export const createCell = <TType extends ColumnType = ColumnType>(options: CellOptions<TType>): Cell<TType> => {
  let cell: Cell<TType>
  const element = document.createElement('td')
  const rendered: Rendered = { element }

  const disableDefaultCellRendering = options.columnOptions.disableDefaultCellRendering != null
    ? typeof options.columnOptions.disableDefaultCellRendering === 'boolean'
      ? options.columnOptions.disableDefaultCellRendering
      : options.columnOptions.disableDefaultCellRendering(options.rowData)
    : false

  const setCellValueAsTitle = options.columnOptions.setCellValueAsTitle ?? true

  const onValueChange = (e: CellValueChangeEvent<TType>) => {
    cell.value = e.newValue
    options.events?.onValueChange?.(e)
  }
  const customCellRendererOutputs = executeCustomCellRenderers<TType>(rendered, options, setCellValueAsTitle, onValueChange)

  renderValue(element, disableDefaultCellRendering, setCellValueAsTitle, options.value, options.columnOptions.type)

  // eslint-disable-next-line prefer-const
  cell = {
    rendered,
    value: options.value,
    updateValue: newValue => {
      cell.value = newValue
      renderValue(element, disableDefaultCellRendering, setCellValueAsTitle, newValue, options.columnOptions.type)
      customCellRendererOutputs.forEach(o => o.updateValue(newValue))
    },
    measureContentWidth: () => {
      if (options.columnOptions.dataCellContentWidthMeasurer != null) {
        return typeof options.columnOptions.dataCellContentWidthMeasurer === 'number'
          ? options.columnOptions.dataCellContentWidthMeasurer
          : options.columnOptions.dataCellContentWidthMeasurer(cell.value)
      }

      return measureText({ textElement: element })
    },
  }
  return cell
}
