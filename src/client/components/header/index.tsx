import React from 'react'
import { NavConfigItem } from '../../types'
import Nav from '../common/nav'

const navItems: NavConfigItem[] = [
  {
    text: 'Home',
    to: '/',
    exact: true,
  },
  {
    text: 'Showcase',
    to: '/showcase',
  },
]

export const Header = () => (
  <div className="root-header">
    <div className="left">
      <div className="title">
        Table
      </div>
      <Nav navItems={navItems} />
    </div>
  </div>
)

export default Header
