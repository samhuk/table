import { NoDataRow } from './types'

export const createNoDataRow = (defaultNoDataMessage?: string): NoDataRow => {
  const element = document.createElement('td')
  const childElement = document.createElement('div')
  element.appendChild(childElement)
  element.classList.add('com-table__no-data-row')
  const textElement = document.createElement('div')
  textElement.textContent = defaultNoDataMessage ?? 'No data'

  childElement.appendChild(textElement)
  element.appendChild(childElement)

  return {
    rendered: { element },
    updateColSpan: count => element.setAttribute('colspan', count.toString()),
    updateContent: content => {
      if (typeof content === 'string')
        textElement.textContent = content
      else
        element.appendChild(content)
    },
  }
}
