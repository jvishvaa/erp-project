import React, { useState, useEffect } from 'react'
import {
  Tabs,
  Tab,
  AppBar,
  Typography,
  Box
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'

import WorkSubmission from './workSubmission'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

const HomeworkSubmission = ({
  location,
  alert
}) => {
  const [value, setValue] = useState(0)
  const [isOnlineClass, setIsOnlineClass] = useState(false)
  const [id, setId] = useState(false)

  useEffect(() => {
    if (location.state.id) {
      setId(location.state.id)
      setIsOnlineClass(location.state.isOnlineClass)
    }
  }, [location.state.id, location.state.isOnlineClass])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <AppBar position='static'>
        <Tabs value={value} onChange={handleChange}>
          <Tab label='Non Evaluated' />
          <Tab label='Evaluated' />
          <Tab label='Not Submitted' />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <WorkSubmission
          type='NE'
          id={id}
          isOnlineClass={isOnlineClass}
          alert={alert}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WorkSubmission
          type='E'
          id={id}
          isOnlineClass={isOnlineClass}
          alert={alert}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <WorkSubmission
          type='NS'
          id={id}
          isOnlineClass={isOnlineClass}
          alert={alert}
        />
      </TabPanel>
    </div>
  )
}

export default withRouter(HomeworkSubmission)
