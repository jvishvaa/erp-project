import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Typography,
  // Fab,
  Table,
  // TableBody,
  TableRow,
  TableCell,
  // TableHead,
  TextField
//   withStyles
} from '@material-ui/core'
// import { Edit } from '@material-ui/icons'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
const AssignDelieveryCharge = ({ session, fetchGradeList, gradeList, fetchAllDelieverycharge, couponList, listCoupon, assignDelieveryChargeStudent, fetchAssignedDelieveryErp, erpList, listDelieveryCharge, alert, user, dataLoading, gradesPerBranch }) => {
  const [sessionData, setSessionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [isChecked, setisChecked] = useState({})
  const [checkedAll, setCheckedAll] = useState(false)
  const [delieveryCharge, setDelieveryCharge] = useState('')
  const [delieveryChargeDetailModal, setDelieveryChargeDetailModal] = useState(false)
  const [isDelieveryChargeAssign, setIsDelieveryChargeAssign] = useState(false)
  const [erpSearchValue, setErpSearchValue] = useState(null)
  const [studentErpList, setStudentErpList] = useState(null)
  const [showData, setShowdata] = useState(false)

  useEffect(() => {
    setStudentErpList(erpList)
  }, [erpList])

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setGradeData(null)
    fetchGradeList(alert, user)
    setShowdata(false)
  }
  const gradeHandler = (e) => {
    console.log(e.value)
    setGradeData(e)
    setShowdata(false)
    fetchAllDelieverycharge(sessionData.value, e.value, alert, user)
  }

  // hiting two api to get all delivery charge/to assign delivery charge kit
  const studentErp = () => {
    if (sessionData && gradeData) {
      setIsDelieveryChargeAssign(true)
      fetchAssignedDelieveryErp(sessionData.value, gradeData.value, alert, user)
      setShowdata(true)
    } else {
      alert.warning('Fill all the Fields!')
    }
  }

  const couponListHandler = (e) => {
    setDelieveryCharge(e)
  }

  // table data to display a erp with delivery charge kit
  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = studentErpList && studentErpList.map((val, i) => {
      return {
        id: val.id,
        check: <input
          type='checkbox'
          name='checking'
          value={i + 1}
          checked={isChecked[val.id || (val.student && val.student.id)]}
          onChange={
            (e) => { checkBoxHandler(e, val.id || (val.student && val.student.id)) }
          } />,
        erpCode: val.erp || (val.student && val.student.erp) ? val.erp || val.student.erp : '',
        delievery: val.kit ? val.kit.kit_name : '',
        amount: val.kit ? val.kit.kit_price : ''
      }
    })
    return dataToShow
  }

  // handler to select all students
  const checkAllStudentsHandler = (e) => {
    const checked = {}
    if (erpList && erpList.length > 0) {
      erpList.forEach(ele => {
        if (ele.erp || (ele.student && ele.student.erp)) {
          checked[ele.id || (ele.student && ele.student.id)] = e.target.checked
        }
      })
      setisChecked(checked)
      setCheckedAll(!checkedAll)
    }
  }

  // handler to search particular erp in table
  const erpSearchHandler = (e) => {
    console.log('studenrList', erpList)
    const filteredArr = erpList && erpList.filter(stu => (stu.student && +stu.student.erp.includes(+e.target.value)) || (stu.erp && +stu.erp.includes(+e.target.value)))
    setErpSearchValue(e.target.value)
    setStudentErpList(filteredArr)
  }
  let studentErpTable = null
  let checkedAlls = null
  if (showData && erpList && erpList.length > 0) {
    checkedAlls = (
      <div style={{ display: 'flex', marginTop: '60px' }}>
        <div style={{ padding: '10px' }}>
          <input
            type='checkbox'
            style={{ width: '20px', height: '20px', paddingBottom: '35px' }}
            checked={checkedAll || false}
            onChange={checkAllStudentsHandler}
          /> &nbsp; <b>Select All Students</b>
        </div>
        <div>
          <TextField
            id='erp1'
            label='Search ERP'
            type='number'
            variant='outlined'
            value={erpSearchValue || ''}
            style={{ zIndex: 0, marginTop: '0px', marginBottom: 20 }}
            onChange={erpSearchHandler}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              style: {
                height: 35
              }
            }}
          />
        </div>
      </div>
    )
  //   studentErpTable = <ReactTable
  //     data={renderStudentErpTable()}
  //     // manual
  //     columns={[
  //       {
  //         Header: 'Select',
  //         accessor: 'check',
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'ERP Code',
  //         accessor: 'erpCode',
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Delivery Charge Kit Name',
  //         accessor: 'delievery',
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Amount',
  //         accessor: 'amount',
  //         filterable: false,
  //         sortable: true
  //       }
  //     ]}
  //     filterable
  //     sortable
  //     defaultPageSize={20}
  //     showPageSizeOptions={false}
  //     className='-striped -highlight'
  //   />
  }

  const checkBoxHandler = (e, id) => {
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      setisChecked({ ...isChecked, [id]: true })
    } else {
      // or remove the value from the unchecked checkbox from the array
      setisChecked({ ...isChecked, [id]: false })
      setCheckedAll(false)
    }
  }
  const hideCouponDetailModalHandler = () => {
    setDelieveryChargeDetailModal(false)
  }
  // Modal to show details of delivery charge kit
  let delieverychargeKitDetail = null
  if (delieveryChargeDetailModal) {
    delieverychargeKitDetail = (
      <Modal open={delieveryChargeDetailModal} click={hideCouponDetailModalHandler}>
        <h3 style={{ textAlign: 'center' }}>Delivery Charge Kit Details</h3>
        <hr />
        {listDelieveryCharge && listDelieveryCharge.map((del) => {
          if (del.id === delieveryCharge.value) {
            return (
              <Table style={{ textAlign: 'center' }}>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Kit Name :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{del.kit_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Kit Price :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{del.kit_price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Kit Description :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{del.kit_description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Kit Color :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{del.kit_colour && del.kit_colour.color_name}</TableCell>
                </TableRow>
              </Table>
            )
          }
        })
        }
      </Modal>
    )
  }

  // Getting all the erp which are selected in table to send data
  const saveMultiChangeHandler = (e) => {
    let rowId = []
    console.log('ischecked', isChecked)
    Object.keys(isChecked).forEach((key) => {
      if (isChecked[key]) {
        rowId.push(key)
      }
    })
    let finalitems = []
    finalitems = erpList.filter(item => rowId.includes(item.id + ''))

    let erpArr = []
    // finalitems.forEach(ele => {
    //   if (ele.erp && ele.student && ele.student.erp) {
    //     return (
    //       erpArr.push(ele.student && ele.student.erp),
    //       erpArr.push(ele.erp)
    //     )
    //   } else if (ele.erp) {
    //     erpArr.push(ele.erp)
    //   } else {
    //     erpArr.push(ele.student && ele.student.erp)
    //   }
    // })

    // finalitems.forEach(ele => {
    //   if (ele.erp) {
    //     return (
    //       erpArr.push(ele.erp)
    //     )
    //   }
    // })

    finalitems.forEach(ele => {
      if (ele.id && ele.erp) {
        return (
          erpArr.push(ele.id)
        )
      } else {
        return (
          erpArr.push(ele.student.id)
        )
      }
    })
    console.log('the erpArrrr', erpArr)
    console.log('rowid', rowId)
    console.log('erplist', erpList)
    console.log('finalItem', finalitems)
    if (erpArr && erpArr.length > 0 && delieveryCharge) {
      const data = {
        kit_id: delieveryCharge && delieveryCharge.value,
        // erp: erpArr,
        student_id: erpArr,
        academic_year: sessionData && sessionData.value,
        grade: gradeData && gradeData.value
        // applicable_to: applicableTo && applicableTo.value
      }
      console.log('data++', data)
      assignDelieveryChargeStudent(data, alert, user)
      setCheckedAll(false)
      setisChecked(false)
    } else {
      alert.warning('Select Erp and Delivery Charge to Proceed!')
    }
  }
  const delieveryDetailHandler = () => {
    if (delieveryCharge) {
      setDelieveryChargeDetailModal(true)
    } else {
      alert.warning('Select Delivery Charge Kit to View Details!')
    }
  }
  let multiChange = null
  if (isDelieveryChargeAssign) {
    multiChange = (
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs='3'>
          <label>Delivery Charge Kit*</label>
          <Select
            placeholder='Select Delivery Charge'
            style={{ width: '100px' }}
            value={delieveryCharge}
            options={
              listDelieveryCharge
                ? listDelieveryCharge.map(fp => ({
                  value: fp.id,
                  label: fp.kit_name
                }))
                : []
            }
            onChange={couponListHandler}
          />
        </Grid>
        <Grid item xs='4'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            onClick={delieveryDetailHandler}
          >
            View Delivery Charge Details
          </Button>
        </Grid>
        <Grid item xs='3'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            onClick={saveMultiChangeHandler}
          >
            ASSIGN DELIVERY CHARGE
          </Button>
        </Grid>
      </Grid>
    )
  }
  return (
    <Layout>    
      <div>
      <Grid container spacing={3} wrap='wrap'style={{ padding: '15px' }}>
        <Grid item xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Grades*</label>
          <Select
            placeholder='Select Grade'
            value={gradeData}
            options={
              gradeList
                ? gradeList.map(grades => ({
                  value: grades.id,
                  label: grades.grade
                }))
                : []
            }
            onChange={gradeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={studentErp}
          >Submit</Button>
        </Grid>
      </Grid>
      {checkedAlls}
      {showData ? studentErpTable : []}
      {showData && erpList && erpList.length > 0 ? multiChange : []}
      {delieverychargeKitDetail}
      { dataLoading ? <CircularProgress open /> : null }
    </div>
    </Layout>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.common.gradeList,
  dataLoading: state.finance.common.dataLoader,
  erpList: state.finance.accountantReducer.assignDelieveryCharge.studentList,
  listDelieveryCharge: state.finance.accountantReducer.assignDelieveryCharge.listDelieveryCharge
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGradeList: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  fetchAllDelieverycharge: (session, grade, alert, user) => dispatch(actionTypes.fetchAllDelieverycharge({ session, grade, alert, user })),
  fetchAssignedDelieveryErp: (session, grade, alert, user) => dispatch(actionTypes.fetchAssignedDelieveryErp({ session, grade, alert, user })),
  assignDelieveryChargeStudent: (data, alert, user) => dispatch(actionTypes.assignDelieveryChargeStudent({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((AssignDelieveryCharge))
