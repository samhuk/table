import React, { useEffect, useState } from 'react'

type Props<TComponent, TComponentOptions> = {
  component: (props: { options: TComponentOptions, setComponent?: (table: TComponent) => void }) => JSX.Element
  componentOptions: TComponentOptions
  operationsComponent?: (props: { component: TComponent }) => JSX.Element
}

const createComponentJsonString = (component: any) => component != null
  ? JSON.stringify(component, (key, val) => (
    typeof val === 'function' ? 'fn' : val
  ), 2)
  : '[NULL COMPONENT]'

const Debug = (props: { component: any }) => {
  const [componentJson, setComponentJson] = useState(createComponentJsonString(props.component))

  const _setComponentJson = () => setComponentJson(createComponentJsonString(props.component))

  useEffect(() => {
    _setComponentJson()
  }, [props.component])

  return (
    <div className="debug">
      <div className="header-1">JSON</div>
      <button type="button" className="button--white" onClick={() => _setComponentJson()}>
        Update
      </button>
      <pre>{componentJson}</pre>
    </div>
  )
}

const Operations = <TComponent,>(props: { component: TComponent, operationsComponent?: (props: { component: TComponent }) => JSX.Element }) => (
  props.operationsComponent != null && props.component != null
    ? (
      <div className="operations">
        <div className="header-1">Operations</div>
        {props.operationsComponent({ component: props.component })}
      </div>
    )
    : null
)

export const render = <TComponent, TComponentOptions>(props: Props<TComponent, TComponentOptions>) => {
  const [component, setComponent] = useState<TComponent>()

  return (
    <div className="item">
      <div className="header-1">Component</div>
      <div className="component" style={{ width: 800, height: 500 }}>
        {props.component({ options: props.componentOptions, setComponent })}
      </div>
      <Operations component={component} operationsComponent={props.operationsComponent} />
      <Debug component={component} />
    </div>
  )
}

export default render
