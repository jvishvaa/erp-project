import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Grid,
  Divider,
  Fab
} from '@material-ui/core'
import Select from 'react-select'
import { Edit } from '@material-ui/icons'

import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const FeeManagement = ({
  session,
  erp,
  getData,
  alert,
  user,
  fetchFeeMangement,
  feeManageMentLists,
  assignFeeManagement,
  feePlans,
  editStudentFeePlan,
  fetchAllFeePlans,
  dataLoading,
  currentFeePlan,
  studentList
}) => {
  const [isChecked, setIsChecked] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [feePlan, setFeePlan] = useState('')

  useEffect(() => {
    if (getData && erp.length >= 10 && session) {
      fetchFeeMangement(session, erp, alert, user)
    }
  }, [session, erp, getData, alert, user, fetchFeeMangement])

  useEffect(() => {
    const checked = {}
    if (feeManageMentLists && feeManageMentLists.length > 0) {
      feeManageMentLists.forEach(ele => {
        checked[ele.id] = false
      })
    }
    setIsChecked(checked)
  }, [feeManageMentLists])

  useEffect(() => {
    if (studentList) {
      fetchFeeMangement(session, erp, alert, user)
    }
  }, [studentList, fetchFeeMangement, session, erp, alert, user])

  const checkboxChangeHandler = (e, id) => {
    const checked = { ...isChecked }
    if (e.target.checked) {
      checked[id] = true
    } else {
      checked[id] = false
    }
    setIsChecked(checked)
  }

  const feePlansHandler = (e) => {
    setFeePlan(e)
  }

  const showModalHandler = () => {
    setShowModal(true)
    fetchAllFeePlans(session, erp, alert, user)
  }

  const hideModalHandler = () => {
    setShowModal(false)
  }

  const getfeeDetails = () => {
    let feeList = null
    if (feeManageMentLists && feeManageMentLists.length > 0) {
      feeList = feeManageMentLists && feeManageMentLists.length > 0
        ? feeManageMentLists.map((val, index) => {
          return (
            <TableRow key={val.id}>
              <TableCell align='left'>
                <input
                  type='checkbox'
                  style={{ width: '20px', height: '20px' }}
                  checked={isChecked[val.id]}
                  onChange={(e) => { checkboxChangeHandler(e, val.id) }}
                />
              </TableCell>
              <TableCell align='left'>{val.fee_type_name && val.fee_type_name.fee_type_name ? val.fee_type_name.fee_type_name : ''}</TableCell>
              <TableCell align='left'>{val.fee_plan_name && val.fee_plan_name.fee_plan_name ? val.fee_plan_name.fee_plan_name : ''}</TableCell>
              <TableCell align='left'>{val.amount ? val.amount : 0}</TableCell>
            </TableRow>
          )
        })
        : 'No Data!'
    }
    return feeList
  }

  const saveChangeHandler = () => {
    if (feePlan) {
      let data = {
        fee_plan_name: feePlan.value,
        erp_code: [erp],
        academic_year: session
      }
      editStudentFeePlan(data, alert, user)
      hideModalHandler()
    } else {
      alert.warning('Select Fee Plan')
    }
  }

  const chngFeePlan = () => {
    let plan = null
    if (currentFeePlan && currentFeePlan.length > 0) {
      plan = (
        <React.Fragment>
          <div style={{ padding: '20px' }}>
            <label style={{ fontSize: '18px', fontWeight: 'bold' }}>Current Fee Plan :</label>&nbsp;{currentFeePlan[0].fee_plan_name.fee_plan_name || ''}
            <Fab size='small' color='primary' style={{ marginLeft: '10px' }} onClick={() => showModalHandler()}>
              <Edit style={{ cursor: 'pointer' }} />
            </Fab><br />
            <label style={{ fontSize: '18px', fontWeight: 'bold' }}>Status :</label>&nbsp;{currentFeePlan[0].fee_plan_name.status || ''}
          </div>
        </React.Fragment>
      )
    }
    return plan
  }

  const feeMangTable = () => {
    let data = null
    if (session && erp && erp.length >= 0 && getData && feeManageMentLists && feeManageMentLists.length > 0) {
      data = (
        <React.Fragment>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align='left'>Fee Type Name</TableCell>
                  <TableCell align='left'>Fee Plan</TableCell>
                  <TableCell align='left'>Fee Plan Amount Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getfeeDetails()}
              </TableBody>
            </Table>
          </div>
          <div>
            <Button
              color='primary'
              size='large'
              variant='outlined'
              onClick={submitRecords}
            >
              Reassign
            </Button>
          </div>
        </React.Fragment>
      )
    } else {
      data = (
        <div>No Records Found !!!</div>
      )
    }
    return data
  }

  const submitRecords = () => {
    const checkedRow = Object.keys(isChecked).filter(ele => isChecked[ele])
    if (checkedRow.length > 0) {
      const filterData = feeManageMentLists && feeManageMentLists.filter(ele => checkedRow.includes(ele.id.toString()))
      const data = {
        fee_management: filterData,
        erp_code: erp,
        academic_year: session
      }
      assignFeeManagement(data, alert, user)
    } else {
      alert.warning('Select Atleast One Fee Type')
    }
  }

  let changeModal = null
  if (showModal) {
    changeModal = (
      <Modal open={showModal} medium click={hideModalHandler}>
        <Typography align='center'>Change Fee Plan</Typography>
        <Divider style={{ margin: '15px 0px' }} />
        <div style={{ marginLeft: '20px' }}>
          <Grid container spacing={2} alignItems='center' justify='center'>
            <Grid item xs={10} style={{ marginBottom: '15px' }}>
              <label>Fee Plans*</label>
              <Select
                placeholder='Select Fee Plan'
                value={feePlan || ''}
                options={
                  feePlans && feePlans.length > 0
                    ? feePlans.map(fp => ({
                      value: fp.id ? fp.id : '',
                      label: fp.fee_plan_name ? fp.fee_plan_name : ''
                    }))
                    : []
                }
                onChange={feePlansHandler}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                // className={classes.approvalButton}
                color='primary'
                size='large'
                variant='contained'
                onClick={saveChangeHandler}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    )
  }

  // const feeMangTable = useCallback(() => {
  //   let data = null
  //   if (session && erp && erp.length >= 0 && getData && feeManageMentLists && feeManageMentLists.length > 0) {
  //     data = (
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell />
  //             <TableCell align='left'>Fee Type Name</TableCell>
  //             <TableCell align='left'>Fee Plan</TableCell>
  //             <TableCell align='left'>Fee Plan Amount Amount</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {getfeeDetails()}
  //         </TableBody>
  //       </Table>
  //     )
  //   } else {
  //     data = (
  //       <div>No Records Found !!!</div>
  //     )
  //   }
  //   return data
  // }, [session, erp, getData, feeManageMentLists])

  return (
    <React.Fragment>
      <Typography variant='h5'>Fee Management</Typography>
      <div style={{ marginBottom: '15px' }}>
        {chngFeePlan()}
      </div>
      <div style={{ overflow: 'auto', width: '100%' }}>
        {feeManageMentLists && feeManageMentLists.length > 0 ? feeMangTable() : ''}
      </div>
      {changeModal}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

FeeManagement.propTypes = {
  session: PropTypes.string.isRequired,
  alert: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.string.isRequired,
  getData: PropTypes.bool.isRequired,
  erp: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  feeManageMentLists: state.finance.accountantReducer.feeManagement.feeManagementList,
  feePlans: state.finance.accountantReducer.feeManagement.feePlans,
  currentFeePlan: state.finance.accountantReducer.feeManagement.currentFeePlan,
  studentList: state.finance.accountantReducer.changeFeePlan.studentList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchFeeMangement: (session, erp, alert, user) => dispatch(actionTypes.fetchFeeManagementList({ session, erp, alert, user })),
  assignFeeManagement: (data, alert, user) => dispatch(actionTypes.assignFeemanagementList({ data, alert, user })),
  editStudentFeePlan: (data, alert, user) => dispatch(actionTypes.editStudentFee({ data, alert, user })),
  fetchAllFeePlans: (session, erp, alert, user) => dispatch(actionTypes.fetchFeePlanPerErp({ session, erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(FeeManagement)
// export default (FeeManagement)
