import React from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { updateLocation } from '../../utils'
import { useHomework } from '../../context'

export default function EvaluationFilter () {
  const homework = useHomework()
  const params = (new URL(document.location)).searchParams
  let corrected = params.get('corrected')
  if (corrected === 'True') {
    corrected = 'Evaluated'
  } else if (corrected === 'False') {
    corrected = 'Not Evaluated'
  } else {
    corrected = 'All'
  }

  return <ToggleButtonGroup
    value={corrected}
    exclusive
    onChange={(event, value) => {
      if (value === 'Evaluated') {
        params.set('corrected', 'True')
      } else if (value === 'Not Evaluated') {
        params.set('corrected', 'False')
      } else {
        params.delete('corrected')
      }
      updateLocation(window.location.href.split('?')[0] + '?' + params.toString())
      homework.handleRouteChangeWithUIUpdate()
    }}
    aria-label='text alignment'
  >
    <ToggleButton value='All' aria-label='centered'>
        All
    </ToggleButton>
    <ToggleButton value='Evaluated' aria-label='left aligned'>
        Evaluated
    </ToggleButton>
    <ToggleButton value='Not Evaluated' aria-label='centered'>
        Not Evaluated
    </ToggleButton>
  </ToggleButtonGroup>
}
