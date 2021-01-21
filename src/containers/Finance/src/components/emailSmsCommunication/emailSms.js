import React from 'react'
import {
  Tab,
  Tabs,
  Typography,
  Box,
  AppBar
} from '@material-ui/core'
import SMS from '../sms/sms'

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

const Communication = ({
  alert
}) => {
  const [tabValue, setTabValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <div>
      <AppBar position='static'>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label='Send SMS' />
          <Tab label='Send Email' />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <SMS alert={alert} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SMS isEmail alert={alert} />
      </TabPanel>
    </div>
  )
}

export default Communication
