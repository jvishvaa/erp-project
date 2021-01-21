import React, { useState } from 'react'

import moment from 'moment'

import { Button, Popper, Grow, ClickAwayListener, Paper, MenuList } from '@material-ui/core'

import { DateRange } from 'react-date-range'

import { updateLocation } from '../utils'
import { useHomework } from '../context'

export default function DatePicker () {
  const homework = useHomework()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  let params = (new URL(document.location)).searchParams
  let fromDate = params.get('from_date') ? params.get('from_date') : new Date()
  let toDate = params.get('to_date') ? params.get('to_date') : new Date()

  const [ranges, setRanges] = useState([{
    startDate: moment(fromDate, 'YYYY-MM-DD').toDate(),
    endDate: moment(toDate, 'YYYY-MM-DD').toDate(),
    key: 'selection'
  }])

  function handleDateChange (selection) {
    console.log('Range changed', selection)
    if (selection) {
      params.set('from_date', moment(selection.startDate).format('YYYY-MM-DD'))
      params.set('to_date', moment(selection.endDate).format('YYYY-MM-DD'))
      updateLocation(window.location.href.split('?')[0] + '?' + params.toString())
      homework.handleRouteChangeWithUIUpdate()
    }
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown (event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <><Button
      style={{
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderLeft: 'none'
      }}
      ref={anchorRef}
      aria-controls={open ? 'menu-list-grow' : undefined}
      aria-haspopup='true'
      onClick={handleToggle}
    >
              Custom
    </Button>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement={window.isMobile ? 'top-end' : 'bottom-end'} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
                  <DateRange
                    editableDateInputs
                    onChange={({ selection }) => { setRanges([selection]); handleDateChange(selection) }}
                    moveRangeOnFirstSelection={false}
                    ranges={ranges}
                  />
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper></>
  )
}
