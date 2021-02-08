import React, { Component } from 'react'
import { Form, Divider } from 'semantic-ui-react'
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Fab,
  Grid
} from '@material-ui/core/'
import {
  Delete as DeleteIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
import '../../css/staff.css'
import * as actionTypes from '../store/actions'
import Modal from '../../../ui/Modal/modal'
import classess from './deleteModal.module.css'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    margin: '0 auto',
    width: '80%'
  }
})

class AddFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      feeTypeId: null,
      concessionFeeTypes: [],
      concessionFeeTypeId: null,
      showDeleteModal: false,
      deleteId: null
    }
  }

  componentDidMount () {
    console.log(this.props.concessionId)
    console.log(this.props.concessionName)
    if (this.props.concessionTypeId) {
      this.props.fetchConcessionFeeTypes(this.props.concessionTypeId, this.props.alert, this.props.user)
    } else {
      this.props.alert.warning('Something Went Wrong')
    }
  }

  deleteModalShowHandler = (id) => {
    this.setState({
      showDeleteModal: true,
      deleteId: id
    })
  }

  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  deleteHandler = () => {
    // this.props.deleteConcessionFeeType(this.state.deleteId, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  feeTypeHandler = (e) => {
    this.setState({ feeTypeId: e.value })
    this.props.concessionFeeType(e.value, this.props.alert, this.props.user)
  }

  concessionFeeTypeHandler = (e) => {
    this.setState({ concessionFeeTypeId: e.value })
  }

  addFeeTypeHandler = () => {
    if (!this.state.feeTypeId || !this.state.concessionFeeTypeId) {
      this.props.alert.warning('Select All Fields')
      return
    }
    const data = {
      concession_type: this.props.concessionTypeId,
      fee_type: [this.state.concessionFeeTypeId]
    }
    this.props.addConcessionFeeType(data, this.props.alert, this.props.user)
  }

  listFeeSelectHandler = () => {
    const excFeeId = this.props.concessionFeeTypeList[0].fee_type.map(fee => fee.id)
    const feeList = this.props.listFeeTypes
      .filter(ele => !excFeeId.includes(ele.id))
      .map(ele => ({
        value: ele.id,
        label: ele.fee_type_name
      }))
    return feeList
  }

  render () {
    let { classes } = this.props
    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <Modal
          style={{ zIndex: '1400', width: '60%', minHeight: '250px' }}
          open={this.state.showDeleteModal}
          click={this.deleteModalCloseHandler}
          small
        >
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button
              color='secondary'
              variant='contained'
              onClick={this.deleteHandler}
            >
              Delete
            </Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.deleteModalCloseHandler}
            >
              Go Back
            </Button>
          </div>
        </Modal>
      )
    }
    return (
      <React.Fragment>
        <Form>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label className='student-addStudent-segment1-heading'>
                      Assigned Fee Types
              </label>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='10'>
              <label>Concession Type : </label> &nbsp;{this.props.concessionName}
            </Grid>
            <React.Fragment>
              <div className={classes.tableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fee Type</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.concessionFeeTypeList.length ? this.props.concessionFeeTypeList.map((row, i) => {
                      return (
                        <React.Fragment>
                          {row.fee_type.length ? row.fee_type.map((val) => {
                            return (
                              <TableRow hover >
                                <TableCell>{val.fee_type_name ? val.fee_type_name : ''}</TableCell>
                                <TableCell>
                                  <Fab
                                    color='primary'
                                    size='small'
                                    onClick={() => this.deleteModalShowHandler(val.id)}
                                  >
                                    <DeleteIcon />
                                  </Fab>
                                </TableCell>
                              </TableRow>
                            )
                          }) : ''}
                        </React.Fragment>
                      )
                    }) : 'no data'}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment> <br />

            <Grid item xs='6'>
              <label>Type Of Fee</label>
              <Select
                placeholder='Select ..'
                options={
                  [
                    {
                      value: '1',
                      label: 'Normal Fee Type'
                    },
                    {
                      value: '2',
                      label: 'Misc Fee Type'
                    }
                  ]
                }
                onChange={(e) => this.feeTypeHandler(e)}
              />
            </Grid>
            <Grid item xs='6'>
              <label>Fee Types</label>
              <Select
                placeholder='Select ..'
                options={this.props.listFeeTypes.length > 0
                  ? this.listFeeSelectHandler()
                  : []
                }
                onChange={(e) => this.concessionFeeTypeHandler(e)}
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                color='primary'
                variant='contained'
                onClick={this.addFeeTypeHandler}
              >
                      Add
              </Button>
            </Grid>
          </Grid>
        </Form>
        {deleteModal}
        {this.props.dataLoadings ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  concessionFeeTypeList: state.finance.concessionSettings.listFeeType,
  listFeeTypes: state.finance.concessionSettings.concessionFeeType
})

const mapDispatchToProps = dispatch => ({
  fetchConcessionFeeTypes: (concessionId, alert, user) => dispatch(actionTypes.fetchListFeeType({ concessionId, alert, user })),
  addConcessionFeeType: (data, alert, user) => dispatch(actionTypes.addListFeeType({ data, alert, user })),
  concessionFeeType: (feeTypeId, alert, user) => dispatch(actionTypes.fetchConcessionFeeType({ feeTypeId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AddFeeType)))
