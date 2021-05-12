import React, { useState } from 'react'
import {
//   withStyles
  Button, TableHead, TableCell, Table, TableRow, TableBody, FormControlLabel, Switch
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import Edit from '@material-ui/icons/Edit'
import { connect } from 'react-redux'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { student } from '../../../masters'
import Layout from '../../../../../../Layout'

const SubCategoryAllow = ({ classes, session, branches, fetchBranches, mcreateSubCategory, createSubCategory, fetchUnitColorSubcat, subCatList, fetchSubCategory, subCategory, savePartialPaymentLastDate, partialPayments, fetchGradesPerBranch, fetchAllSection, alert, user, dataLoading, gradesPerBranch, sections }) => {
  const [sessionData, setSessionData] = useState([])
  const [branchData, setBranchData] = useState(null)
  // const [sectionData, setSectionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [partialPaymentGrade, setPartialPaymentGrade] = useState(null)
  const [partialPaymentBranch, setPartialPaymentBranch] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [createBackDate, setCreateBackDate] = useState(false)
  const [update, setUpdate] = useState(false)
  const [compulsoryValue, setCompulsoryValue] = useState(null)
  const [subCat, setSubCat] = useState(null)
  const [applicable, setApplicable] = useState(true)
  // const [disableField, setDisableField] = useState(false)
  //   const [gradeId, setGradeId] = useState(null)

  // const handleClickSessionYear = (e) => {
  //   setSessionData(e)
  //   fetchBranches(e.value, alert, user)
  // }

  const sessionChangeHandler = (e) => {
    setSessionData(e)
    fetchBranches(e.value, alert, user)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    fetchGradesPerBranch(alert, user, sessionData && sessionData.value, e.value)
    setShowTable(false)
  }
  const gradeHandler = (e) => {
    setGradeData(e)
    setShowTable(false)
  }

  // const sectionHandler = (e) => {
  //   setSectionData(e)
  // }

  const getPartialPaymentHandler = (e) => {
    if (sessionData && branchData && gradeData) {
      setShowTable(true)
      setCreateBackDate(false)
      fetchSubCategory(sessionData && sessionData.value, branchData && branchData.value, gradeData && gradeData.value, alert, user)
    } else {
      alert.warning('Fill all required Fields!')
    }
  }
  const hideActionModalHandler = (e) => {
    setShowActionModal(false)
    setApplicable(false)
  }

  const saveLastDate = (e) => {
    if (!compulsoryValue || !subCat) {
      alert.warning('Select the required Fields!')
    }
    if (partialPaymentGrade && partialPaymentBranch && compulsoryValue && subCat && update) {
      let data = {
        // date_of_partial_payment: partPayLastDate,
        // is_applicable: true,
        grade: partialPaymentGrade,
        academic_year: sessionData && sessionData.value,
        branch: partialPaymentBranch,
        is_store_sub_category_applicable: applicable,
        store_sub_category: subCat && subCat.value,
        store_sub_category_compulsory: compulsoryValue && compulsoryValue.value
      }
      createSubCategory(data, alert, user)
      setShowTable(true)
      setShowActionModal(false)
      // setGradeData(null)
      // setBranchData(null)
    }
    if (gradeData && branchData && session && createBackDate && compulsoryValue && subCat) {
      let data = {
        is_store_sub_category_applicable: applicable,
        store_sub_category: subCat && subCat.value,
        store_sub_category_compulsory: compulsoryValue && compulsoryValue.value,
        grade: gradeData && gradeData.value,
        academic_year: sessionData && sessionData.value,
        branch: branchData && branchData.value
      }
      createSubCategory(data, alert, user)
      setShowActionModal(false)
      setCreateBackDate(false)
      // setGradeData(null)
      // setBranchData(null)
      setShowTable(true)
    }
  }
  const compulsoryHandler = (e) => {
    setCompulsoryValue(e)
  }
  const subCatChangeHandler = (e) => {
    setSubCat(e)
  }
  const handleApplicable = (e) => {
    setApplicable(e.target.checked)
  }
  let actionModal = null
  if (showActionModal) {
    actionModal = (
      <Modal open={showActionModal} click={hideActionModalHandler} >
        {createBackDate ? <h3 style={{ textAlign: 'center' }}>Create Sub-Category</h3> : <h3 style={{ textAlign: 'center' }}>Update Sub-Category </h3> }
        <hr />
        <Grid container spacing={3} style={{ padding: '15px' }} >
          {createBackDate
            ? <Grid item xs='6'>
              <label style={{ fontWeight: '20' }}>Store Sub Category*</label>
              <Select
                placeholder='Sub Category'
                value={subCat}
                options={
                  subCatList.length
                    ? subCatList.map(list => ({ value: list.id, label: list.sub_category_name })
                    ) : []}
                onChange={subCatChangeHandler}
              />
            </Grid>
            : []}
          <Grid item xs='6'>
            <label style={{ fontWeight: '20' }}>Is Compulsory*</label>
            <Select
              placeholder='Is Compulsory'
              value={compulsoryValue}
              options={[
                {
                  label: 'Compulsory only for New Students',
                  value: 1
                },
                {
                  label: 'Compulsory only for Old Students',
                  value: 2
                },
                {
                  label: 'Compulsory for Both',
                  value: 3
                }
              ]}
              onChange={compulsoryHandler}
            />
          </Grid>
          <Grid item xs='6' >
            <FormControlLabel
              style={{ marginTop: '10px' }}
              control={
                <Switch
                  checked={applicable}
                  onChange={handleApplicable}
                  value='isActive'
                  color='primary'
                />
              }
              label='Applicable/Not Applicable'
            />
          </Grid>
          <Grid item xs='3'>         <Button
            color='primary'
            style={{ marginTop: '10px' }}
            variant='contained'
            onClick={saveLastDate}
          >
            Save
          </Button>
          </Grid>
          <Grid item xs='3'>
            <Button
              color='primary'
              style={{ marginTop: '10px' }}
              variant='contained'
              onClick={hideActionModalHandler}
            >
            Go Back
            </Button>
          </Grid>
          <Grid item xs='2' />
        </Grid>
      </Modal>
    )
  }
  const showActionModalHandler = (id, grade, branch, sub, comp, app) => {
    if (sub) {
      setSubCat({
        label: sub.sub_category_name,
        value: sub.id
      })
    }
    if (comp === 'Compulsory only for New Students') {
      if (comp) {
        setCompulsoryValue({
          label: comp,
          value: 1
        })
      }
    } else if (comp === 'Compulsory only for Old Students') {
      if (comp) {
        setCompulsoryValue({
          label: comp,
          value: 2
        })
      }
    } else {
      if (comp) {
        setCompulsoryValue({
          label: comp,
          value: 3
        })
      }
    }
    if (app) {
      setApplicable(app)
    }
    setPartialPaymentGrade(grade)
    setShowActionModal(true)
    setCreateBackDate(false)
    setUpdate(true)
    setPartialPaymentBranch(branch)
  }
  const createBackDateHandler = () => {
    if (session && branchData && gradeData) {
      setUpdate(false)
      setCompulsoryValue(null)
      setSubCat(null)
      setShowActionModal(true)
      setCreateBackDate(true)
      fetchUnitColorSubcat(alert, user)
      setApplicable(true)
      setCompulsoryValue({
        label: 'Compulsory for Both',
        value: 3
      })
    } else {
      alert.warning('Select all required Fields!')
    }
  }
  const partialPaymentTable = () => {
    let partialTable = null
    partialTable = (
      <div style={{ marginTop: '60px' }}>
        { subCategory && subCategory.length > 0
          ? <React.Fragment>
            <hr />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: 15 }}><b>S.No</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>GRADE</b> </TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>SUB CATEGORY</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>COMPULSORY</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>APPLICABLE</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>UPDATE</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subCategory && subCategory.map((val, i) => {
                  return (
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{val.grade && val.grade.grade}</TableCell>
                      <TableCell>{val.store_sub_category && val.store_sub_category.sub_category_name} </TableCell>
                      <TableCell>{+val.store_sub_category_compulsory === 1 ? 'Compulsory only for New Students' : +val.store_sub_category_compulsory === 2 ? 'Compulsory only for Old Students' : +val.store_sub_category_compulsory === 3 ? 'Compulsory for Both' : val.store_sub_category_compulsory }</TableCell>
                      <TableCell>{val.is_store_sub_category_applicable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{<Edit style={{ cursor: 'pointer' }} onClick={() => showActionModalHandler(val.id, val.grade && val.grade.id, val.branch, val.store_sub_category && val.store_sub_category, +val.store_sub_category_compulsory === 1 ? 'Compulsory only for New Students' : +val.store_sub_category_compulsory === 2 ? 'Compulsory only for Old Students' : +val.store_sub_category_compulsory === 3 ? 'Compulsory for Both' : '', val.is_store_sub_category_applicable)} />}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </React.Fragment>
          : [] }
      </div>
    )
    return partialTable
  }
  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs={9} />
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={createBackDateHandler}
          >Create Sub-Category </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs='3'>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Session'
            value={sessionData}
            options={
              session && session.session_year.length
                ? session.session_year.map(session => ({ value: session, label: session })
                ) : []}
            onChange={sessionChangeHandler}
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
        {/* <Grid item xs={3}>
          <label>Section</label>
          <Select
            placeholder='Select Section'
            value={sectionData}
            options={
              sections
                ? sections.filter(ele => ele.section !== null).map(sec => ({
                  value: sec.section && sec.section.id ? sec.section.id : '',
                  label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                }))
                : []
            }
            onChange={sectionHandler}
          />
        </Grid> */}
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={getPartialPaymentHandler}
          >Get</Button>
        </Grid>
      </Grid>
      { showTable ? partialPaymentTable() : []}
      {actionModal}
      { dataLoading ? <CircularProgress open /> : null }
    </div>
    </Layout>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  // sections: state.finance.common.sectionsPerGradeAdmin,
  sections: state.finance.accountantReducer.studentPromotion.sectionsPerGrade,
  dataLoading: state.finance.common.dataLoader,
  subCatList: state.inventory.storeAdmin.schoolStore.storeSubCat,
  subCategory: state.inventory.storeAdmin.subCategoryReducer.subCategory
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchUnitColorSubcat: (alert, user) => dispatch(actionTypes.listUnitColorSubCat({ alert, user })),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGradesPerBranch: (alert, user, session, branch) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch })),
  // fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId }))
  //   fetchAllSection: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId })),
  fetchSubCategory: (session, branch, grade, alert, user) => dispatch(actionTypes.fetchSubCategory({ session, branch, grade, alert, user })),
  createSubCategory: (data, alert, user) => dispatch(actionTypes.createSubCategory({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((SubCategoryAllow))
