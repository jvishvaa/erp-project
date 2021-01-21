import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import {
  withStyles,
  Grid,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  MenuItem,
  Select
} from '@material-ui/core/'
// import { AddCircle, DeleteForever } from '@material-ui/icons'
// import TableContainer from '@material-ui/core/TableContainer'
import Modal from '../../../../ui/Modal/modal'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import shoulderPic from '../../../../assets/shoulderNew.jpeg'
import chestPic from '../../../../assets/chestNew.jpeg'
import waistPic from '../../../../assets/waist.jpeg'
import shirtSize from '../../../../assets/shirt_size.jpeg'
import pantSize from '../../../../assets/pant_size.jpeg'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
    backgroundColor: '#2196f3',
    marginTop: '0px',
    '&:hover': {
      backgroundColor: '#1a8cff'
    }
  },
  divIcon: {
    paddingTop: '30px'
  },
  icon: {
    color: '#2196f3',
    fontWeight: 'bolder',
    fontSize: 30,
    '&:hover': {
      color: '#1a8cff',
      cursor: 'pointer'
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: 'rgb(225, 0, 80)'
  },
  container: {
    padding: '20px 40px'
  },
  header: {
    fontSize: 16
  },
  textField: {
    margin: 10
  },
  label: {
    margin: 10,
    textAlign: 'center',
    fontSize: 16
  },
  formControl: {
    margin: theme.spacing * 1,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing * 2
  },
  shirt: {
    backgroundColor: '#b39ddba8'
  },
  pant: {
    backgroundColor: '#90caf97a'
  }
})

