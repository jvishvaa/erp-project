
import React, { useState, useEffect, useContext } from 'react'

import { Card, CardContent, Modal, Button } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import WarningIcon from '@material-ui/icons/WarningOutlined'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/CloseOutlined'

import _ from 'lodash'
import * as rxjs from 'rxjs'

import FormControlLabel from '@material-ui/core/FormControlLabel'

import { useDispatch, useSelector } from 'react-redux'

import BlocBuilder from 'bloc-builder-react'
import { SelectorContext } from '../context'
import Exporter from './exporter'

import './pselect.css'

import { selectedItems } from '../../../_helpers/store'

import { filterConstants } from '../../../_constants'

import Actions from './actions'
import ScrollSheet from './scrollsheet'
import SearchField from './searchField'

function RenderListItem (props) {
  let { name, data } = props
  const dispatch = useDispatch()
  let [ checked, setChecked ] = useState(false)

  selectedItems.subscribe((newValue) => {
    if (checked) {
      newValue.items && !newValue.items[data.id + '/' + data.type] && setChecked(false)
    } else {
      newValue.items && newValue.items[data.id + '/' + data.type] && setChecked(true)
    }
  })

  return <ListItem style={{ height: 30 }} dense onClick={() => {
    dispatch({ type: filterConstants.UPDATE, data: { type: 'update', content: { id: data.id, name, type: data.type, value: !checked } } })
    setChecked(!checked)
  }} button>
    <div className='md-checkbox'>
      <input id={data.id + '/' + data.type} key={data.id + '/' + data.type} type='checkbox'
        checked={checked}
        onChange={(event) => {
          dispatch({ type: filterConstants.UPDATE, data: { type: 'update', content: { id: data.id, name, type: data.type, value: !checked } } })
          setChecked(!checked)
        }}
      />
      <label htmlFor={data.id + '/' + data.type} />
    </div>
    <ListItemText primary={name} />
  </ListItem>
}

