import React from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { updateLocation } from '../../utils'
import { useHomework } from '../../context'

export default function EvaluationFilter () {
  const homework = useHomework()
  const params = (new URL(document.location)).searchParams
  let sortBy = params.get('sort_by')
  if (sortBy !== 'nonevaluated_homework_count') {
    sortBy = 'date'
  }

  return <ToggleButtonGroup
    value={sortBy}
    exclusive
    onChange={(event, value) => {
      if (value === 'nonevaluated_homework_count') {
        params.set('sort_by', 'nonevaluated_homework_count')
      } else {
        params.delete('sort_by')
      }
      updateLocation(window.location.href.split('?')[0] + '?' + params.toString())
      homework.handleRouteChangeWithUIUpdate()
    }}
    aria-label='text alignment'
  >
    <ToggleButton value='date' aria-label='centered'>
        Date
    </ToggleButton>
    <ToggleButton value='nonevaluated_homework_count' aria-label='left aligned'>
        Nonevaluated Count (Homeworks)
    </ToggleButton>
  </ToggleButtonGroup>
}