const BulkUniform = ({ classes, session, fetchAllSections, alert, user, fetchGrades, gradeList, sectionList, fetchBulkUniform, clearAllSize, bulkUniList, sendEachUni, sendBulkUniform, dataLoading }) => {
  const [sessionData, setSessionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  const [oldSize, setOldSize] = useState({})
  const [chest, setChest] = useState({})
  const [shoulder, setShoulder] = useState({})
  const [waist, setWaist] = useState({})
  const [overallShirt, setOverallShirt] = useState({})
  const [overallPant, setOverallPant] = useState({})
  const [showShirtChart, setShowShirtChart] = useState(false)
  const [showPantChart, setShowPantChart] = useState(false)
  const [showData, setShowData] = useState(false)
  useEffect(() => {
    const newChest = { ...chest }
    const newShoulder = { ...shoulder }
    const newWaist = { ...waist }
    bulkUniList.map((student) => {
      newChest[student.id] = student.shirt && student.shirt.chest ? student.shirt.chest : 0
      newShoulder[student.id] = student.shirt && student.shirt.shoulder ? student.shirt.shoulder : 0
      newWaist[student.id] = student.denim_pant && student.denim_pant.waist ? student.denim_pant.waist : 0
    })
    setChest(newChest)
    setShoulder(newShoulder)
    setWaist(newWaist)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkUniList])

  useEffect(() => {
    return () => {
      clearAllSize(alert, user)
    }
  }, [clearAllSize, alert, user])

  const defaultUniformShirt = {
    index: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    chest: [66.0, 71.1, 74.9, 80.0, 85.1, 90.2, 95.3, 101.6, 106.7, 109.2, 111.8, 111.8, 121.9, 125.7, 127.0],
    length: [40.6, 42.5, 44.5, 48.9, 53.3, 54.6, 59.7, 61.0, 61.6, 64.1, 66.0, 71.1, 69.9, 72.4, 76.2],
    sleeveLength: [35.6, 36.2, 38.1, 40.6, 43.2, 48.3, 53.3, 53.3, 54.6, 55.9, 55.9, 57.2, 57.8, 57.8, 61.0],
    shoulder: [24.8, 27.3, 29.2, 31.8, 34.3, 38.1, 39.4, 41.3, 43.2, 44.5, 47.0, 47.0, 49.5, 50.2, 52.1]
  }
  const defaultDenimPant = {
    index: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    length: [53.3, 55.9, 58.4, 61.0, 63.5, 68.6, 73.7, 78.7, 83.8, 86.4, 91.4, 94.0, 99.1, 101.6, 101.6, 104.1, 106.7, 106.7, 106.7, 111.8, 111.8],
    waist: [40.6, 43.2, 45.7, 48.3, 53.3, 55.9, 55.9, 58.4, 61.0, 63.5, 66.0, 68.6, 71.1, 73.7, 76.2, 78.7, 81.3, 83.8, 86.4, 88.9, 91.4]
  }

  const handleClickSessionYear = (e) => {
    setSessionData(e.target.value)
    setGradeData(null)
    setSectionData(null)
    fetchGrades(e.target.value, alert, user)
    setShowData(false)
  }
  const changeGradeHandler = (e) => {
    setGradeData(e.target.value)
    fetchAllSections(sessionData, e.target.value, alert, user)
  }

  const changeSectionHandler = (e) => {
    setSectionData(e.target.value)
  }

  const getBulkUniHandler = () => {
    if (sessionData && gradeData && sectionData) {
      fetchBulkUniform(sessionData, gradeData, sectionData, user, alert)
    } else {
      alert.warning('Fill all the fields!')
    }
    setShowData(true)
  }

  const handleSize = (event, id) => {
    switch (event.target.id) {
      case 'chest': {
        setChest({ ...chest, [id]: +event.target.value })
        break
      }
      case 'shoulder': {
        setShoulder({ ...shoulder, [id]: +event.target.value })
        break
      }
      case 'waist': {
        setWaist({ ...waist, [id]: +event.target.value })
        break
      }
      default: {

      }
    }
  }

  const compareHandler = (id) => {
    // calc
    let data = {
      'old_chest': chest[id],
      'old_shoulder': shoulder[id],
      'old_waist': waist[id]
    }
    console.log('old value: ', data)
    setOldSize({ ...oldSize, [id]: data })
    let overallShirtSize = []
    let overallPantSize = []
    console.log('chest', defaultUniformShirt.chest)
    for (let i = 0; i < defaultUniformShirt.chest.length; i++) {
      if (defaultUniformShirt.chest[i] < chest[id]) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultUniformShirt.chest[i])
        overallShirtSize.push(i)
        break
      }
    }

    console.log('shoulder', defaultUniformShirt.shoulder)
    for (let i = 0; i < defaultUniformShirt.shoulder.length; i++) {
      if (defaultUniformShirt.shoulder[i] < shoulder[id]) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultUniformShirt.shoulder[i])
        overallShirtSize.push(i)
        break
      }
    }
    console.log('waist', defaultDenimPant.waist)
    for (let i = 0; i < defaultDenimPant.waist.length; i++) {
      if (defaultDenimPant.waist[i] < waist[id]) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimPant.waist[i])
        overallPantSize.push(i)
        break
      }
    }
    console.log('waist', defaultDenimPant.length)
    for (let i = 0; i < defaultDenimPant.length.length; i++) {
      if (defaultDenimPant.length[i] < waist[id]) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimPant.length[i])
        overallPantSize.push(i)
        break
      }
    }
    const shirtMaxIndex = Math.max(...overallShirtSize)
    console.log('overallShirt', shirtMaxIndex)
    const newOverallShirt = { ...overallShirt }
    newOverallShirt[id] = defaultUniformShirt.index[shirtMaxIndex]
    setOverallShirt(newOverallShirt)

    const pantMaxIndex = Math.max(...overallPantSize)
    console.log('overallPant', shirtMaxIndex)
    const newOverallPant = { ...overallPant }
    newOverallPant[id] = defaultDenimPant.index[pantMaxIndex]
    setOverallPant(newOverallPant)

    const newChest = { ...chest }
    newChest[id] = defaultUniformShirt.chest[shirtMaxIndex]

    const newShoudler = { ...shoulder }
    newShoudler[id] = defaultUniformShirt.shoulder[shirtMaxIndex]

    const newWaist = { ...waist }
    newWaist[id] = defaultDenimPant.waist[shirtMaxIndex]

    setChest(newChest)
    setShoulder(newShoudler)
    setWaist(newWaist)
  }

  const updateEachHandler = (id, row) => {
    // compareHandler(id)
    let data = { ...row }
    console.log('data: ', data)
    data['shirt'].chest = chest[id]
    data['shirt'].shoulder = shoulder[id]
    data['denim_pant'].waist = waist[id]
    if (overallShirt[id]) {
      data['shirt'].overall_shirt_size = overallShirt[id]
    }
    if (overallPant[id]) {
      data['denim_pant'].overall_pant_size = overallPant[id]
    }
    if (oldSize[id]) {
      data['actual_size'] = oldSize[id]
    }
    console.log('after update', data)
    let sendObj = {
      data: data
    }
    sendEachUni(sendObj, user, alert)
    console.log('send Obj: ', sendObj)
  }

  const sendSizeHandler = () => {
    // send api
    let updatedList = JSON.parse(JSON.stringify(bulkUniList))
    updatedList.map((obj) => {
      obj['shirt'].chest = chest[obj.id]
      obj['shirt'].shoulder = shoulder[obj.id]
      obj['denim_pant'].waist = waist[obj.id]
      if (overallShirt[obj.id]) {
        obj['shirt'].overall_shirt_size = overallShirt[obj.id]
      }
      if (overallPant[obj.id]) {
        obj['denim_pant'].overall_pant_size = overallPant[obj.id]
      }
      if (oldSize[obj.id]) {
        obj['actual_size'] = oldSize[obj.id]
      }
    })
    console.log('updated Obj: ', updatedList)
    let myObj = {
      data: updatedList
    }
    sendBulkUniform(myObj, user, alert)
  }

  const showShirtChartHandler = () => {
    setShowShirtChart(!showShirtChart)
  }

  const showPantChartHandler = () => {
    setShowPantChart(!showPantChart)
  }

  const getShirtChart = () => {
    return (
      <Modal open={showShirtChart} style={{ padding: '10px 20px' }} click={showShirtChartHandler} large>
        <img src={shirtSize} alt='shirtsize' />
      </Modal>
    )
  }

  const getPantChart = () => {
    return (
      <Modal open={showPantChart} style={{ padding: '10px 20px' }} click={showPantChartHandler} large>
        <img src={pantSize} style={{ height: 45 }} alt='pantsize' />
      </Modal>
    )
  }

  const getBulkUniformTable = () => {
    return (
      <React.Fragment>
        { showData
          ? <Grid container spacing={3}>
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' />
                    <TableCell align='center' />
                    <TableCell align='center' colSpan={2} className={classes.shirt} style={{ fontSize: 14 }}>
                    Shirt <Button variant='outlined' color='secondary' onClick={showShirtChartHandler}> Size Chart</Button>
                    </TableCell>
                    <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>
                    Pant <Button variant='outlined' color='primary' onClick={showPantChartHandler}> Size Chart</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align='center'>
                    ERP
                    </TableCell>
                    <TableCell align='center'>
                    Student Name
                    </TableCell>
                    <TableCell align='center' className={classes.shirt}>
                    Chest <span style={{ fontWeight: 'bold' }}>(in cm)</span>
                      <div style={{ width: '100%' }}>
                        <img style={{ height: '60px' }} src={chestPic} alt='chest' />
                      </div>
                    </TableCell>
                    <TableCell align='center' className={classes.shirt}>
                    Shoulder <span style={{ fontWeight: 'bold' }}>(in cm)</span>
                      <div style={{ width: '100%' }}>
                        <img style={{ height: '60px' }} src={shoulderPic} alt='shoulder' />
                      </div>
                    </TableCell>
                    <TableCell align='center' className={classes.pant}>
                    Waist <span style={{ fontWeight: 'bold' }}>(in cm)</span>
                      <div style={{ width: '100%' }}>
                        <img style={{ height: '60px' }} src={waistPic} alt='waist' />
                      </div>
                    </TableCell>
                    {/* <TableCell align='center' className={classes.pant}>
                    Outseam Length
                  </TableCell> */}
                    {/* <TableCell align='center'>
                    Calculate Total Size
                  </TableCell> */}
                    <TableCell align='center'>
                    Update
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bulkUniList.length
                    ? bulkUniList.map((row) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell align='center'>{row.student && row.student.erp_code}</TableCell>
                          <TableCell align='center'>{row.student && row.student.name}</TableCell>
                          <TableCell align='center' className={classes.shirt}>
                            <TextField
                              id='chest'
                              label='Chest'
                              type='number'
                              variant='outlined'
                              value={chest[row.id]}
                              className={classes.textField}
                              style={{ zIndex: 0 }}
                              onChange={(e) => handleSize(e, row.id)}
                              InputLabelProps={{ shrink: true }}
                            // InputLabelProps={{ classes: { outlined: 'zIndex: 0' } }}
                            />
                          </TableCell>
                          <TableCell align='center' className={classes.shirt}>
                            <TextField
                              id='shoulder'
                              label='Shoulder'
                              type='number'
                              variant='outlined'
                              value={shoulder[row.id]}
                              className={classes.textField}
                              style={{ zIndex: 0 }}
                              onChange={(e) => handleSize(e, row.id)}
                              InputLabelProps={{ shrink: true }}
                            // InputLabelProps={{ classes: { outlined: 'zIndex: 0' } }}
                            />
                          </TableCell>
                          <TableCell align='center' className={classes.pant}>
                            <TextField
                              id='waist'
                              label='Waist'
                              type='number'
                              variant='outlined'
                              value={waist[row.id]}
                              className={classes.textField}
                              style={{ zIndex: 0 }}
                              onChange={(e) => handleSize(e, row.id)}
                              InputLabelProps={{ shrink: true }}
                            // InputLabelProps={{ classes: { outlined: 'zIndex: 0' } }}
                            />
                          </TableCell>
                          <TableCell align='center' style={{ display: 'none' }}>
                            <Button
                              variant='outlined'
                              color='secondary'
                              // style={{ marginTop: '20px' }}
                              onClick={() => compareHandler(row.id)}
                            >Calculate Overall Size</Button>
                          </TableCell>
                          <TableCell align='center'>
                            <Button
                              variant='contained'
                              color={chest[row.id] && shoulder[row.id] && waist[row.id] ? 'secondary' : 'primary'}
                              // style={{ marginTop: '20px' }}
                              onClick={() => updateEachHandler(row.id, row)}
                            >Update</Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                    : null}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant='contained'
                color='primary'
                // style={{ marginTop: '20px' }}
                onClick={sendSizeHandler}
              >Update Uniform Size</Button>
            </Grid>
          </Grid>
          : []}
      </React.Fragment>
    )
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <label>Academic Year*</label><br />
          <FormControl variant='outlined' className={classes.formControl}>
            <Select
              placeholder='Select Academic Year'
              value={sessionData}
              onChange={handleClickSessionYear}
            >
              {session
                ? session.session_year.map((session) => (<MenuItem value={session}>{session}</MenuItem>))
                : []}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <label>Grade*</label><br />
          <FormControl variant='outlined' className={classes.formControl}>
            <Select
              placeholder='Select Grade'
              value={gradeData || ''}
              onChange={changeGradeHandler}
            >
              {gradeList && gradeList.length
                ? gradeList.map(grades => (<MenuItem value={grades.grade.id}>{grades.grade.grade}</MenuItem>))
                : []}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <label>Section*</label><br />
          <FormControl variant='outlined' className={classes.formControl}>
            <Select
              placeholder='Select Section'
              value={sectionData || ''}
              onChange={changeSectionHandler}
            >
              {sectionList && sectionList.length
                ? sectionList.map(sec => (<MenuItem value={sec.section.id}>{sec.section.section_name}</MenuItem>))
                : []}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={getBulkUniHandler}
          >GET</Button>
        </Grid>
      </Grid>
      { bulkUniList.length ? getBulkUniformTable() : null }
      { showShirtChart ? getShirtChart() : null }
      { showPantChart ? getPantChart() : null }
      { dataLoading ? <CircularProgress open /> : null }
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.accountantReducer.pdc.gradeData,
  sectionList: state.finance.accountantReducer.changeFeePlan.sectionData,
  dataLoading: state.finance.common.dataLoader,
  bulkUniList: state.inventory.storeManager.bulkUniform.bulkUniList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user })),
  fetchBulkUniform: (session, grade, section, user, alert) => dispatch(actionTypes.fetchBulkUniform({ session, grade, section, user, alert })),
  sendEachUni: (body, user, alert) => dispatch(actionTypes.sendEachUni({ body, user, alert })),
  sendBulkUniform: (body, user, alert) => dispatch(actionTypes.sendBulkUniform({ body, user, alert })),
  clearAllSize: (alert, user) => dispatch(actionTypes.clearAllSize({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BulkUniform))
