import React from 'react'
import moment from 'moment'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import DatePicker from '../datePicker'

import { updateLocation } from '../../utils'
import { useHomework } from '../../context'

function DateFilter () {
  const homework = useHomework()
  let params = (new URL(document.location)).searchParams
  let fromDate = params.get('from_date')
  let toDate = params.get('to_date')
  let today = moment().format('YYYY-MM-DD')
  let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  let startOfWeek = moment().startOf('week').format('YYYY-MM-DD')
  let endOfWeek = moment().endOf('week').format('YYYY-MM-DD')
  let startOfMonth = moment().startOf('month').format('YYYY-MM-DD')
  let endOfMonth = moment().endOf('month').format('YYYY-MM-DD')
  let currentSelection

  if (!fromDate && !toDate) {
    currentSelection = 'all'
  } else if (fromDate === startOfWeek && toDate === endOfWeek) {
    currentSelection = 'this_week'
  } else if (fromDate === startOfMonth && toDate === endOfMonth) {
    currentSelection = 'this_month'
  } else if (fromDate === today && toDate === today) {
    currentSelection = 'today'
  } else if (fromDate === yesterday && toDate === yesterday) {
    currentSelection = 'yesterday'
  }
  return <ToggleButtonGroup
    value={currentSelection}
    style={{
      display: 'flex',
      flexDirection: window.isMobile ? 'column' : 'row'
    }}
    exclusive
    onChange={(event, value) => {
      let startDate = today
      let endDate = today
      if (value === 'yesterday') {
        startDate = yesterday
        endDate = yesterday
      } else if (value === 'this_week') {
        startDate = startOfWeek
        endDate = endOfWeek
      } else if (value === 'this_month') {
        startDate = startOfMonth
        endDate = endOfMonth
      }
      params.set('from_date', moment(startDate).format('YYYY-MM-DD'))
      params.set('to_date', moment(endDate).format('YYYY-MM-DD'))
      if (value === 'all') {
        params.delete('from_date')
        params.delete('to_date')
      }
      updateLocation(window.location.href.split('?')[0] + '?' + params.toString())
      homework.handleRouteChangeWithUIUpdate()
    }}
    aria-label='text alignment'
  >
    <ToggleButton style={{ padding: 16 }} value='all' aria-label='centered'>
        All time
    </ToggleButton>
    <ToggleButton value='today' aria-label='left aligned'>
        Today
    </ToggleButton>
    <ToggleButton value='yesterday' aria-label='centered'>
        Yesterday
    </ToggleButton>
    <ToggleButton value='this_week' aria-label='centered'>
        This Week
    </ToggleButton>
    <ToggleButton value='this_month' aria-label='centered'>
        This Month
    </ToggleButton>

    <DatePicker />
  </ToggleButtonGroup>
}

export default DateFilter
