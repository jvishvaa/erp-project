
import React from 'react'

import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import DateFilter from './filters/dateFilter'
import EvaluationFilter from './filters/evaluationFilter'
import SortFilter from './filters/sort'

import FilterMenu from './filterMenu'

export default function Filters ({ cards,
  handleRouteChange,
  submitRemarksHandler,
  isEvaluated, alert }) {
  let params = (new URL(document.location)).searchParams
  let path = params.get('path')

  if (!path) {
    path = 'home'
  }

  if (path === 'home') {
    return !window.isMobile ? <div style={{ padding: 4, display: 'flex' }}>
      <div style={{ paddingTop: 16 }}>
        Filters:
      </div>
      <DateFilter />
        &nbsp;&nbsp;
      <div style={{ paddingTop: 16 }}>
          Sort by:
      </div>
      <SortFilter />
    </div> : <FilterMenu>Date Filter:<DateFilter />&nbsp;&nbsp;Sort By:<SortFilter /></FilterMenu>
  }
  if (path === 'nonevaluated_all' || path === 'nonevaluated_grouped') {
    return !window.isMobile ? <div style={{ padding: 4, display: 'flex' }}><div style={{ paddingTop: 16 }}>Group By:</div><ToggleButtonGroup
      value={path}
      exclusive
      onChange={(event, value) => {
        const state = {}
        const title = ''
        const url = `/homework/?path=` + value
        window.history.pushState(state, title, url)
        handleRouteChange()
      }}
      aria-label='text alignment'
    >
      <ToggleButton value='nonevaluated_all' aria-label='left aligned'>
              All
      </ToggleButton>
      <ToggleButton value='nonevaluated_grouped' aria-label='centered'>
              Section
      </ToggleButton>
    </ToggleButtonGroup>&nbsp;&nbsp;<DateFilter /></div> : <FilterMenu><div>Group By:    <ToggleButtonGroup
      value={path}
      exclusive
      onChange={(event, value) => {
        const state = {}
        const title = ''
        const url = `/homework/?path=` + value
        window.history.pushState(state, title, url)
        handleRouteChange()
      }}
      aria-label='text alignment'
    >
      <ToggleButton value='nonevaluated_all' aria-label='left aligned'>
              All
      </ToggleButton>
      <ToggleButton value='nonevaluated_grouped' aria-label='centered'>
              Section
      </ToggleButton>
    </ToggleButtonGroup>&nbsp;&nbsp;<DateFilter /></div></FilterMenu>
  } else if (path === 'online_class_homeworks') {
    return !window.isMobile ? <div style={{ padding: 4, display: 'flex' }}>&nbsp;&nbsp;<div style={{ paddingTop: 16 }}> Date:</div><DateFilter />&nbsp;&nbsp;<div style={{ paddingTop: 16 }}> Type:</div><EvaluationFilter /></div> : <><FilterMenu>
      <div><DateFilter />&nbsp;&nbsp;<EvaluationFilter />&nbsp;&nbsp;</div>
    </FilterMenu></>
  } else {
    return ''
  }
}
