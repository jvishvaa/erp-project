import React, { useState } from 'react'
import {
  Grid,
  Button,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
CircularProgress,
TablePagination
} from '@material-ui/core'
import Select from 'react-select'
// import ReactTable from 'react-table'
// import 'react-table/react-table.css'
import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import Layout from '../../../../../Layout'

const GenerateSubsequentPayment = ({ user, alert, getGenerateSubsequent, generateSubsequentPayment, getGenerateSubsequents, session }) => {
  const [sessionData, setSessionData] = useState({
    value: '2020-21',
    label: '2020-21'
  })
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showTable, setShowTable] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setShowTable(false)
  }

  const getDetailsHandler = () => {
    if (sessionData) {
      getGenerateSubsequents(sessionData && sessionData.value, user, alert)
      setShowTable(true)
    } else {
      alert.warning('Select Year!')
    }
  }

  const subsequentPaymentHandle = (id) => {
    console.log(id)
    const data = {
      branch: id
    }
    generateSubsequentPayment(data, user, alert)
  }

  const renderStudentErpTable = () => {
    let dataToShow = []
    dataToShow = getGenerateSubsequent && getGenerateSubsequent.map((val, i) => {
      return {
        domain: val.branch && val.branch.branch_name ? val.branch.branch_name : '',
        name: val.name && val.name ? val.name : '',
        email: val.email && val.email ? val.email : '',
        contact: val.contact && val.contact ? val.contact : '',
        customerId: val.customer_id && val.customer_id ? val.customer_id : '',
        Payment: <Button variant='contained' color='primary' style={{ marginTop: '-5px' }} onClick={() => subsequentPaymentHandle(val.branch && val.branch.id)}> Payment </Button>
      }
    })
    return dataToShow
  }

  // let studentErpTable = null
  // studentErpTable = <ReactTable
  //   style={{ marginTop: 60, textAlign: 'center' }}
  //   data={renderStudentErpTable()}
  //   // manual
  //   columns={[
  //     {
  //       Header: 'Branch Name',
  //       accessor: 'domain',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Customer Name',
  //       accessor: 'name',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Customer Email',
  //       accessor: 'email',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Contact',
  //       accessor: 'contact',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Customer Id',
  //       accessor: 'customerId',
  //       filterable: false,
  //       sortable: true
  //     },
  //     {
  //       Header: 'Make Payment',
  //       accessor: 'Payment',
  //       filterable: false,
  //       sortable: true
  //     }
  //   ]}
  //   filterable
  //   sortable
  //   defaultPageSize={10}
  //   showPageSizeOptions={false}
  //   className='-striped -highlight'
  // />

  return (
    <Layout>
    <div>
      <Grid container spacing={1} style={{ padding: 10 }} >
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
        <Grid item xm={6} md={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: 18 }}
            onClick={getDetailsHandler}
          >GET</Button>
        </Grid>
      </Grid>
      {/* {showTable ? studentErpTable : []} */}
      <React.Fragment>
               <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch Name</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell> Customer Email</TableCell>
                      <TableCell> Contact</TableCell>
                      <TableCell> Customer Id</TableCell>
                      <TableCell>Make Payment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {getGenerateSubsequent && getGenerateSubsequent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, i) => { 
                    return (
                  <TableRow>
                     <TableCell> {  val.branch && val.branch.branch_name ? val.branch.branch_name : ''}</TableCell>
                      {/* <TableCell>{ val.id} </TableCell> */}
                      <TableCell>{val.name && val.name ? val.name : ''}</TableCell>
                      <TableCell>{val.email && val.email ? val.email : ''} </TableCell>
                      <TableCell>{ val.contact && val.contact ? val.contact : ''} </TableCell>
                      <TableCell> {val.customer_id && val.customer_id ? val.customer_id : ''} </TableCell>
                      <TableCell><Button variant='contained' color='primary' style={{ marginTop: '-5px' }} onClick={() => subsequentPaymentHandle(val.branch && val.branch.id)}> Payment </Button></TableCell>
                  </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={getGenerateSubsequent && getGenerateSubsequent.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
        </React.Fragment>
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  getGenerateSubsequent: state.finance.eMandateReducer.getSubsequentPayment
})

const mapDispatchToProps = (dispatch) => ({
  generateSubsequentPayment: (data, user, alert) => dispatch(actionTypes.generateSubsequentPayment({ data, user, alert })),
  getGenerateSubsequents: (session, user, alert) => dispatch(actionTypes.getGenerateSubsequents({ session, user, alert })),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((GenerateSubsequentPayment))
