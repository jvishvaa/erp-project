import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, fade } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import TinyMce from '../TinyMCE/tinymce'

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabBar: {
    backgroundColor: fade(theme.palette.common.black, 0.15),
    color: 'black'
  }
}))

export default function PostTabs ({ getTinyMce, getTitle }) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.tabBar}>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example' variant='fullWidth'>
          <Tab label='Post' {...a11yProps(0)} />
          {/* <Tab label='Debate' {...a11yProps(1)} />
          <Tab label='Poll' {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TextField id='standard-basic' label='Title' size='small' variant='outlined' fullWidth style={{ marginBottom: '30px' }} onChange={getTitle} />
        <TinyMce id={'Q1345'} get={getTinyMce} />
      </TabPanel>
      {/* <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel> */}
    </div>
  )
}
