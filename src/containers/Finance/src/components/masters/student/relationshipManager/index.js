import React, { useState, useEffect, useRef } from 'react'
import {
  Button, Grid, Modal, Typography, Divider, List, ListItem, ListItemText, Table, Input,
  TableBody, Tooltip, TableCell, TableRow, Chip, IconButton, ListItemSecondaryAction, InputAdornment,
  ListItemIcon, Checkbox, ListSubheader, CircularProgress
} from '@material-ui/core'
// , , , ListItemSecondaryAction, IconButton
import DeleteIcon from '@material-ui/icons/CloseRounded'
import SearchIcon from '@material-ui/icons/SearchRounded'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/ClearSharp'
import TuneIcon from '@material-ui/icons/Tune'
// import clsx from 'clsx'
import axios from 'axios'
import FaceIcon from '@material-ui/icons/Face'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StudentDetails from './studentDetails'
import ParentList from './parentList'
import Select from '../../../../ui/select'
import { urls } from '../../../../urls'
import StudentList from './studentList'
// import GSelect from '../../../../_components/globalselector'
// import GSelect from '../../../../_components/globalselector'
// import { COMBINATIONS } from './gselect.config'

const useStyles = makeStyles(theme => ({
  paperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  paper: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '90vw',
    height: '90vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
  },
  header: {
    flexShrink: 1,
    padding: 8,
    height: '5vh'
  },
  content: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'row',
    padding: 16,
    height: '80vh'
  },
  footer: {
    flexShrink: 1,
    padding: 8,
    height: '5vh'
  },
  studentList: {
    width: 'calc(20vw - 16px)',
    height: 'calc(80vh - 32px)',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #0000000f'
  },
  studentListHeader: {
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 300,
    background: 'white'
  },
  studentDetails: {
    width: 'calc(70vw - 16px)',
    height: 'calc(80vh - 32px)',
    overflow: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8
  },
  studentDetailsHeader: {
    position: 'sticky',
    top: 0,
    left: 0,
    padding: 16
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {

  },
  column: {
    flexBasis: '33.33%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  searchInput: {
    height: 36,
    width: '49%'
  }
}))

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))(Tooltip)
/**
 * @description Parent Student Relationship Manager with Button.
 */
