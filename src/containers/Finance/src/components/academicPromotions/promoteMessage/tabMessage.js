import React from 'react'
import PropTypes from 'prop-types'
// import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%'
    // maxHeight: '20vw',
    // overflowY: 'scroll'
  },
  tableWrap: {
    maxHeight: '15vw',
    overflowY: 'scroll'
  },
  table: {
    maxWidth: '100%'
    // padding: '30px'
  }
}))

export default function FullWidthTabs ({ data: { success = [], failures = [] } = {} }) {
//   const data = [{
//     'success': [
//       {
//         'erp': '1705040218',
//         'remark': 'Student Promoted.'
//       }
//     ],
//     'failures': [
//       {
//         'erp': '1705040219',
//         'remark': 'Student either does not exist for erp: 1234, or is not active or is deleted.'
//       }
//     ]
//   }]
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'
        >
          <Tab label={`Success - ${success.length}`} {...a11yProps(0)} />
          <Tab label={`Failure - ${failures.length}`} {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={value} index={0} dir={theme.direction}>
          {
            success.length
              ? <div className={classes.tableWrap}>
                <Table className={classes.table}>
                  <TableHead className={classes.head}>
                    <TableRow>
                      <TableCell align={'center'}>ERP Code</TableCell>
                      <TableCell align={'center'}>Student Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { success.map(s => {
                      return <TableRow align={'center'}>
                        <TableCell align={'center'}>{s.erp}</TableCell>
                        <TableCell align={'center'}>{s.remark}</TableCell>
                      </TableRow>
                    })
                    }
                  </TableBody>
                </Table>
              </div> : <Typography align='center'>No Data</Typography>
          }
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {
            failures.length
              ? <div className={classes.tableWrap}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow align={'center'}>
                      <TableCell align={'center'}>ERP Code</TableCell>
                      <TableCell align={'center'}>Error Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      failures.map(s => {
                        return <TableRow>
                          <TableCell>{s.erp}</TableCell>
                          <TableCell>{s.remark}</TableCell>
                        </TableRow>
                      })

                    }
                  </TableBody>
                </Table>
              </div>
              : <Typography align='center'>No Data</Typography>
          }
        </TabPanel>
      </AppBar>
    </div>
  )
}
