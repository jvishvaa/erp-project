import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Typography,
  Tab, Tabs, AppBar,
  // Fab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TextField,
  TablePagination
//   withStyles
} from '@material-ui/core'
// import { Edit } from '@material-ui/icons'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import Modal from '../../../ui/Modal/modal'
import { apiActions } from '../../../_actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import { ReAssignCoupon } from '.'
import Layout from '../../../../../Layout'
// import { FilterInnerComponent, filterMethod } from '../FilterInnerComponent/filterInnerComponent'
// import { student } from '../../../masters'

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
const AssignCoupon = ({ classes, session, branches, fetchBranches, assignErp, couponList, listCoupon, couponAssignedToStudent, fetchErpList, erpList, fetchGradesPerBranch, fetchAllSectionsPerGradeAsAdmin, alert, user, dataLoading, gradesPerBranch, sections }) => {
  const [sessionData, setSessionData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [isChecked, setisChecked] = useState({})
  const [checkedAll, setCheckedAll] = useState(false)
  const [showTabs, setShowTab] = useState(false)
  const [value, setValue] = useState('')
  const [coupon, setCoupon] = useState('')
  // const [singlecoupon, setSingleCoupon] = useState('')
  // const [erpCode, setErpCode] = useState([])
  // const [studentId, setStudentId] = useState(null)
  // const [editModal, setEditModal] = useState(false)
  const [couponDetailModal, setCouponDetailModal] = useState(false)
  const [isCouponAssign, setIsCouponAssign] = useState(false)
  const [erpSearchValue, setErpSearchValue] = useState(null)
  const [studentErpList, setStudentErpList] = useState(null)
  const [studentdetailModal, setStudentdetailModal] = useState(false)
  const [singleErpAllcoupon, setSingleErpAllcoupon] = useState([])
  const [allSectionsData, setAllSectionsData] = useState([])
  const [applicableTo, setApplicableTo] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    listCoupon(alert, user)
  }, [alert, listCoupon, user])

  useEffect(() => {
    setStudentErpList(erpList)
  }, [erpList])
  useEffect(() => {
    if (value === 'one' && sessionData && branchData && gradeData && sectionData) {
      if (sectionData.value === 'all') {
        // setShowTab(true)
        // setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, [...allSectionsData], alert, user)
      } else if (sessionData && gradeData && branchData && sectionData) {
        // setShowTab(true)
        // setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, sectionData.value, alert, user)
      }
    }
  }, [alert, branchData, value, fetchErpList, gradeData, sectionData, sessionData, user, allSectionsData])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickSessionYear = (e) => {
    setSessionData(e)
    fetchBranches(e.value, alert, user)
    setShowTab(false)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    fetchGradesPerBranch(alert, user, sessionData.value, e.value)
    setShowTab(false)
  }
  const gradeHandler = (e) => {
    console.log(e.value)
    setGradeData(e)
    setShowTab(false)
    // setGradeId(e.value)
    fetchAllSectionsPerGradeAsAdmin(sessionData.value, alert, user, e.value, branchData.value)
  }
  const sectionHandler = (e) => {
    let allsec = []
    if (e.value === 'all') {
      sections.map((val) => {
        allsec.push(val.section.id)
      })
      allsec.splice(0, 1)
      setAllSectionsData(allsec)
      setSectionData(e)
      setValue('')
      setShowTab(false)
    }
    setSectionData(e)
    setShowTab(false)
    setValue('')
  }
  const studentErp = () => {
    if (sessionData && gradeData && branchData && sectionData) {
      if (sectionData.value === 'all') {
        setValue('one')
        setShowTab(true)
        setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, [...allSectionsData], alert, user)
      } else if (sessionData && gradeData && branchData && sectionData) {
        setValue('one')
        setShowTab(true)
        setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, sectionData.value, alert, user)
      }
    } else {
      alert.warning('Fill all the Fields!')
    }
  }
  const couponListHandler = (e) => {
    // listCoupon(alert, user)
    setCoupon(e)
  }
  const applicableHandler = (e) => {
    setApplicableTo(e)
  }
  
  const studentAllcoupondetail = (erp) => {
    let arr = []
    erpList && erpList.map((val) => {
      if (val.erp === erp || (val.student && val.student.erp === erp)) {
        arr.push(val)
      }
    })
    setSingleErpAllcoupon(arr)
    console.log('allcoupon', arr)
    setStudentdetailModal(true)
  }
  const hideDetailsModal = () => {
    setStudentdetailModal(false)
  }
  let detailsModal = null
  if (studentdetailModal) {
    detailsModal = (
      <Modal open={studentdetailModal} click={hideDetailsModal}>
        <h3 style={{ textAlign: 'center' }}>Coupon Details</h3>
        <hr />
        <Table>
          <TableHead>
            <TableCell />
            <TableCell style={{ fontSize: 16 }}><b>Coupon</b></TableCell>
            <TableCell style={{ fontSize: 16 }}>Discount</TableCell>
            <TableCell style={{ fontSize: 16 }}>Valid</TableCell>
            <TableCell style={{ fontSize: 16 }}>Applicable</TableCell>
            <TableCell style={{ fontSize: 16 }}>Used</TableCell>
          </TableHead>
          <TableBody>
            { erpList && singleErpAllcoupon && singleErpAllcoupon.map((val) => {
              if (val.coupon) {
                return (
                  <TableRow>
                    <TableCell />
                    <TableCell>{(val.coupon && val.coupon.coupon) ? (val.coupon && val.coupon.coupon) : ''} </TableCell>
                    <TableCell> {val.coupon.discount ? val.coupon.discount : '' }</TableCell>
                    <TableCell> {val.is_coupon_valid ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{ val.is_coupon_applicable ? 'Yes' : 'No'} </TableCell>
                    <TableCell>{val.is_coupon_used ? 'Yes' : 'No'} </TableCell>
                  </TableRow>
                )
              }
            })
            }
          </TableBody>
        </Table>
      </Modal>
    )
  }

  // const renderStudentErpTable = () => {
  //   let dataToShow = []
  //   dataToShow = studentErpList && studentErpList.map((val, i) => {
  //     return {
  //       id: val.id,
  //       check: val.erp && <input
  //         type='checkbox'
  //         name='checking'
  //         value={i + 1}
  //         disabled={val.coupon && val.coupon.coupon}
  //         checked={isChecked[val.id]}
  //         onChange={
  //           (e) => { checkBoxHandler(e, val.id) }
  //         } />,
  //       erpCode: val.erp ? val.erp : '',
  //       coupon: val.erp && val.coupon && val.coupon.coupon ? val.coupon.coupon : '',
  //       valid: val.erp && val.coupon && val.is_coupon_valid ? 'Yes' : val.coupon && val.erp && 'No',
  //       applicable: val.erp && val.coupon && val.is_coupon_applicable ? 'Yes' : val.coupon && val.erp && 'No',
  //       used: val.erp && val.coupon && val.is_coupon_used ? 'Yes' : val.coupon && val.erp && 'No',
  //       // Edit: <Fab size='small' color='primary' style={{ marginBottom: '30px' }} onClick={() => showEditModalHandler(val.id, val.erp ? val.erp : (val.student && val.student.erp), val.coupon && val.coupon.id, val.coupon && val.coupon.coupon)}>
  //       //   <Edit style={{ cursor: 'pointer' }} />
  //       // </Fab>,
  //       view: val.erp && <Button
  //         // style={{ marginTop: '25px' }}
  //         variant='contained'
  //         color='primary'
  //         // disabled={!this.state.changedFeePlanId}
  //         onClick={() => studentAllcoupondetail(val.erp)}
  //       >
  //       View Details
  //       </Button>
  //     }
  //   })
  //   return dataToShow
  // }
  const checkAllStudentsHandler = (e) => {
    const checked = {}
    if (erpList && erpList.length > 0) {
      erpList.forEach(ele => {
        if (ele.erp) {
          checked[ele.id] = e.target.checked
        }
      })
      setisChecked(checked)
      setCheckedAll(!checkedAll)
    }
  }

  const erpSearchHandler = (e) => {
    console.log('studenrList', erpList)
    const filteredArr = erpList && erpList.filter(stu => (stu.student && +stu.student.erp.includes(+e.target.value)) || (stu.erp && +stu.erp.includes(+e.target.value)))
    setErpSearchValue(e.target.value)
    setStudentErpList(filteredArr)
  }
  // let studentErpTable = null
  // let checkedAlls = null
  // if (erpList && erpList.length > 0) {
  //   checkedAlls = (
  //     <div style={{ display: 'flex' }}>
  //       <div style={{ padding: '10px' }}>
  //         <input
  //           type='checkbox'
  //           style={{ width: '20px', height: '20px', paddingBottom: '35px' }}
  //           checked={checkedAll || false}
  //           onChange={checkAllStudentsHandler}
  //         /> &nbsp; <b>Select All Students</b>
  //       </div>
  //       <div>
  //         <TextField
  //           id='erp1'
  //           label='Search ERP'
  //           type='number'
  //           variant='outlined'
  //           value={erpSearchValue || ''}
  //           style={{ zIndex: 0, marginTop: '0px', marginBottom: 20 }}
  //           onChange={erpSearchHandler}
  //           InputLabelProps={{ shrink: true }}
  //           InputProps={{
  //             style: {
  //               height: 35
  //             }
  //           }}
  //         />
  //       </div>
  //     </div>
  //   )
  //   studentErpTable = <ReactTable
  //     data={renderStudentErpTable()}
  //     manual
  //     columns={[
  //       {
  //         Header: 'Select',
  //         accessor: 'check',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'ERP Code',
  //         accessor: 'erpCode',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Coupon',
  //         accessor: 'coupon',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Vaild',
  //         accessor: 'valid',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Applicable',
  //         accessor: 'applicable',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       {
  //         Header: 'Used',
  //         accessor: 'used',
  //         // inputFilterable: true,
  //         // exactFilterable: true,
  //         filterable: false,
  //         sortable: true
  //       },
  //       // {
  //       //   Header: 'Edit',
  //       //   accessor: 'Edit',
  //       //   filterable: false,
  //       //   sortable: true
  //       // },
  //       {
  //         Header: 'View Details',
  //         accessor: 'view',
  //         filterable: false,
  //         sortable: true
  //       }
  //     ]}
  //     filterable
  //     sortable
  //     defaultPageSize={0}
  //     showPageSizeOptions={false}
  //     className='-striped -highlight'
  //     // Controlled props
  //     // page={this.state.page}
  //     // Callbacks
  //     // onPageChange={page => this.pageChangeHandler(page)}
  //   />
  // }

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
  const handleChange = (event, value) => {
    setValue(value)
  }
  let tabBar = null
  if (showTabs) {
    tabBar = (
      <React.Fragment>
        <AppBar position='static' style={{ zIndex: 0 }}>
          <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
            <Tab value='one' label='Assign Coupon' />
            <Tab value='two' label='ReAssign Coupon' />
          </Tabs>
        </AppBar>
      </React.Fragment>
    )
  }
  const hideCouponDetailModalHandler = () => {
    setCouponDetailModal(false)
  }
  let couponDetail = null
  if (couponDetailModal) {
    couponDetail = (
      <Modal open={couponDetailModal} click={hideCouponDetailModalHandler}>
        <h3 style={{ textAlign: 'center' }}>Coupon Details</h3>
        <hr />
        {couponList && couponList.map((cou) => {
          if (cou.id === coupon.value) {
            return (
              <Table style={{ textAlign: 'center' }}>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Coupon :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.coupon}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Valid From :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.valid_from && (cou.valid_from).split('T').join('   T :-  ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Valid To :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.valid_to && (cou.valid_to).split('T').join('   T :-  ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Discount :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.discount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>Active :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.active ? 'Yes' : 'No'}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>CreatedAt :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.createdAt && (cou.createdAt).split('T').join('   T :-  ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell style={{ fontSize: 16 }}>UpdatedAt :</TableCell>
                  <TableCell style={{ fontSize: 16 }}>{cou.updatedAt && (cou.updatedAt).split('T').join('   T :-  ')}</TableCell>
                </TableRow> */}
              </Table>
            )
          }
        })
        }
      </Modal>
    )
  }
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
    finalitems.forEach(ele => {
      if (ele.erp) {
        return (
          erpArr.push(ele.erp)
        )
      }
    })
    console.log('the erpArrrr', erpArr)
    console.log('rowid', rowId)
    console.log('erplist', erpList)
    if (coupon && erpArr && erpArr.length > 0 && applicableTo) {
      const data = {
        coupon: coupon.value,
        erp: erpArr,
        academic_year: sessionData && sessionData.value,
        branch_id: branchData && branchData.value,
        grade_id: gradeData && gradeData.value,
        applicable_to: applicableTo && applicableTo.value
      }
      console.log('data++', data)
      couponAssignedToStudent(data, alert, user)
      listCoupon(alert, user)
      setCheckedAll(false)
      setisChecked(false)
      if (sessionData && gradeData && branchData && sectionData.value === 'all') {
        // setShowTab(true)
        // setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, [...allSectionsData], alert, user)
      } else if (sessionData && gradeData && branchData && sectionData) {
        // setShowTab(true)
        // setIsCouponAssign(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, sectionData.value, alert, user)
      }
    } else {
      alert.warning('Select student Erp, Applicable to and Coupon!')
    }
  }
  const couponDetailHandler = () => {
    if (coupon) {
      setCouponDetailModal(true)
    } else {
      alert.warning('Select Coupon to see Details of that Coupon')
    }
  }
  let multiChange = null
  if (isCouponAssign) {
    multiChange = (
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item xs='3'>
          <label>Coupon*</label>
          <Select
            placeholder='Select Coupon'
            style={{ width: '100px' }}
            value={coupon}
            options={
              couponList
                ? couponList.filter((cou) => cou.active).map(fp => ({
                  value: fp.id,
                  label: fp.coupon
                }))
                : []
            }
            onChange={couponListHandler}
          />
        </Grid>
        <Grid item xs='3'>
          <label>Applicable To*</label>
          <Select
            placeholder='Applicable To'
            style={{ width: '100px' }}
            value={applicableTo}
            options={[
              {
                value: 'stationary',
                label: 'Stationary'
              },
              {
                value: 'uniform',
                label: 'Uniform'
              },
              {
                value: 'both',
                label: 'Both'
              }
            ]}
            onChange={applicableHandler}
          />
        </Grid>
        <Grid item xs='3'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            // disabled={!this.state.changedFeePlanId}
            onClick={couponDetailHandler}
          >
            View Coupon Details
          </Button>
        </Grid>
        <Grid item xs='3'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            onClick={saveMultiChangeHandler}
          >
            ASSIGN COUPON
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
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={branchData}
            options={
              branches.length
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }
            onChange={changehandlerbranch}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Grades*</label>
          <Select
            placeholder='Select Grade'
            value={gradeData}
            options={
              gradesPerBranch
                ? gradesPerBranch.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                : []
            }
            onChange={gradeHandler}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Section</label>
          <Select
            placeholder='Select Section'
            value={sectionData}
            options={
              sections
                ? sections.map(sec => ({
                  value: sec.section && sec.section.id ? sec.section.id : '',
                  label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                }))
                : []
            }
            onChange={sectionHandler}
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
      {tabBar}
      {showTabs && value === 'one' && <TabContainer>
        {/* {checkedAlls} */}
        {/* {studentErpTable} */}
        {
          <React.Fragment>
               <div style={{ display: 'flex' }}>
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
            <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Select</TableCell>
                      <TableCell> Erp Code</TableCell>
                      <TableCell>Coupon </TableCell>
                      <TableCell> valid</TableCell>
                      <TableCell> Applicable</TableCell>
                      <TableCell>Use</TableCell>
                      {/* <TableCell>Edit</TableCell> */}
                      <TableCell>View Details</TableCell>
                    </TableRow>
                  </TableHead>
                  {studentErpList && studentErpList.length > 0 ?
                  <TableBody>
                  {studentErpList && studentErpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell>{val.erp && <input
          type='checkbox'
          name='checking'
          value={i + 1}
          disabled={val.coupon && val.coupon.coupon}
          checked={isChecked[val.id]}
          onChange={
            (e) => { checkBoxHandler(e, val.id) }
          } />}</TableCell>
                     <TableCell>{val.erp ? val.erp : ''}</TableCell>
                      <TableCell>{val.erp && val.coupon && val.coupon.coupon ? val.coupon.coupon : ''}</TableCell>
                      <TableCell> {val.erp && val.coupon && val.is_coupon_valid ? 'Yes' : val.coupon && val.erp && 'No'}</TableCell>
                      <TableCell> {val.erp && val.coupon && val.is_coupon_applicable ? 'Yes' : val.coupon && val.erp && 'No'}</TableCell>
                      <TableCell>{val.erp && val.coupon && val.is_coupon_used ? 'Yes' : val.coupon && val.erp && 'No'}</TableCell>
                      <TableCell>{val.erp && <Button
          // style={{ marginTop: '25px' }}
          variant='contained'
          color='primary'
          // disabled={!this.state.changedFeePlanId}
          onClick={() => studentAllcoupondetail(val.erp)}
        >
        View Details
        </Button>}</TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
                   : '' }
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={studentErpList && studentErpList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
          </React.Fragment>
        }
        {multiChange}
        {couponDetail}
        {detailsModal}
      </TabContainer>}
      {showTabs && value === 'two' && <TabContainer>
        <ReAssignCoupon sessionData={sessionData} branchData={branchData} sections={sections} gradeData={gradeData} sectionData={sectionData} alert={alert} user={user} />
      </TabContainer>}
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
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  sections: state.finance.common.sectionsPerGradeAdminAllOpt,
  erpList: state.finance.assignCoupon.erpList,
  couponList: state.finance.createCoupon.couponList,
  assignErp: state.finance.assignCoupon.assignErp
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchErpList: (session, grade, branch, section, alert, user) => dispatch(actionTypes.fetchErpList({ session, grade, branch, section, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId })),
  listCoupon: (alert, user) => dispatch(actionTypes.listCoupon({ alert, user })),
  couponAssignedToStudent: (data, alert, user) => dispatch(actionTypes.couponAssignedToStudent({ data, alert, user }))
  // fetchAllSection: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId }))
})

export default connect(mapStateToProps, mapDispatchToProps)((AssignCoupon))