function RelationshipManager (props) {
  let searchInputEl = useRef(null)
  const [modelOpen, setModelOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [studentList, setStudentList] = useState([])
  const [isSibling, setIsSibling] = useState(false)
  const [permanentFilterData, setPermanentFilterData] = useState({})
  const [activeStudentIndex, setActiveStudentIndex] = useState(0)
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false)
  const [parentListOpen, setParentListOpen] = useState(false)
  const [activeStudentForParentChange, setActiveStudentForParentChange] = useState({})
  const [currentlyActiveStudentInfoId, setCurrentlyActiveStudentInfoId] = useState('')
  const [studentListOpen, setStudentListOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterData, setFilterData] = useState({})
  const [studentsAreLoading, setStudentsAreLoading] = useState(false)
  const classes = useStyles()
  const [ filters, setFilters ] = useState([{
    label: 'Branch',
    options: [],
    url: urls.BRANCH,
    option_value: 'id',
    option_label: 'branch_name',
    active: false,
    search_filter: 'branch_id'
  }, {
    label: 'Grade',
    options: [],
    url: urls.GRADE,
    option_value: 'id',
    option_label: 'grade',
    active: false,
    search_filter: 'grade_id'
  }, {
    label: 'Section',
    options: [],
    url: urls.SECTION,
    option_value: 'id',
    option_label: 'section_name',
    active: false,
    search_filter: 'section_id'
  }])
  let token = localStorage.getItem('id_token')
  // function getStudentData (data) {
  //   let token = localStorage.getItem('id_token')
  //   if (data.section_mapping_id) {

  //   }
  // }
  function toggleStudentDetails () {
    console.log('Trying to close')
    setStudentDetailsOpen(!studentDetailsOpen)
  }
  useEffect(() => {
    let promises = []
    filters.forEach(filter => {
      promises.push(axios.get(filter.url, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }))
    })
    console.log(promises, 'Calling promises')
    Promise.all(promises).then((values) => {
      console.log('Finished')
      let newFilter = filters.map((filter, index) => {
        let newFilter = filter; newFilter.options = values[index].data.map(item => ({
          value: item[filter.option_value],
          label: item[filter.option_label]
        })); console.log(newFilter, 'FILTER'); return newFilter
      })
      console.log(newFilter, 'NEWFILTER')
      setFilters(newFilter)
    })
    let userProfile = JSON.parse(localStorage.getItem('user_profile'))
    let role = userProfile.personal_info.role
    let permenantFilterData = {}
    if (role === 'FOE' || role === 'Principal') {
      let branch = userProfile.academic_profile.branch_id
      console.log('BRANCH', branch)
      permenantFilterData = {
        branch_id: branch
      }
      setPermanentFilterData(permenantFilterData)
    }
    let additionalFilters = ''
    Object.keys(permenantFilterData).forEach(item => { additionalFilters += item + '=' + permenantFilterData[item] + '&' })
    axios.get(urls.STUDENTPARENTSEARCH + '?q=&page_size=15&page_no=' + currentPage + '&' + additionalFilters, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      setStudentList([...studentList, ...res.data.results])
      setActiveStudentIndex(0)
    }).catch(e => props.alert.error('Something went wrong.'))
  /* eslint-disable-next-line */
  }, [])
  function toggleParentListOpen () {
    setParentListOpen(!parentListOpen)
  }
  function toggleStudentListOpen () {
    setStudentListOpen(!studentListOpen)
  }

  function onSearch (data) {
    // change : ontextchange, selection change in checkbox, closing of dialog and update of data & onscroll event
    setStudentsAreLoading(true)
    let { change, value = '', filterData } = data
    filterData = { ...filterData, ...permanentFilterData }
    if (change === 'text_input') {
      setSearchText(value)
      let additionalFilters = ''
      Object.keys(filterData).forEach(item => { additionalFilters += item + '=' + filterData[item] + '&' })
      makeSearchRequest(value, 1, additionalFilters).then(res => {
        setCurrentPage(1)
        setStudentList(res.data.results)
        setActiveStudentIndex(0)
        setStudentsAreLoading(false)
      })
    } else if (change === 'checkbox_value') {
      let additionalFilters = ''
      Object.keys(filterData).forEach(item => { additionalFilters += item + '=' + filterData[item] + '&' })
      makeSearchRequest(value, 1, additionalFilters).then(res => {
        setCurrentPage(1)
        setStudentList(res.data.results)
        setActiveStudentIndex(0)
        setStudentsAreLoading(false)
      }).catch(e => props.alert.error('Something went wrong.'))
    } else if (change === 'dialog') {
      let additionalFilters = ''
      Object.keys(filterData).forEach(item => { additionalFilters += item + '=' + filterData[item] + '&' })
      makeSearchRequest(searchText, currentPage, additionalFilters, 0, currentPage * 15).then(res => {
        setStudentList(res.data.results)
        setStudentsAreLoading(false)
      }).catch(e => props.alert.error('Something went wrong.'))
    } else if (change === 'scroll') {
      console.log('Scroll event detected')
      let additionalFilters = ''
      Object.keys(filterData).forEach(item => { additionalFilters += item + '=' + filterData[item] + '&' })
      makeSearchRequest(value, currentPage + 1, additionalFilters).then(res => {
        setCurrentPage(currentPage + 1)
        setStudentList([...studentList, ...res.data.results])
        setActiveStudentIndex(0)
        setStudentsAreLoading(false)
      }).catch(e => props.alert.error('Something went wrong.'))
    }
  }

  function makeSearchRequest (value, page, additionalFilters, from, to) {
    return axios.get(urls.STUDENTPARENTSEARCH + `?q=${value}&${(!isNaN(from)) ? `from=${from}&to=${to}` : `page_no=${page}`}&page_size=15&` + additionalFilters, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }

  return <>
    <Button onClick={() => setModelOpen(!modelOpen)}>Relationship Manager</Button>
    <Modal
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
      open={modelOpen}
      onClose={() => setModelOpen(false)}
    >
      <div className={classes.paperContainer}>
        {studentDetailsOpen && <StudentDetails alert={props.alert} toggle={toggleStudentDetails} id={currentlyActiveStudentInfoId} open={studentDetailsOpen} />}
        {parentListOpen && <ParentList alert={props.alert} onSave={() => {
          onSearch({ change: 'dialog', filterData })
        }} sibling={isSibling} student={activeStudentForParentChange} toggle={toggleParentListOpen} open={parentListOpen} />}
        {studentListOpen && <StudentList alert={props.alert} permanentParams={permanentFilterData} student={studentList[activeStudentIndex]} onSave={() => {
          onSearch({ change: 'dialog', filterData })
        }} toggle={toggleStudentListOpen} open={studentListOpen} />}
        <div className={classes.paper}>
          <div className={classes.header}>
          Relationship Manager
          </div>
          <div className={classes.content}>
            <div onScroll={({ target }) => { target.scrollTop + target.clientHeight >= target.scrollHeight && onSearch({ change: 'scroll', filterData }) }} className={classes.studentList}>
              <div className={classes.studentListHeader}>
                <Grid style={{ boxShadow: 'rgba(151, 151, 151, 0.15) 0px 3px 1px', transition: 'all 400ms' }} direction='column' container>
                  <Grid item>
                    <Grid style={{ justifyContent: 'space-between' }} flexDirection='row' container>
                      <Grid style={{ padding: 16, display: showHeader ? 'block' : 'none', transition: 'all 200ms' }} item>Students {studentsAreLoading && <CircularProgress size={12} color='secondary' />}</Grid>
                      <Grid style={{ display: showHeader ? 'block' : 'none', transition: 'all 200ms' }} item>
                        <IconButton onClick={() => { setShowHeader(false); searchInputEl.current.focus() }}><SearchIcon /></IconButton>
                      </Grid>
                      <Grid style={{ display: showHeader ? 'none' : 'block', width: '90%', paddingLeft: 16 }} item>
                        <Input
                          inputRef={searchInputEl}
                          autoFocus
                          classes={{
                            input: classes.searchInput // class name, e.g. `classes-nesting-label-x`
                          }}
                          value={searchText}
                          onChange={(e) => onSearch({ value: e.target.value, change: 'text_input', filterData })}
                          startAdornment={<InputAdornment position='start'><SearchIcon /></InputAdornment>}
                          endAdornment={
                            <InputAdornment position='end'>
                              <Grid flexDirection='row' container>
                                <Grid item>
                                  <IconButton
                                    edge='end'
                                    onClick={() => { setShowHeader(true); onSearch({ value: '', change: 'text_input' }); setShowAdvancedSearch(false) }}
                                  >
                                    <ClearIcon />
                                  </IconButton>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    aria-label='toggle password visibility'
                                    edge='end'
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                  >
                                    <TuneIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </InputAdornment>
                          } />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{ height: 'auto', overflow: 'visible', width: '100%', paddingLeft: 16, transition: 'all 300ms' }} item>
                    {showAdvancedSearch && <List subheader={<ListSubheader>Filter By</ListSubheader>} className={classes.root}>
                      {filters.map((value, filterIndex) => {
                        const labelId = `checkbox-list-label-${value.label}`
                        return !permanentFilterData[value.search_filter] ? (
                          <ListItem key={value} role={undefined} dense>
                            <ListItemIcon>
                              <Checkbox
                                edge='start'
                                checked={value.active}
                                onChange={(event) => {
                                  let newFilters = filters
                                  newFilters[filterIndex] = {
                                    ...newFilters[filterIndex], active: event.target.checked
                                  }
                                  if (!event.target.checked) {
                                    let newFilterData = filterData
                                    delete newFilterData[value.search_filter]
                                    setFilterData({ ...newFilterData })
                                    onSearch({ value: searchText, filterData: newFilterData, change: 'checkbox_value' })
                                  }
                                  onSearch({ value: searchText, filterData: filterData, change: 'checkbox_value' })
                                  setFilters([...newFilters])
                                }}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <Select defaultValue={{ value: filterData[value.search_filter], label: filterData[value.search_filter] && value.options.filter(item => item.value === filterData[value.search_filter])[0].label }} disabled={!value.active} change={(data) => { onSearch({ value: searchText, change: 'checkbox_value', filterData: { ...filterData, [value.search_filter]: data.value } }); setFilterData({ ...filterData, [value.search_filter]: data.value }) }} options={value.options} label={value.label} />
                          </ListItem>
                        ) : ''
                      })}
                    </List>}
                  </Grid>
                </Grid>
              </div>
              <div className={classes.studentListBody}>
                <List style={{ maxHeight: '100%' }} component='nav' className={classes.root} aria-label='contacts'>
                  {studentList.map((student, index) => {
                    return <HtmlTooltip title={<React.Fragment>
                      <Typography color='inherit'><b>{student.name}</b></Typography>
                      <Typography color='inherit'>{student.erp}</Typography>
                      <Typography variant='subtitle1'>{student.branch}</Typography>
                      <Typography>{student.grade}</Typography>
                      <Typography>{student.section}</Typography>
                    </React.Fragment>}>
                      <ListItem onClick={() => setActiveStudentIndex(index)} selected={activeStudentIndex === index} button>
                        <ListItemText primary={student.name} />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => {
                            setCurrentlyActiveStudentInfoId(student.id)
                            setStudentDetailsOpen(true)
                          }} edge='end' aria-label='delete'>
                            <InfoOutlinedIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </HtmlTooltip>
                  })}
                </List>
                {showAdvancedSearch && studentsAreLoading && <CircularProgress size={12} color='secondary' />}
              </div>
            </div>
            <div className={classes.studentDetails}>
              <div className={classes.studentDetailsHeader}>
                {studentList[activeStudentIndex] && studentList[activeStudentIndex].name}
              </div>
              <div className={classes.studentDetailsBody}>
                {studentList[activeStudentIndex] && <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1c-content'
                    id='panel1c-header'
                  >
                    <div className={classes.column}>
                      <Typography className={classes.heading}>Parent</Typography>
                    </div>
                    <div className={classes.column}>
                      <Typography className={classes.secondaryHeading}>{studentList[activeStudentIndex].parent_fk ? studentList[activeStudentIndex].parent_fk.father_name : 'Parent Details Not Found.'}</Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    {studentList[activeStudentIndex].parent_fk ? <Table className={classes.table} aria-label='simple table'>
                      <TableBody>
                        <TableRow>
                          <TableCell align='right'>Father Name</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.father_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Address</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.address}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Father Mobile</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.father_mobile}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Father Email</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.father_email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Mother Name</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.mother_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Mother Mobile</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.mother_mobile}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Mother Email</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.mother_email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Guardian Name</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.guardian_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Guardian Mobile</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.guardian_mobile}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align='right'>Guardian Email</TableCell>
                          <TableCell align='left'>{studentList[activeStudentIndex].parent_fk.guardian_email}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table> : 'Parent Details Not Found.'}
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button onClick={() => { setActiveStudentForParentChange(studentList[activeStudentIndex]); setIsSibling(false); setParentListOpen(true) }} size='small' color='primary'>
                      Change Parent
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>}
                {studentList[activeStudentIndex] && <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1c-content'
                    id='panel1c-header'
                  >
                    <div className={classes.column}>
                      <Typography className={classes.heading}>Siblings</Typography>
                    </div>
                    <div className={classes.column}>
                      {Array.isArray(studentList[activeStudentIndex].siblings) && studentList[activeStudentIndex].siblings.length > 0 ? studentList[activeStudentIndex].siblings.map(sibling => {
                        return <Chip
                          icon={<FaceIcon />}
                          label={sibling.name}
                          // deleteIcon={<FaceIcon onClick={() => console.log('Deletingg...')} />}
                          onDelete={() => { setActiveStudentForParentChange(sibling); setIsSibling(true); setParentListOpen(true) }}
                        />
                      }) : 'No siblings found.'}
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    <Table className={classes.table} aria-label='simple table'>
                      <TableBody>
                        {Array.isArray(studentList[activeStudentIndex].siblings) && studentList[activeStudentIndex].siblings.length > 0 ? studentList[activeStudentIndex].siblings.map((sibling, index) => {
                          return <TableRow>
                            <TableCell align='left'>{index + 1}</TableCell>
                            <TableCell align='left'>{sibling.name}</TableCell>
                            <TableCell align='left'><IconButton onClick={() => {
                              setCurrentlyActiveStudentInfoId(sibling.id)
                              setStudentDetailsOpen(true)
                            }}><InfoOutlinedIcon /></IconButton></TableCell>
                            <TableCell align='left'><IconButton onClick={() => { setActiveStudentForParentChange(sibling); setIsSibling(true); setParentListOpen(true) }}><DeleteIcon /></IconButton></TableCell>
                          </TableRow>
                        }) : 'No siblings found.'}
                      </TableBody>
                    </Table>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button onClick={() => { toggleStudentListOpen() }} size='small' color='primary'>
                      Add Sibling
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>}
              </div>
            </div>
          </div>
          <div className={classes.footer}>
            <Button style={{ float: 'right' }} onClick={() => setModelOpen(false)}>CLOSE</Button>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

export default RelationshipManager
