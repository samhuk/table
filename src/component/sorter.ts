import { Rendered } from './types'
import { Sorting } from './types'

type SorterOptions = {
  initialSorting?: Sorting
}

export type Sorter = {
  rendered: Rendered
  sorting: Sorting
  setSorting: (newSorting: Sorting) => void
  iterateSorting: () => Sorting
}

const SORTING_TO_TEXT_MAP: { [sorting in Sorting]: string } = {
  [Sorting.NONE]: '',
  [Sorting.ASC]: '▲',
  [Sorting.DESC]: '▼',
}

const SORTING_ORDERING: Sorting[] = [
  Sorting.NONE,
  Sorting.ASC,
  Sorting.DESC,
]

const renderSorting = (element: HTMLElement, newSorting: Sorting) => {
  // eslint-disable-next-line no-param-reassign
  element.textContent = SORTING_TO_TEXT_MAP[newSorting]
}

export const createSorter = (options: SorterOptions): Sorter => {
  let sorter: Sorter
  const element = document.createElement('div')
  const _sorting = options.initialSorting ?? Sorting.NONE
  renderSorting(element, _sorting)

  // eslint-disable-next-line prefer-const
  sorter = {
    rendered: { element },
    sorting: _sorting,
    setSorting: newSorting => {
      renderSorting(element, newSorting)
      sorter.sorting = newSorting
    },
    iterateSorting: () => {
      const currentIndex = SORTING_ORDERING.indexOf(sorter.sorting)
      const nextIndex = currentIndex > SORTING_ORDERING.length - 2 ? 0 : currentIndex + 1
      const newSorting = SORTING_ORDERING[nextIndex]
      sorter.sorting = newSorting
      renderSorting(element, sorter.sorting)
      return newSorting
    },
  }
  return sorter
}
