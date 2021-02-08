import React, {
  useState,
  useEffect
} from 'react'
import { withStyles, Grid, Table, TableRow, TableBody, TableCell, TableHead, Button, Modal, Paper
} from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import zipcelx from 'zipcelx'
// import Select from 'react-select'
// import { apiActions } from '../../../../_actions'
// import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    borderRadius: 4
  }
})

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #fff',
    boxShadow: theme.shadows[5],
    padding: '20px 20px',
    borderRadius: '10px'
    // padding: theme.spacing(2, 4, 3)
  }
}))

const AdjustFeeType = ({
  history,
  dataLoading,
  alert,
  user,
  fetchAdjustFee,
  adjustFeeData,
  saveAdjustFeeTypes,
  studentList,
  excelData,
  ...props }) => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [currFeePlanList, setCurrFeePlanList] = useState([])
  const [currFeePlanValue, setCurrFeePlanValue] = useState(null)
  const [adjustTableList, setAdjustTableList] = useState([])
  const [isChecked, setIsChecked] = useState({})
  const [allChecked, setAllChecked] = useState(false)
  const [normalFeePlan, setNormalFeePlan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newFeeTypes, setNewFeeTypes] = useState([])
  const [adjustFeesIds, setAdjustFeesIds] = useState({})
  // let newFeeTypes = []

  useEffect(() => {
    console.log('props from adjust: ', studentList)
    const currFeePlan = studentList.map((list) => list.fee_plan_name)
    // const filteredFeePlan = currFeePlan.filter((item, index) => )
    const jsonObject = currFeePlan.map(JSON.stringify)
    const uniqueSet = new Set(jsonObject)
    const filteredFeePlan = Array.from(uniqueSet).map(JSON.parse)
    console.log('before filter currFeePlan: ', filteredFeePlan)
    const uniqueFeePlan = Array.from(new Set(filteredFeePlan.map(a => a.id)))
      .map(id => {
        return filteredFeePlan.find(a => a.id === id)
      })
    console.log('after currFeePlan: ', uniqueFeePlan)
    setCurrFeePlanList(uniqueFeePlan)
  }, [studentList])

  useEffect(() => {
    if (currFeePlanValue && currFeePlanValue.value) {
      const filteredStuList = studentList.filter((student, index) => +student.fee_plan_name.id === +currFeePlanValue.value)
      console.log('====filteredStus: ', filteredStuList)
      setAdjustTableList(filteredStuList)
    }
  }, [studentList, currFeePlanValue])

  useEffect(() => {
    const newFee = adjustFeeData.filter(feeType => !feeType.Old)
    console.log('newFeeTypes Horti Condition: ', newFee)
    setNewFeeTypes(newFee)
  }, [adjustFeeData])

  const currFeePlanHandler = (event) => {
    console.log('cuure value: ', event)
    setCurrFeePlanValue(event)
    // const filteredStuList = studentList.filter((student, index) => +student.fee_plan_name.id === +event.value)
    // console.log('====filteredStus: ', filteredStuList)
    // setAdjustTableList(filteredStuList)
  }

  const checkBoxHandler = (e, erp) => {
    if (e.target.checked) {
      setIsChecked({ ...isChecked, [erp]: true })
    } else {
      setIsChecked({ ...isChecked, [erp]: false })
      // setDisablePromote(true)
    }
    setAllChecked(false)
  }

  const allCheckedHandler = (e) => {
    const checked = {}
    if (adjustTableList.length > 0) {
      adjustTableList.forEach((ele) => {
        console.log(ele.student.erp)
        checked[ele.student.erp] = e.target.checked
      })
    }
    setIsChecked(checked)
    setAllChecked(!allChecked)
  }

  const feePlansHandler = (e) => {
    setNormalFeePlan(e)
  }

  const showModalHandler = () => {
    setShowModal(true)
    fetchAdjustFee(currFeePlanValue.value, normalFeePlan.value, alert, user)
  }

  const hideModalHandler = () => {
    setShowModal(false)
    setAdjustFeesIds({})
    setIsChecked({})
    setAllChecked(false)
  }

  const newFeeTypeHandler = (e, feeTypeId) => {
    const ids = e.map(ele => ele.value)
    setAdjustFeesIds({ ...adjustFeesIds, [feeTypeId]: ids })
  }

  const downloadExcelHandler = () => {
    if (!Object.keys(excelData).length) {
      alert.warning('No latest data!')
      return
    }
    console.log(excelData)
    const headers = [
      {
        value: 'ERP',
        type: 'string'
      },
      {
        value: 'Fee Plan',
        type: 'string'
      },
      {
        value: 'Fee Plan Amount',
        type: 'string'
      },
      {
        value: 'Status',
        type: 'string'
      },
      {
        value: 'Error Message',
        type: 'string'
      }
    ]

    const erpList = []
    for (let [key, value] of Object.entries(excelData)) {
      if (key) {
        erpList.push({
          erp: key,
          status: value.change_status,
          amount: value.fee_plan_Amount,
          error: value.err_msg,
          feePlan: value.fee_plan
        })
      }
    }
    console.log('erpList: ', erpList)
    const body = erpList.map(stu => {
      return ([
        {
          value: stu.erp,
          type: 'string'
        },
        {
          value: stu.feePlan,
          type: 'string'
        },
        {
          value: stu.amount,
          type: 'string'
        },
        {
          value: stu.status,
          type: 'string'
        },
        {
          value: stu.error,
          type: 'string'
        }
      ])
    })
    // const body = [
    //   {
    //     value: promoted,
    //     type: 'string'
    //   }
    // ]
    const config = {
      filename: 'Adjust_fee_type_report',
      sheet: {
        data: [headers, ...body]
      }
    }
    zipcelx(config)
  }

  const saveAdjustAmountHandler = () => {
    const verticalCondition = adjustFeeData.filter(feeType => feeType.Old)
    console.log('vertical Condition', verticalCondition)
    if (Object.keys(adjustFeesIds).length === verticalCondition.length) {
      let erpList = []
      for (let [key, value] of Object.entries(isChecked)) {
        if (value) {
          erpList.push(key)
        }
      }
      if (!erpList.length) {
        alert.warning('Select students!')
        return
      }

      for (let [, value] of Object.entries(adjustFeesIds)) {
        if (value.length !== newFeeTypes.length) {
          alert.warning('select all fee types according to priority!')
          return
        }
      }
      let data = {
        target_fee_plan: normalFeePlan && normalFeePlan.value ? normalFeePlan.value : '',
        old_plan_id: currFeePlanValue && currFeePlanValue.value ? currFeePlanValue.value : '',
        grade: props.grade,
        session_year: props.session,
        student_list: erpList,
        adjust_fee_type: adjustFeesIds
      }
      console.log(data)
      saveAdjustFeeTypes(data, alert, user)
      hideModalHandler()
    } else {
      alert.warning('select new fee types!')
    }
  }

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 style={{ textAlign: 'center' }} id='simple-modal-title'>Adjust Fee Types</h2>
      <p style={{ textAlign: 'center', fontSize: '15px' }}>Select new fee types according to <strong>priority</strong></p>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Old FeeTypes ({currFeePlanValue && currFeePlanValue.label ? currFeePlanValue.label : ''})
            </TableCell>
            <TableCell>
              New Fee Types ({normalFeePlan && normalFeePlan.label ? normalFeePlan.label : ''})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adjustFeeData.sort((a, b) => parseFloat(a.fee_type_id) - parseFloat(b.fee_type_id)).map((feeType) => {
            if (feeType.Old) {
              return (
                <TableRow key={feeType.fee_type_id}>
                  <TableCell>{feeType.fee_type_name && feeType.fee_type_name ? feeType.fee_type_name : '-'}</TableCell>
                  <TableCell>
                    <Select
                      placeholder='Adjust fee type'
                      isMulti
                      style={{ width: '200px' }}
                      // value={newFeeType[feeType.id] || ''}
                      options={
                        newFeeTypes && newFeeTypes.length > 0
                          ? newFeeTypes.map(fp => ({
                            value: fp.fee_type_id,
                            label: fp.fee_type_name
                          }))
                          : []
                      }
                      onChange={(e) => { newFeeTypeHandler(e, feeType.fee_type_id) }}
                    />
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
      <Button color='primary' variant='contained' onClick={saveAdjustAmountHandler}>Adjust Amount</Button>
    </div>
  )

  return (
    <Layout>   
      <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Current Fee Plans*</label>
          <Select
            placeholder='Current Fee Plan*'
            style={{ width: '100px' }}
            value={currFeePlanValue || ''}
            options={
              currFeePlanList
                ? currFeePlanList.map(fp => ({
                  value: fp.id,
                  label: fp.fee_plan_name
                }))
                : []
            }
            onChange={currFeePlanHandler}
          />
        </Grid>
        {currFeePlanValue && currFeePlanValue.value
          ? <React.Fragment>
            <Grid item xs={12}>
              <Paper elevation={3} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <input
                          type='checkbox'
                          style={{ width: '15px', height: '15px', marginLeft: '5px' }}
                          checked={allChecked}
                          onChange={allCheckedHandler}
                          color='primary'
                        /><label><b>Select All</b></label>
                      </TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Erp Code</TableCell>
                      <TableCell>Current Fee Plan</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adjustTableList.map((row, i) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell>
                            <input
                              type='checkbox'
                              name='checking'
                              value={i + 1}
                              checked={isChecked[row.student.erp]}
                              onChange={
                                (e) => { checkBoxHandler(e, row.student.erp) }
                              } />
                          </TableCell>
                          <TableCell>{row.student && row.student.name ? row.student.name : '-'}</TableCell>
                          <TableCell>{row.student.erp ? row.student.erp : '-'}</TableCell>
                          <TableCell>{row.fee_plan_name && row.fee_plan_name.fee_plan_name ? row.fee_plan_name.fee_plan_name : 'No Fee Plan'}</TableCell>
                          <TableCell>{row.total ? row.total : '-'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            <Grid item className={classes.item} xs={3}>
              <label>Fee Plans*</label>
              <Select
                placeholder='Select Fee Plan'
                style={{ width: '100px' }}
                value={normalFeePlan || ''}
                options={
                  props.normalFeePlan
                    ? props.normalFeePlan.map(fp => ({
                      value: fp.id,
                      label: fp.fee_plan_name
                    }))
                    : []
                }
                onChange={feePlansHandler}
              />
            </Grid>
            <Grid item className={classes.item} xs={3}>
              <Button style={{ marginTop: 23 }} color='primary' disabled={!normalFeePlan || !Object.keys(isChecked).length} variant='outlined' onClick={showModalHandler}>Adjust Fee Types</Button>
            </Grid>
            <Grid item className={classes.item} xs={3}>
              <Button style={{ marginTop: 23 }} color='secondary' variant='outlined' onClick={downloadExcelHandler}>Download Excel</Button>
            </Grid>
          </React.Fragment>
          : ''}
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
      {showModal ? <Modal
        open={showModal}
        onClose={hideModalHandler}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {modalBody}
      </Modal>
        : ''}
    </React.Fragment>
    </Layout>
  )
}

AdjustFeeType.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  adjustFeeData: state.finance.accountantReducer.changeFeePlan.adjustFeeData,
  studentList: state.finance.accountantReducer.changeFeePlan.studentList,
  excelData: state.finance.accountantReducer.changeFeePlan.excelData
})

const mapDispatchToProps = dispatch => ({
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchAdjustFee: (currentFeePlanId, targetFeePlanId, alert, user) => dispatch(actionTypes.fetchAdjustFee({ currentFeePlanId, targetFeePlanId, alert, user })),
  saveAdjustFeeTypes: (data, alert, user) => dispatch(actionTypes.saveAdjustFeeTypes({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AdjustFeeType)))
