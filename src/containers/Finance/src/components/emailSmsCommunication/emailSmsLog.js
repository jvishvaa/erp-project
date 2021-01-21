import React, { useState } from 'react'
import {
  Tab,
  Tabs,
  Typography,
  Box,
  AppBar,
  Button,
  Grid
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import axios from 'axios'
import { useSelector } from 'react-redux'
import DateFnsUtils from '@date-io/date-fns'
// import SMS from '../sms/sms'
import GSelect from '../../_components/globalselector'
import { Combination } from '../sms/logConfig'
import SmsLog from '../sms/smsLog'
import { Toolbar } from '../../ui'
import { urls } from '../../urls'

const TYPES = {
  0: 'SMS',
  1: 'EMAIL'
}

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

const EmailSmsLog = ({
  alert
}) => {
  const [tabValue, setTabValue] = useState(0)
  const [filterData, setFilterData] = useState({})
  const [serverRes, setServerRes] = useState({
    smsLR: [],
    totalPage: 0
  })
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const user = useSelector(state => state.authentication.user)
  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getFilterData = (data) => {
    setFilterData(data)
  }

  const getFormattedDateString = (date) => {
    let dd = date.getDate()
    let mm = date.getMonth() + 1
    let yyyy = date.getFullYear()

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    return yyyy + '-' + mm + '-' + dd
  }

  const getSMSLog = (category, pageNumber, pageSize) => {
    let { SMSEmailLog: path } = urls
    if (Object.entries(filterData).length !== 0) {
      const data = {
        'page_number': pageNumber + 1,
        'page_size': pageSize,
        category,
        start_date: getFormattedDateString(fromDate),
        end_date: getFormattedDateString(toDate)
      }
      const params = { ...data, ...filterData }
      setLoading(true)
      axios.get(path, {
        params: params,
        headers: { Authorization: 'Bearer ' + user }
      }).then(res => {
        setServerRes({
          smsLR: res.data.sms_log_data,
          totalPage: res.data.total_page_count
        })
        setLoading(false)
      }).catch(er => {
        console.log(er)
        setServerRes({
          smsLR: [],
          totalPage: 0
        })
        setLoading(false)
      })
    }
  }

  const handleDateChange = (date, fn) => {
    fn(date)
  }

  return (
    <div>
      <Toolbar floatRight={
        <Button onClick={() => getSMSLog(TYPES[tabValue], 0, 5)}> Filter </Button>
      }>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify='flex-start' alignItems='center'>
            <Grid item xs={12} md={6}>
              <GSelect
                onChange={e => getFilterData(e)}
                config={Combination}
              />
            </Grid>
            <KeyboardDatePicker
              margin='normal'
              id='date-picker-dialog'
              label='From Date'
              format='dd/MM/yyyy'
              value={fromDate}
              onChange={(date) => handleDateChange(date, setFromDate)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
            <KeyboardDatePicker
              margin='normal'
              id='date-picker-dialog'
              label='To Date'
              format='dd/MM/yyyy'
              value={toDate}
              onChange={(date) => handleDateChange(date, setToDate)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Toolbar>
      <AppBar position='static'>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label='SMS Logs' />
          <Tab label='Email Logs' />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <SmsLog
          alert={alert}
          filterData={filterData}
          getSMSLog={(pageNumber, pageSize) => getSMSLog(TYPES[0], pageNumber, pageSize)}
          serverRes={serverRes}
          loading={loading}
          category='SMS'
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SmsLog
          isEmail
          alert={alert}
          filterData={filterData}
          getSMSLog={(pageNumber, pageSize) => getSMSLog(TYPES[1], pageNumber, pageSize)}
          serverRes={serverRes}
          loading={loading}
          category='EMAIL'
        />
      </TabPanel>
    </div>
  )
}

export default EmailSmsLog
