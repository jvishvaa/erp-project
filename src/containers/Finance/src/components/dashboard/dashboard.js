import React, { useState } from 'react'

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'

import Button from '@material-ui/core/Button'
import { AutoSizer } from 'react-virtualized'
import { AddCircleOutline } from '@material-ui/icons'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

import Toolbar from '../../ui/toolbar'
import WidgetHeader from './components/header'
import './style.css'
// import TeacherReport from './widgets/teacherReport'
import WidgetManager from './widgetManager'
import WidgetBody from './components/body'

export default function Dashboard () {
  let [ anchorEl, setAnchorEl ] = useState(null)
  let [ open, setOpen ] = useState(false)
  let role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
  let manager = new WidgetManager(role)

  function handleClick (event) {
    const { currentTarget } = event
    setAnchorEl(currentTarget)
    setOpen(!open)
  }

  return <React.Fragment>
    <Toolbar floatRight={
      <Button onClick={handleClick}style={{ color: 'red' }} size='small'>
         Add Widget &nbsp;<AddCircleOutline />
      </Button>
    } />
    <AutoSizer disableHeight>
      {({ width }) => (
        <ResponsiveGridLayout breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} className='layout' width={width} rowHeight={30}>
          {(manager.initializeAll()).map((widget, widgetIndex) => {
            console.log({ x: (widgetIndex % 3), y: Math.floor((widgetIndex) / 3) })
            return <div style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }} data-grid={{ x: (widgetIndex % 3) * 4, y: Math.floor((widgetIndex) / 3) * 6, w: 4, h: 6 }} key={`widget-${widgetIndex}`}>
              <AutoSizer>
                {({ width, height }) => (
                  <React.Fragment>
                    <WidgetHeader title={widget.title} />
                    <WidgetBody width={width} height={height}>{widget.component}</WidgetBody>
                  </React.Fragment>
                )}
              </AutoSizer>
            </div>
          })}
        </ResponsiveGridLayout>
      )}
    </AutoSizer>

    <Popper open={open} anchorEl={anchorEl} placement={'bottom-end'} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <Typography >Available Widgets</Typography>
          </Paper>
        </Fade>
      )}
    </Popper>
  </React.Fragment>
}
