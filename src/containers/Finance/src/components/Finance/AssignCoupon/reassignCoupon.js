import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import {
  Button,
  // Typography,
  // Tab, Tabs, AppBar,
  // Fab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TextField
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
// import { ReAssignCoupon } from '.'
// import { FilterInnerComponent, filterMethod } from '../FilterInnerComponent/filterInnerComponent'
// import { student } from '../../../masters'

// function TabContainer ({ children, dir }) {
//   return (
//     <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
//       {children}
//     </Typography>
//   )
// }

// TabContainer.propTypes = {
//   children: PropTypes.node.isRequired
// }
const ReAssignCoupon = ({ classes, session, branches, sessionData, gradeData, erpIdDelete, erpCouponHistory, couponHistory, allSectionsData, branchData, couponDelete, sectionData, fetchBranches, assignErp, couponList, listCoupon, couponReAssignedToStudent, fetchErpList, erpList, fetchGradesPerBranch, fetchAllSectionsPerGradeAsAdmin, alert, user, dataLoading, gradesPerBranch, sections }) => {
  // const [sessionData, setSessionData] = useState(null)
  // const [branchData, setBranchData] = useState([])
  // const [sectionData, setSectionData] = useState(null)
  // const [gradeData, setGradeData] = useState(null)
  const [isChecked, setisChecked] = useState({})
  const [checkedAll, setCheckedAll] = useState(false)
  const [showTabs, setShowTab] = useState(false)
  // const [value, setValue] = useState('one')
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
  // const [singleErpAllcoupon, setSingleErpAllcoupon] = useState([])
  const [allsec, setAllSec] = useState(null)
  const [idToDelete, setIdtoDelete] = useState([])
  const [applicableTo, setApplicableTo] = useState(null)
  const [deleteCouponModal, setDeleteCouponModal] = useState(false)
  // const [deleteErp, setDeleteErp] = useState(false)

  useEffect(() => {
    listCoupon(alert, user)
    if (sessionData && gradeData && branchData && sectionData && sections) {
      if (sectionData.value === 'all') {
        let allsecs = []
        sections.map((val) => {
          allsecs.push(val.section.id)
        })
        // allsecs.splice(0, 1)
        setAllSec(allsecs)
        setIsCouponAssign(true)
        setShowTab(true)
        fetchErpList(sessionData.value, gradeData.value, branchData.value, [...allsecs], alert, user)
      } else {
        fetchErpList(sessionData.value, gradeData.value, branchData.value, sectionData.value, alert, user)
        setIsCouponAssign(true)
        setShowTab(true)
      }
    }
    console.log('history', couponHistory)
  }, [alert, allSectionsData, branchData, couponHistory, fetchErpList, gradeData, listCoupon, sectionData, sections, sessionData, user])

  useEffect(() => {
    setStudentErpList(assignErp)
    // if (assignErp) {
    //   let a = assignErp
    //   let b = []
    //   for (let i = 0; i < a.length; i++) {
    //     if ((a[i].student && a[i].student.erp) === (a[i + 1].student && a[i + 1].student.erp) && (+a[i].createdAt > +a[i + 1].createdAt)) {
    //       b.push(a[i])
    //     }
    //   }
    //   console.log('b++', b)
    //   console.log('a', a)
    // }
  }, [assignErp])
  // useEffect(() => {
  // if (erpIdDelete) {
  //   let a = assignErp
  // a.map((val) => {
  //   if (val.id === idToDelete) {
  //     a.splice(val, 1)
  //   }
  // })
  //   console.log('qw', idToDelete)
  //   idToDelete.forEach((val) => {
  //     a.map((e) => {
  //       if (e.id === val) {
  //         let index = a.indexOf(e)
  //         a.splice(index, 1)
  //       }
  //     })
  //   })
  //   setStudentErpList(a)
  // }
  // }, [assignErp, erpIdDelete, idToDelete])

  // const handleClickSessionYear = (e) => {
  //   setSessionData(e)
  //   fetchBranches(e.value, alert, user)
  //   setShowTab(false)
  // }
  // const changehandlerbranch = (e) => {
  //   setBranchData(e)
  //   fetchGradesPerBranch(alert, user, sessionData.value, e.value)
  //   setShowTab(false)
  // }
  // const gradeHandler = (e) => {
  //   console.log(e.value)
  //   setGradeData(e)
  //   setShowTab(false)
  //   // setGradeId(e.value)
  //   fetchAllSectionsPerGradeAsAdmin(sessionData.value, alert, user, e.value, branchData.value)
  // }
  // const sectionHandler = (e) => {
  //   setSectionData(e)
  // }
  // const studentErp = () => {
  //   if (sessionData && gradeData && branchData && sectionData) {
  //     setShowTab(true)
  //     setIsCouponAssign(true)
  //     fetchErpList(sessionData.value, gradeData.value, branchData.value, sectionData.value, alert, user)
  //   } else {
  //     alert.warning('Fill all the Fields!')
  //   }
  // }
  const couponListHandler = (e) => {
    // listCoupon(alert, user)
    setCoupon(e)
  }
  // const singleCouponListHandler = (e) => {
  //   setSingleCoupon(e)
  // }
  // const showEditModalHandler = (studentId, erp, coupId, cou) => {
  //   let a = []
  //   a.push(erp)
  //   setErpCode(a)
  //   setSingleCoupon({
  //     value: coupId,
  //     label: cou
  //   })
  //   setStudentId(studentId)
  //   setEditModal(true)
  // }
  // const assignSingleErpCouponHandler = () => {
  //   console.log('stid', studentId)
  //   if (singlecoupon && erpCode) {
  //     setEditModal(false)
  //     const data = {
  //       coupon: singlecoupon.value,
  //       erp: erpCode,
  //       academic_year: sessionData.value,
  //       branch_id: branchData.value,
  //       grade_id: gradeData.value
  //     }
  //     console.log('singlecoupon', data)
  //     couponAssignedToStudent(data, alert, user)
  //     alert.success('Coupon Assigned Successfully!')
  //   } else {
  //     alert.warning('Select Student Erp and Coupon!')
  //   }
  // }
  // const hideEditModalHandler = () => {
  //   setEditModal(false)
  // }

  // let changeModal = null
  // if (editModal) {
  //   changeModal = (
  //     <Modal open={editModal} click={hideEditModalHandler}>
  //       <h3 style={{ textAlign: 'center' }}>Assign Coupon</h3>
  //       <hr />
  //       {studentId
  //         ? <div style={{ marginLeft: '20px' }}>
  //           <Grid container spacing={3} style={{ padding: 15 }}>
  //             <Grid item xs='4'>
  //               <label>Coupon*</label>
  //               <Select
  //                 placeholder='Coupon'
  //                 style={{ width: '100px' }}
  //                 value={singlecoupon}
  //                 options={
  //                   couponList
  //                     ? couponList.filter((cou) => cou.active).map(fp => ({
  //                       value: fp.id,
  //                       label: fp.coupon
  //                     }))
  //                     : []
  //                 }
  //                 onChange={singleCouponListHandler}
  //               />
  //             </Grid>
  //             <Grid item xs='3'>
  //               <Button
  //                 style={{ marginTop: '20px' }}
  //                 variant='contained'
  //                 color='primary'
  //                 onClick={assignSingleErpCouponHandler}>
  //                   Assign
  //               </Button>
  //             </Grid>
  //           </Grid>
  //         </div>
  //         : null
  //       }
  //     </Modal>
  //   )
  // }
  const deleteCouponHandler = (id, erp) => {
    const data = {
      id: id,
      erp: erp
    }
    let a = []
    a.push(id)
    setIdtoDelete(a)
    setDeleteCouponModal(true)
    // couponDelete(id, alert, user)
    // setShowTab(true)
    console.log('data', data)
  }
  const studentAllcoupondetail = (erp) => {
    let arr = []
    assignErp && assignErp.map((val) => {
      if (val.erp === erp || (val.student && val.student.erp === erp)) {
        arr.push(val)
      }
    })
    erpCouponHistory(erp, alert, user)
    // setSingleErpAllcoupon(arr)
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
            <TableCell style={{ fontSize: 16 }}>Applicable To</TableCell>
            <TableCell style={{ fontSize: 16 }}>Discount</TableCell>
            <TableCell style={{ fontSize: 16 }}>Valid</TableCell>
            <TableCell style={{ fontSize: 16 }}>Applicable</TableCell>
            <TableCell style={{ fontSize: 16 }}>Used</TableCell>
          </TableHead>
          <TableBody>
            { assignErp && couponHistory && couponHistory.map((val) => {
              if (val.coupon) {
                return (
                  <TableRow>
                    <TableCell />
                    <TableCell>{(val.coupon && val.coupon.coupon) ? (val.coupon && val.coupon.coupon) : ''} </TableCell>
                    <TableCell>{val.applicable_to === 'both' ? 'Stationary/Uniform' : val.applicable_to }</TableCell>
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

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = studentErpList && studentErpList.map((val, i) => {
      return {
        id: val.id,
        check: <input
          type='checkbox'
          name='checking'
          value={i + 1}
          // disabled={val.coupon && val.coupon.coupon}
          checked={isChecked[val.id]}
          onChange={
            (e) => { checkBoxHandler(e, val.id) }
          } />,
        erpCode: val.student ? val.student.erp : '',
        coupon: val.student && val.coupon && val.coupon.coupon ? val.coupon.coupon : '',
        applicableTo: <p style={{ overflowX: 'scroll' }}> {val.applicable_to === 'both' ? 'Stationary/Uniform' : val.applicable_to}</p>,
        valid: val.student && val.is_coupon_valid ? 'Yes' : val.student && 'No',
        applicable: val.student && val.is_coupon_applicable ? 'Yes' : val.student && 'No',
        used: val.student && val.is_coupon_used ? 'Yes' : val.student && 'No',
        // Edit: <Fab size='small' color='primary' style={{ marginBottom: '30px' }} onClick={() => showEditModalHandler(val.id, val.erp ? val.erp : (val.student && val.student.erp), val.coupon && val.coupon.id, val.coupon && val.coupon.coupon)}>
        //   <Edit style={{ cursor: 'pointer' }} />
        // </Fab>,
        view: val.student && <Button
          // style={{ marginTop: '25px' }}
          variant='contained'
          color='primary'
          // disabled={!this.state.changedFeePlanId}
          onClick={() => studentAllcoupondetail((val.student && val.student.erp))}
        >
        View Details
        </Button>,
        delete: val.student && <Button
        // style={{ marginTop: '25px' }}
          variant='contained'
          color='primary'
          // disabled={!this.state.changedFeePlanId}
          onClick={() => deleteCouponHandler(val.id, val.student && val.student.erp)}
        >
      DELETE
        </Button>
      }
    })
    return dataToShow
  }
  const checkAllStudentsHandler = (e) => {
    const checked = {}
    if (assignErp && assignErp.length > 0) {
      assignErp.forEach(ele => {
        if (ele.student && ele.student.erp) {
          checked[ele.id] = e.target.checked
        }
      })
      setisChecked(checked)
      setCheckedAll(!checkedAll)
    }
  }

  const erpSearchHandler = (e) => {
    console.log('studenrList', erpList)
    const filteredArr = assignErp && assignErp.filter(stu => (stu.student && +stu.student.erp.includes(+e.target.value)) || (stu.erp && +stu.erp.includes(+e.target.value)))
    setErpSearchValue(e.target.value)
    setStudentErpList(filteredArr)
  }
  // let studentErpTable = null
  // let checkedAlls = null
  // if (assignErp && assignErp.length > 0) {
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
  //         Header: 'Applicale To',
  //         accessor: 'applicableTo',
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
  //       },
  //       {
  //         Header: 'Delete Coupon',
  //         accessor: 'delete',
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
  // const handleChange = (event, value) => {
  //   setValue(value)
  // }
  // let tabBar = null
  // if (showTabs) {
  //   tabBar = (
  //     <React.Fragment>
  //       <AppBar position='static' style={{ zIndex: 0 }}>
  //         <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
  //           <Tab value='one' label='Assign Coupon' />
  //         </Tabs>
  //       </AppBar>
  //     </React.Fragment>
  //   )
  // }
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
              <Table>
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
  const applicableHandler = (e) => {
    setApplicableTo(e)
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
    finalitems = assignErp && assignErp.filter(item => rowId.includes(item.id + ''))

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
      if (ele.student && ele.student.erp) {
        return (
          erpArr.push(ele.student && ele.student.erp)
        )
      }
    })
    console.log('the erpArrrr', erpArr)
    console.log('rowid', rowId)
    console.log('erplist', erpList)
    if (coupon && erpArr && erpArr.length > 0 && applicableTo) {
      if (sectionData.value === 'all') {
        const data = {
          coupon: coupon.value,
          erp: erpArr,
          academic_year: sessionData.value,
          branch_id: branchData.value,
          grade_id: gradeData.value,
          section: [...allsec],
          applicable_to: applicableTo.value
        }
        console.log('data++', data)
        listCoupon(alert, user)
        couponReAssignedToStudent(data, alert, user)
        setisChecked(false)
        setCheckedAll(!checkedAll)
      } else {
        const data = {
          coupon: coupon.value,
          erp: erpArr,
          academic_year: sessionData.value,
          branch_id: branchData.value,
          grade_id: gradeData.value,
          section: [sectionData.value],
          applicable_to: applicableTo.value
        }
        console.log('data++', data)
        couponReAssignedToStudent(data, alert, user)
        listCoupon(alert, user)
        setisChecked(false)
        setCheckedAll(!checkedAll)
      }
    } else {
      alert.warning('Select student Erp, Applicable To and Coupon!')
    }
  }
  const hideDeleteModal = () => {
    setDeleteCouponModal(false)
    // setDeleteErp(false)
  }
  const deleteHandler = () => {
    // const data = {
    //   id: id,
    //   erp: erp
    // }
    // let a = []
    // a.push(id)
    // setIdtoDelete(a)
    // setDeleteErp(true)
    couponDelete(idToDelete, alert, user)
    setShowTab(true)
    // console.log('data', data)
    setDeleteCouponModal(false)
  }
  let deleteModal
  if (deleteCouponModal) {
    deleteModal = (
      <Modal open={deleteCouponModal} click={hideDeleteModal} small>
        <label><p style={{ textAlign: 'center', marginTop: 10 }}> Are You Sure ? </p></label>
        <hr />
        <Grid container spacing={3} direction='row' justify='space-around' alignItems='flex-end'>
          <Grid item xs='4'>
            <Button
              style={{ marginTop: 35 }}
              variant='contained'
              color='primary'
              onClick={hideDeleteModal}
            >
            GO BACK
            </Button>
          </Grid>
          <Grid item xs='4'>
            <Button
              style={{ marginTop: 35 }}
              variant='contained'
              color='primary'
              onClick={deleteHandler}
            >
            DELETE
            </Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }
  const deleteAllCouponHandler = () => {
    let rowId = []
    console.log('ischecked', isChecked)
    Object.keys(isChecked).forEach((key) => {
      if (isChecked[key]) {
        rowId.push(key)
      }
    })
    let finalitems = []
    let erpArr = []
    finalitems = assignErp && assignErp.filter(item => rowId.includes(item.id + ''))
    finalitems.forEach(ele => {
      if (ele.student && ele.student.erp) {
        return (
          erpArr.push(ele.id)
        )
      }
    })
    let id = [...erpArr]
    console.log('id', id)
    if (id && erpArr && erpArr.length > 0) {
      couponDelete(id, alert, user)
      // setIdtoDelete(erpArr)
    } else {
      alert.warning('Select Erp to Delete Coupon!')
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
        <Grid item xs='2'>
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
        <Grid item xs='2'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            onClick={saveMultiChangeHandler}
          >
            CHANGE COUPON
          </Button>
        </Grid>
        <Grid item xs='2'>
          <Button
            style={{ marginTop: '25px' }}
            variant='contained'
            color='primary'
            onClick={deleteAllCouponHandler}
          >
            DELETE COUPON
          </Button>
        </Grid>
      </Grid>
    )
  }
  return (
    <div>
      { showTabs
        ? <div>
          {/* {checkedAlls} */}
          {/* {studentErpTable} */}
          {multiChange}
          {couponDetail}
          {detailsModal}
        </div>
        : []
      }
      {deleteModal}
      { dataLoading ? <CircularProgress open /> : null }
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeList: state.finance.common.gradeList,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  sections: state.finance.common.sectionsPerGradeAdmin,
  erpList: state.finance.assignCoupon.erpList,
  couponList: state.finance.createCoupon.couponList,
  assignErp: state.finance.assignCoupon.assignErp,
  couponHistory: state.finance.assignCoupon.couponHistory,
  erpIdDelete: state.finance.assignCoupon.erpIdDelete
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchErpList: (session, grade, branch, section, alert, user) => dispatch(actionTypes.fetchErpList({ session, grade, branch, section, alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId })),
  listCoupon: (alert, user) => dispatch(actionTypes.listCoupon({ alert, user })),
  // couponAssignedToStudent: (data, alert, user) => dispatch(actionTypes.couponAssignedToStudent({ data, alert, user })),
  couponReAssignedToStudent: (data, alert, user) => dispatch(actionTypes.couponReAssignedToStudent({ data, alert, user })),
  couponDelete: (id, alert, user) => dispatch(actionTypes.couponDelete({ id, alert, user })),
  erpCouponHistory: (erp, alert, user) => dispatch(actionTypes.erpCouponHistory({ erp, alert, user }))
  // fetchAllSection: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId }))
})

export default connect(mapStateToProps, mapDispatchToProps)((ReAssignCoupon))
