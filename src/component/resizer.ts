import { Position } from './helpers/geometry'
import { Rendered } from './types'

export type ResizerOptions = {
  element: HTMLElement
  resizeElementOnResize?: boolean
  events?: {
    onResizeStart?: (initialWidthPx: number) => void
    onResizeCancel?: (initialWidthPx: number) => void
    onResize?: (widthPx: number) => void
    onResizeEnd?: (widthPx: number) => void
    onDoubleClick?: () => void
  }
}

export type Resizer = {
  rendered: Rendered
}

const VERTICAL_DISENGAGE_THRESHOLD_PX = 200

export const createResizer = (options: ResizerOptions): Resizer => {
  let onMouseMove: (e: MouseEvent) => void
  let onMouseUp: (e: MouseEvent) => void
  let onKeyDown: (e: KeyboardEvent) => void

  const resizeElementOnResize = options.resizeElementOnResize ?? true
  const element = document.createElement('div')
  element.classList.add('com-resizer')

  element.addEventListener('dblclick', e => {
    e.stopPropagation()
    options.events?.onDoubleClick?.()
    return false
  })

  const removeEventListeners = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('keydown', onKeyDown)
  }

  const cancel = (startWidth: number) => {
    removeEventListeners()
    options.events?.onResizeCancel?.(startWidth)
    if (resizeElementOnResize)
      // eslint-disable-next-line no-param-reassign
      options.element.style.width = `${startWidth}px`
  }

  element.addEventListener('mousedown', e => {
    e.stopPropagation()
    const startWidth = options.element.getBoundingClientRect().width
    const startPosition: Position = { x: e.screenX, y: e.screenY }
    options.events?.onResizeStart?.(startWidth)

    onKeyDown = _e => {
      if (_e.key !== 'Escape')
        return
      cancel(startWidth)
    }

    onMouseMove = _e => {
      const currentVector: Position = { x: _e.screenX - startPosition.x, y: _e.screenY - startPosition.y }
      if (currentVector.y > VERTICAL_DISENGAGE_THRESHOLD_PX) {
        cancel(startWidth)
      }
      else {
        const currentWidth = startWidth + currentVector.x
        options.events?.onResize?.(currentWidth)
        if (resizeElementOnResize)
          // eslint-disable-next-line no-param-reassign
          options.element.style.width = `${currentWidth}px`
      }
    }

    onMouseUp = _e => {
      const currentVector: Position = { x: _e.screenX - startPosition.x, y: _e.screenY - startPosition.y }
      if (currentVector.x === 0) {
        cancel(startWidth)
      }
      else {
        const currentWidth = startWidth + currentVector.x
        if (resizeElementOnResize)
          // eslint-disable-next-line no-param-reassign
          options.element.style.width = `${currentWidth}px`
        options.events?.onResizeEnd?.(currentWidth)
        removeEventListeners()
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('keydown', onKeyDown)
  })
  return { rendered: { element } }
}
