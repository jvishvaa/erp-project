import React, { useState } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import {
  withStyles,
  Grid,
  Button,
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
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import shoulderPic from '../../../../assets/shoulderNew.jpeg'
// import chestPic from '../../../../assets/chestNew.jpeg'
// // import sleevePic from '../../../../assets/sleeveNew.jpeg'
// import waistPic from '../../../../assets/waist.jpeg'
// import pant from '../../../assets/pant.jpg'

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

const UniformChart = ({ classes, session, fetchAllSections, alert, user, fetchGrades, gradeList, sectionList, fetchBulkUniform, bulkUniList, sendEachUni, dataLoading }) => {
  const [sessionData, setSessionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  // const [oldSize, setOldSize] = useState({})
  // const [chest, setChest] = useState({})
  // const [length, setLength] = useState({})
  // const [sleeveLength, setSleeveLength] = useState({})
  // const [shoulder, setShoulder] = useState({})
  // const [waist, setWaist] = useState({})
  // const [outseam, setOutseam] = useState({})
  // const [overallShirt, setOverallShirt] = useState({})
  // const [overallPant, setOverallPant] = useState({})

  const handleClickSessionYear = (e) => {
    setSessionData(e.target.value)
    fetchGrades(e.target.value, alert, user)
    setGradeData(null)
    setSectionData(null)
  }
  const changeGradeHandler = (e) => {
    setGradeData(e.target.value)
    fetchAllSections(sessionData, e.target.value, alert, user)
    setSectionData(null)
  }

  const changeSectionHandler = (e) => {
    setSectionData(e.target.value)
  }

  const getBulkUniHandler = () => {
    // hit fetch api
    if (sessionData && gradeData && sectionData) {
      fetchBulkUniform(sessionData, gradeData, sectionData, user, alert)
    } else {
      alert.warning('Fill all the fields!')
    }
  }
  const getBulkUniformTable = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell align='center' />
                  <TableCell align='center' /> */}
                  {/* <TableCell align='center' colSpan={2} className={classes.shirt} style={{ fontSize: 14 }}>Shirt</TableCell> */}
                  {/* <TableCell align='center' colSpan={2} className={classes.shirt} style={{ fontSize: 14 }}>Updated Shirt Size</TableCell> */}
                  {/* <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Pant</TableCell> */}
                  {/* <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Updated Pant Size</TableCell> */}
                </TableRow>
                <TableRow>
                  <TableCell align='center'>
                    ERP
                  </TableCell>
                  <TableCell align='center'>
                    Student Name
                  </TableCell>
                  <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Winterwear shirt Overall Size</TableCell>
                  <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Daywear shirt Overall Size</TableCell>
                  <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Sport T-shirt Overall Size</TableCell>
                  <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Sports Track Pant Overall Size</TableCell>
                  <TableCell align='center' colSpan={1} className={classes.pant} style={{ fontSize: 14 }}>Denim Pant Overall Size</TableCell>
                  {/* <TableCell align='center' className={classes.shirt}>
                    Chest
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={chestPic} alt='chest' />
                    </div>
                  </TableCell> */}

                  {/* <TableCell align='center' className={classes.shirt}>
                    Chest
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={chestPic} alt='chest' />
                    </div>
                  </TableCell>
                  <TableCell align='center' className={classes.shirt}>
                    Shoulder
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={shoulderPic} alt='shoulder' />
                    </div>
                  </TableCell> */}
                  {/* <TableCell align='center' className={classes.shirt}>
                    Chest
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={chestPic} alt='chest' />
                    </div>
                  </TableCell>
                  <TableCell align='center' className={classes.shirt}>
                    Shoulder
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={shoulderPic} alt='shoulder' />
                    </div>
                  </TableCell> */}
                  {/* <TableCell align='center' className={classes.pant}>
                    Waist
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={waistPic} alt='waist' />
                    </div>
                  </TableCell> */}
                  {/* <TableCell align='center' className={classes.pant}>
                    Waist
                    <div style={{ width: '100%' }}>
                      <img style={{ height: '60px' }} src={waistPic} alt='waist' />
                    </div>
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {bulkUniList.length
                  ? bulkUniList.map((row) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell align='center'>{row.student && row.student.erp_code}</TableCell>
                        <TableCell align='center'>{row.student && row.student.name}</TableCell>
                        {/* <TableCell align='center' className={classes.shirt}>
                          <p>{chest[row.id]}</p>
                        </TableCell>
                        <TableCell align='center' className={classes.shirt}>
                          <p>{shoulder[row.id]}</p>
                        </TableCell> */}
                        <TableCell align='center' className={classes.shirt}>
                          {row.shirt.overall_size ? row.shirt.overall_size : 0 }
                        </TableCell>
                        {/* //updated shirt size */}
                        <TableCell align='center' className={classes.shirt}>
                          <p>{row.shirt.overall_size ? row.shirt.overall_size : 0 }</p>
                        </TableCell>
                        {/* <TableCell align='center' className={classes.pant}>
                          {waist[row.id]}
                        </TableCell> */}
                        {/* // updated pant size */}
                        <TableCell align='center' className={classes.shirt}>
                          <p>{row.shirt.overall_size ? row.shirt.overall_size : 0}</p>
                        </TableCell>
                        <TableCell align='center' className={classes.pant}>
                          <p>{row.denim_pant.overall_size ? row.denim_pant.overall_size : 0}</p>
                        </TableCell>
                        <TableCell align='center' className={classes.pant}>
                          <p>{row.denim_pant.overall_size ? row.denim_pant.overall_size : 0}</p>
                        </TableCell>
                      </TableRow>
                    )
                  })
                  : null}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
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
              value={sessionData || ''}
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
                ? gradeList.map(grades => (<MenuItem value={grades.grade.id || gradeData}>{grades.grade.grade}</MenuItem>))
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
  sendEachUni: (body, user, alert) => dispatch(actionTypes.sendEachUni({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UniformChart))
