import React, {
  useEffect,
  useState
  // useMemo
} from 'react'
import {
  withStyles, Paper, Button, Grid,
  // TableFooter, TablePagination,
  Table, TableBody, TableCell, TableRow, TableHead, TableFooter, TablePagination, IconButton,
  Tab,
  Tabs,
  AppBar,
  Typography
  // IconButton
  // TableHead, Grid, Button, TextField
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { ArrowBack } from '@material-ui/icons/'
import axios from 'axios'
import LastPageIcon from '@material-ui/icons/LastPage'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import appRegReceiptsPdf from '../../Receipts/appRegReceipts'
// import PropTypes from 'prop-types'
// import Select from 'react-select'
import EditMode from './editMode'
import EditInfo from './editInfo'
// import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
// import classes from './feeStructure.module.css'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import accessList from './accessList'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  modal__remainbutton: {
    bottom: '5px',
    left: '10px',
    display: 'inline-block',
    position: 'absolute'
  },
  modal__deletebutton: {
    bottom: '5px',
    right: '10px',
    display: 'inline-block',
    position: 'absolute'
  }
})

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

const RegFormList = ({ session,
  history,
  classes,
  dataLoading,
  fetchAllAppFormList,
  formList,
  alert,
  user,
  updateForm,
  deleteForms,
  downloadReports }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [modal, setModal] = useState(false)
  const [value, setValue] = useState('one')
  const [editData, setEditData] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteForm, setDeleteForm] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(null)

  useEffect(() => {
    console.log('Mounted All Form List', history.location.state)
    const { session, fromDate, toDate, branch, isAdmin, selectedDates, selectedReport } = history.location.state
    setIsAdmin(isAdmin)
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const userId = userProfile.personal_info.user_id
    const userIndex = accessList.indexOf(+userId)
    if (userIndex !== -1) {
      setShowDelete(true)
    }
    fetchAllAppFormList(session, branch, fromDate, toDate, selectedDates, selectedReport, rowsPerPage || 10, page + 1, 'registration', alert, user)
  }, [history, fetchAllAppFormList, rowsPerPage, page, alert, user])

  // Generation of PDF Start
  const getPdfData = (transactionId) => {
    return (axios.get(`${urls.AppRegPdf}?transaction_id=${transactionId}&academic_year=${history.location.state.session}`, {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }))
  }

  const generatePdf = async (transid) => {
    try {
      const response = await getPdfData(transid)
      console.log('App reg Response: ', response)
      appRegReceiptsPdf(response.data)
    } catch (e) {
      console.log(e)
      alert.warning('Unable to generate PDF!')
    }
  }

  const downloadTotalExcel = () => {
    // download the excel
    const { branch } = history.location.state
    let regFormListUrl = null
    const { session, fromDate, toDate, selectedDates, selectedReport } = history.location.state
    regFormListUrl = `${urls.ListAllFormReport}?academic_year=${session}&from_date=${fromDate}&to_date=${toDate}&select_date=${selectedDates}&select_report=${selectedReport}&branch=${branch}&type=registration`
    downloadReports('registration_form_report.xlsx', regFormListUrl, alert, user)
  }

  const closeModal = () => {
    setModal(false)
  }

  const openModal = (data) => {
    setEditData(data)
    setModal(true)
  }

  const handleChange = (event, value) => {
    setValue(value)
  }

  const getModal = () => {
    const { session: selectedSession, branch } = history.location.state
    const info = {
      type: 'Registration',
      selectedSession,
      branch,
      typeNumber: editData.registration_number,
      date: editData.registration_date,
      amount: editData.payment && editData.payment.registration_amount,
      optingClass: editData.student && editData.student.opting_class,
      studentName: editData.student && editData.student.student_name,
      fatherName: editData.student && editData.student.parent && editData.student.parent.father_name
    }
    const mode = {
      type: 'Registration',
      typeNumber: editData.registration_number,
      branch,
      session: selectedSession,
      transactionId: editData.payment && editData.payment.registration_transaction_id
    }
    return (
      <Modal open={modal} click={closeModal}>
        <Typography variant='h3' style={{ textAlign: 'center', fontWeight: 'lighter' }}>Edit Transaction</Typography>
        <hr />
        <AppBar position='static'>
          <Tabs value={value} onChange={handleChange}>
            <Tab value='one' label='Edit' />
            <Tab value='two' label='Edit Mode' />
          </Tabs>
        </AppBar>
        {value === 'one' && <TabContainer>
          <EditInfo
            {...info}
            user={user}
            alert={alert}
            editHandler={updateForm}
            close={closeModal}
          />
        </TabContainer>}
        {value === 'two' && <TabContainer>
          <EditMode
            {...mode}
            user={user}
            alert={alert}
            close={closeModal}
          />
        </TabContainer>}
      </Modal>
    )
  }

  const openDeleteModal = (num) => {
    setDeleteModal(true)
    setDeleteForm(num)
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  const removeForm = () => {
    // delete the form here deleteNum
    console.log('Delete Form +++++++++++', deleteForm)
    const data = {
      type: 'registration',
      num: deleteForm
    }
    deleteForms(data, alert, user)
    setDeleteModal(false)
  }

  const getDeleteModal = () => {
    return (
      <Modal open={deleteModal} click={closeDeleteModal} small>
        <Typography variant='h3' style={{ textAlign: 'center', fontWeight: 'lighter' }}>Are you sure?</Typography>
        <hr />
        <div className={classes.modal__deletebutton}>
          <Button color='negative' onClick={removeForm}>Delete</Button>
        </div>
        <div className={classes.modal__remainbutton}>
          <Button color='primary' onClick={closeDeleteModal}>Go Back</Button>
        </div>
      </Modal>
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value)
    setPage(0)
  }

  const firstPageChange = () => {
    setPage(0)
  }

  const lastPageChange = (lastPage) => {
    setPage(lastPage)
  }

  const formListTableHandler = () => {
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Registration Number</TableCell>
              <TableCell align='center'>Registration Date</TableCell>
              <TableCell align='center'>Student Name</TableCell>
              <TableCell align='center'>Father Name</TableCell>
              <TableCell align='center'>Opting Class</TableCell>
              <TableCell align='center'>Registration Amount</TableCell>
              <TableCell align='center'>Print Receipt</TableCell>
              {isAdmin ? <TableCell align='center'>Edit</TableCell> : null}
              {isAdmin && showDelete ? <TableCell align='center'>Delete</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {formList && formList.results.length && formList.results.map((row, index) => {
              return (
                <TableRow key={row.registration_number}>
                  <TableCell align='center'>{row.registration_number}</TableCell>
                  <TableCell align='center'>{row.registration_date}</TableCell>
                  <TableCell align='center'>{row.student && row.student.student_name ? row.student.student_name : 'N/A'}</TableCell>
                  <TableCell align='center'>{row.student && row.student.parent && row.student.parent.father_name ? row.student.parent.father_name : 'N/A'}</TableCell>
                  <TableCell align='center'>{row.student && row.student.opting_class && row.student.opting_class.grade ? row.student.opting_class.grade : 'N/A'}</TableCell>
                  <TableCell align='center'>{row.payment && row.payment.registration_amount ? row.payment.registration_amount : 'N/A'}</TableCell>
                  <TableCell align='center'>
                    <Button variant='contained' disabled={row.payment && !row.payment.registration_transaction_id} onClick={() => { generatePdf(row.payment && row.payment.registration_transaction_id ? row.payment.registration_transaction_id : null) }}>Download Receipt</Button>
                  </TableCell>
                  {isAdmin ? (<TableCell align='center'>
                    <Button variant='contained' color='primary' onClick={() => openModal(row)}>Edit</Button>
                  </TableCell>) : null}
                  {isAdmin && showDelete ? (<TableCell align='center'>
                    <Button variant='contained' color='primary' onClick={() => openDeleteModal(row.registration_number)}>Delete</Button>
                  </TableCell>) : null}
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={6}
                labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+formList.count / (+rowsPerPage || 10))}`}
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                // count={+applicantsList.count}
                rowsPerPage={rowsPerPage || 10}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'Rows per page' }
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
              <TableCell style={{ marginTop: '13px' }}>
                <IconButton
                  onClick={firstPageChange}
                  disabled={page === 0 || page === 1}
                >
                  <FirstPageIcon />
                </IconButton>
                <IconButton
                  onClick={() => lastPageChange(Math.ceil(formList.count / (rowsPerPage || 10)) - 1)}
                  disabled={page === (Math.ceil(formList.count / (rowsPerPage || 10)) - 1)}
                >
                  <LastPageIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }

  return (
    <React.Fragment>
      <Button style={{ width: '40px' }} color='primary' className={classes.btn} onClick={history.goBack}>
        <ArrowBack /> Back
      </Button>
      <Grid container direction='row' justify='flex-end' spacing={8}>
        <Grid item style={{ marginTop: 10 }} xs={3}>
          <Button variant='contained' onClick={() => { downloadTotalExcel() }} className={classes.btn}>Download Registration Excel</Button>
        </Grid>
      </Grid>
      {formList && formList.results && formList.results.length ? formListTableHandler() : ''}
      {dataLoading ? <CircularProgress open /> : null}
      {modal ? getModal() : null}
      {deleteModal ? getDeleteModal() : null}
    </React.Fragment>
  )
}

RegFormList.propTypes = {
  // classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  formList: state.finance.accountantReducer.totalFormCount.formList
})

const mapDispatchToProps = dispatch => ({
  fetchAllAppFormList: (session, branch, fromDate, toDate, selectedDates, selectedReport, pageSize, page, formType, alert, user) => dispatch(actionTypes.fetchAllAppFormList({ session, branch, fromDate, toDate, selectedDates, selectedReport, pageSize, page, formType, alert, user })),
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user })),
  deleteForms: (body, alert, user) => dispatch(actionTypes.deleteForms({ body, user, alert })),
  updateForm: (body, user, alert) => dispatch(actionTypes.updateTotalFormDetails({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(RegFormList)))