function RenderSubjects (props) {
  let dispatch = useDispatch()
  let { subjects, item } = props
  let isSelected = new rxjs.BehaviorSubject(false)

  selectedItems.subscribe((newValue) => {
    if (newValue.items) {
      let selectedItems = Object.keys(newValue.items)
      let allSubjects = subjects.map(subject => subject.id + '/' + 4)
      let hasContent = _.difference(allSubjects, selectedItems).length === 0
      isSelected.next(hasContent)
    }
  })
  return subjects.length > 0
    ? <React.Fragment>
      <BlocBuilder
      // setting to the BlocBuilder our Subject
        subject={isSelected}
        // builder function that will render our JSX when the subject receives a new value
        builder={(snapshot) => {
          switch (!snapshot.error) {
            case true:
              return (
                <ListItem key={item.id} style={{ height: 30 }} onClick={(event) => dispatch({ type: filterConstants.UPDATE, data: { type: 'select_all', content: { id: item.id, name: item.name, type: 4, value: !snapshot.data } } })} dense button>
                  <div className='md-checkbox'>
                    <input id={item.id + '/4'} key={item.id + '/4'} className='ios_toggle' type='checkbox'
                      checked={snapshot.data}
                      onChange={(event) => dispatch({ type: filterConstants.UPDATE, data: { type: 'select_all', content: { id: item.id, name: item.name, type: 4, value: !snapshot.data } } })}
                    />
                    <label htmlFor={item.id + '/4'} />
                  </div>
                  <ListItemText primary={'Subjects'} />
                </ListItem>
              )
            // else let's expose the error
            default :
              return (<div>Error : <code>{snapshot.error}</code></div>)
          }
        }}
      />
      <div onWheel={(event) => event.stopPropagation()} style={{ height: 100, overflowY: 'auto', overflowX: 'hidden', boxShadow: 'rgba(255, 255, 255, 0.16) 0px 6px 6px inset, rgba(245,243,243) 0px 6px 6px inset' }}>
        {subjects.map((subject, index) => {
          return <RenderListItem key={index} data={subject} name={subject.name} />
        })}
      </div>
    </React.Fragment>
    : <div style={{ height: 130, width: '100%', background: 'white' }}>
      <div style={{ height: 30 }} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, boxShadow: 'rgba(255, 255, 255, 0.16) 0px 6px 6px inset, rgba(245,243,243) 0px 6px 6px inset' }}><WarningIcon style={{ color: '#e2e2e2' }} /> No subjects </div>
    </div>
}
function RenderSections (props) {
  let dispatch = useDispatch()
  let { sections, item } = props
  let isSelected = new rxjs.BehaviorSubject(false)

  selectedItems.subscribe((newValue) => {
    if (newValue.items) {
      let selectedItems = Object.keys(newValue.items)
      let allSections = sections.map(section => section.id + '/' + 3)
      let hasContent = _.difference(allSections, selectedItems).length === 0
      isSelected.next(hasContent)
    }
  })
  return sections.length > 0
    ? <React.Fragment>
      <div onWheel={(event) => event.stopPropagation()} style={{ height: 100, overflowY: 'auto', overflowX: 'hidden', boxShadow: 'rgba(255, 255, 255, 0.16) 0px -6px 6px inset, rgb(243, 243, 243) 0px -6px 6px inset', background: '#fff', zIndex: 100 }}>
        {sections.map((section, index) => {
          return <RenderListItem key={index} data={section} name={section.name} />
        })}
      </div>
      <BlocBuilder
        // setting to the BlocBuilder our Subject
        subject={isSelected}
        // builder function that will render our JSX when the subject receives a new value
        builder={(snapshot) => {
          switch (!snapshot.error) {
            case true:
              return (
                <ListItem onClick={(event) => dispatch({ type: filterConstants.UPDATE, data: { type: 'select_all', content: { id: item.id, name: item.name, type: 3, value: !snapshot.data } } })} key={item.id} style={{ height: 30 }} dense button>
                  <div className='md-checkbox'>
                    <input id={item.id + '/3'} key={item.id + '/3' + 3 + 5} type='checkbox'
                      checked={snapshot.data}
                      onChange={(event) => dispatch({ type: filterConstants.UPDATE, data: { type: 'select_all', content: { id: item.id, name: item.name, type: 3, value: !snapshot.data } } })}
                    />
                    <label htmlFor={item.id + '/3'} />
                  </div>
                  <ListItemText primary={'Sections'} />
                </ListItem>
              )
              // else let's expose the error
            default :
              return (<div>Error : <code>{snapshot.error}</code></div>)
          }
        }}
      /></React.Fragment>
    : <div style={{ height: 130, width: '100%' }}>
      <div style={{ display: 'flex', height: 100, boxShadow: 'rgba(255, 255, 255, 0.16) 0px -6px 6px inset, rgb(243, 243, 243) 0px -6px 6px inset', alignItems: 'center', justifyContent: 'center' }}><WarningIcon style={{ color: '#e2e2e2' }} /> No sections </div>
      <div style={{ height: 30 }} />
    </div>
}
function RenderSelected () {
  let [ selectedItems, setSelectedItems ] = useState([])
  let [ applyToAll, setApplyToAll ] = useState(false)
  const filterState = useSelector(state => state.filter)
  let dispatch = useDispatch()
  useEffect(() => {
    if (filterState && filterState.data && filterState.data.itemData) {
      setSelectedItems(Object.values(filterState.data.itemData))
    }
  }, [filterState])
  return <React.Fragment>
    <FormControlLabel
      control={
        <Checkbox
          checked={applyToAll}
          onChange={() => {
            dispatch({ type: filterConstants.APPLY_ALL })
            setApplyToAll(!applyToAll)
          }}
          color='primary'
        />
      }
      style={{ position: 'absolute', right: 16, top: 320, paddingLeft: 10 }}
      label='Apply In All Branches'
    />
    <div style={{ position: 'absolute', top: 320, padding: 16 }}>
      <div style={{ height: 'calc(100vh - 360px)', overflow: 'auto', padding: 8 }}>
        {selectedItems.length > 0 && <Table style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }} size='small'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Type</TableCell>
              <TableCell align='right'>Grade</TableCell>
              <TableCell align='right'>Branch</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {selectedItems.map(row => (
              <TableRow key={row.id}>
                <TableCell component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell align='right'>{row.name}</TableCell>
                <TableCell align='right'>{row.type === 3 ? 'Section' : 'Subject'}</TableCell>
                <TableCell align='right'>{row.grade}</TableCell>
                <TableCell align='right'>{row.branch}</TableCell>
                <TableCell>
                  <IconButton onClick={() => dispatch({ type: filterConstants.UPDATE, data: { type: 'update', content: { id: row.id, name: row.name, type: row.type, value: false } } })} aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>}
      </div>
    </div>
  </React.Fragment>
}

function Window (props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ open, setOpen ] = useState(false)
  const [ branches, setBranches ] = useState([])
  const [ filteredBranches, setFilteredBranches ] = useState([])
  const [ filteredGrades, setFilteredGrades ] = useState([])
  let { db, initialized } = useContext(SelectorContext)

  useEffect(() => {
    initialized && db.getAllBranches().then(res => {
      setBranches(res)
      setFilteredBranches(res.map(item => item.data.name))
      setFilteredGrades((grades) => {
        res.map((branch, index) => {
          grades[index] = branch.data.children
        })
        return grades
      })
    })
  }, [db, initialized])
  function ButtonWithData (props) {
    const filterState = useSelector(state => state.filter)
    return <Button {...props}>
    USE PowerSelector ({filterState.data && Object.keys(filterState.data.items).length} selected)
    </Button>
  }

  function setCurrentItem (itemIndex) {
    if (itemIndex < (filteredBranches.length) && itemIndex >= 0) {
      setCurrentIndex(itemIndex)
    }
  }

  return (
    <div>
      <Modal style={{ transition: 'all 2s' }} open={open}>
        <Card style={{ backgroundColor: 'white', height: '100vh' }}>
          <CardContent style={{ padding: 0 }}>
            <div id='ps-container' style={{ margin: 10, width: 'calc(100vw - 20px)' }} tabIndex={0} onKeyDown={(e) => {
              switch (e.keyCode) {
                case 38 : setCurrentItem(currentIndex - 1); break
                case 40 : setCurrentItem(currentIndex + 1); break
                default :
              }
            }}
            // onWheel={(event) => { event.deltaY > 20 && setCurrentItem(currentIndex + 1); event.deltaY < -20 && setCurrentItem(currentIndex - 1) }}
            >
              <ScrollSheet currentIndex={currentIndex} setCurrentItem={setCurrentItem} filteredBranches={filteredBranches} />
              <div id='grade-container' style={{ position: 'absolute', left: 200, top: 0, height: 300, width: 'calc(100vw - 220px)', overflowX: 'auto', overflowY: 'hidden' }}>
                <div style={{ height: 290, position: 'absolute', top: 0, width: filteredGrades[currentIndex] ? filteredGrades[currentIndex].length * 200 : 'calc(100vw - 200px)' }}>
                  {(filteredGrades[currentIndex] &&
                  filteredGrades[currentIndex].length > 0)
                    ? <div style={{ display: 'flex', width: filteredGrades[currentIndex] ? filteredGrades[currentIndex].length * 300 : 0 }}>
                      {filteredGrades[currentIndex].map(item => {
                        let sections = []
                        let subjects = []
                        item.children.forEach(child => {
                          if (child.type === 3) {
                            sections.push(child)
                          } else {
                            subjects.push(child)
                          }
                        })
                        return <div key={item.id + '/2' + item.id + item.db_id + 5} style={{ width: 300, height: 300, transition: 'all 2s' }}>
                          {props.showSection ? <RenderSections key={item.id + '/3' + item.db_id} item={item} sections={sections} /> : <div style={{ height: 130, width: '100%' }} />}
                          <div style={{ display: 'flex', width: '100%', height: '30px', background: 'rgb(247, 244, 244)', alignItems: 'center', justifyContent: 'center' }}><div>{item.name}</div></div>
                          {props.showSubject ? <RenderSubjects key={item.id + '/4' + item.db_id} item={item} subjects={subjects} /> : <div style={{ height: 130, width: '100%' }} />}
                        </div>
                      })
                      }</div>
                    : 'No grades' }
                </div>
              </div>
            </div>
            <RenderSelected />
            <SearchField {...{ branches, setFilteredBranches, setFilteredGrades, setCurrentItem }} />
            <div id='actions' style={{ position: 'absolute', bottom: 8, right: 8, padding: 8 }}>
              <Actions open={open} setOpen={setOpen} onSave={() => {
                let exporter = new Exporter()
                let data = exporter.getArrays()
                props.onSave && props.onSave(data)
                props.onClick && props.onClick()
              }} onCancel={props.onCancel} />
            </div>
          </CardContent>
        </Card>
      </Modal>
      <ButtonWithData onClick={() => {
        setOpen(!open); props.onClick && props.onClick()
      }} color='primary' />
    </div>
  )
}

export default Window
