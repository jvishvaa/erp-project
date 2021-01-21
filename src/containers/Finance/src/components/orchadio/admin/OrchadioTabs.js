
import React, { useState } from 'react'
import {
  Tabs,
  Tab,
  Typography,
  Box,
  AppBar,
  makeStyles
} from '@material-ui/core'

import styles from './orchadioAdmin.styles'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const useStyles = makeStyles(styles)

const OrchadioAdmin = ({
  alert,
  Tab1Component,
  Tab2Component,
  tab1Label,
  tab2Label,
  user,
  date
}) => {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={tab1Label} />
          <Tab label={tab2Label} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Tab1Component
          user={user}
          alert={alert}
          date={date}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tab2Component
          user={user}
          alert={alert}
          date={date}
        />
      </TabPanel>
    </div>
  )
}

export default OrchadioAdmin
