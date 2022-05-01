import React from 'react'
import { createTable } from '../../../../component'
import { Table, TableOptions } from '../../../../component/types'
import Com from './base'

export const render = (props: { options: TableOptions, setComponent?: (table: Table) => void }) => (
  <Com
    componentOptions={props.options}
    createComponent={createTable}
    setComponent={props.setComponent}
    name="table"
  />
)

export default render
