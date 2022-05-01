import React from 'react'
import { NavConfigItem } from '../../../types'
import NavItem from './navItem'

export const render = (props: { navItems: NavConfigItem[] }) => {
  if (props.navItems == null)
    return null

  return (
    <ul className="nav">
      {props.navItems.map((ni, i) => (
        <NavItem to={ni.to} text={ni.text} exact={ni.exact} key={i.toString()} />
      ))}
    </ul>
  )
}

export default render
