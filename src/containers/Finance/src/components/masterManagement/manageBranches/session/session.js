import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import axios from 'axios'
import Button from '@material-ui/core/Button'
// import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import moment from 'moment'
import '../../../css/staff.css'
import { OmsSelect, RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../../ui'
import { urls } from '../../../../urls'
import { apiActions } from '../../../../_actions'

const addSession = {
  label: 'Add Session Mapping',
  color: 'blue',
  href: 'sessionMapping/add',
  disabled: false
}

const filterTableData = {
  namespace: 'Grade Category'
}

class Session extends Component {
  constructor () {
    super()
    this.state = {
      acadSessionField: [],
      open: false,
      currentlySelected: {}
    }
    this.deleteHandler = this.deleteHandler.bind()
    this.handleClick = this.handleClick.bind(this)
    this.getUpdatedDate = this.getUpdatedDate.bind(this)
  }

  deleteHandler = (id) => {
    console.log(id)
    var updatedList = urls.ACADEMICSESSION + id + '/'

    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        console.log(res)
        // alert("Deleted Successfully");
        this.setState({
          alertMessage: {
            messageText: 'Deleted Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE)
        console.log(error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  }

  getUpdatedDate () {
    // var that = this

    let { currentlySelected } = this.state
    console.log(this.state, 'this.styate')
    if (moment(currentlySelected.end_date).diff(currentlySelected.start_date) < 0) {
      this.props.alert.error('Start date Should be Less than End Date')
      return
    }
    let obj = {
      session_year: currentlySelected.session_year,
      branch: currentlySelected.branch.id,
      start_date: currentlySelected.start_date,
      end_date: currentlySelected.end_date
    }

    axios
      .patch(urls.session, JSON.stringify(obj), {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.props.alert.success('Successfully Updated to Acadsession')
          this.setState((prevState) => {
            let newState = prevState
            let acadSessionData = prevState.acadSessionData
            acadSessionData[prevState.currentlySelectedIndex] = {
              ...acadSessionData[prevState.currentlySelectedIndex],
              start_date: currentlySelected.start_date,
              end_date: currentlySelected.end_date
            }
            newState.acadSessionData = acadSessionData
            return newState
          })
        } else if (res.status === 400) {
          this.props.alert.error('Error occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  handleClick = (e) => {
    var sessionData = []
    var sessionField = []
    axios
      .get(urls.UTILACADEMICSESSION + '?session_year=' + e.label, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        console.log('api result', res)
        var acadSession = res['data']
        var that = this
        console.log(acadSession)
        acadSession.forEach((data) => {
          sessionData.push({
            branch_name: data.branch.branch_name,
            start_date: data.start_date ? data.start_date : '',
            end_date: data.end_date ? data.end_date : '',

            CreatedDate: moment(data.branch.createdAt).format('DD/MM/YYYY HH:MM:SS'),
            // Edit: (<RouterButton icon='edit' value={{}} />),
            Edit: (<Button variant='outlined' color='primary' onClick={() => this.handleClickOpen(data.id)}>
            Edit
            </Button>),

            Delete: <IconButton area-label='delete' onClick={() => { that.deleteHandler(data.id) }} >
              <DeleteIcon fontSize='small' />
            </IconButton>

          })
        })
        sessionField.push(

          {
            name: 'branch_name',
            displayName: 'Branch Name',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },

          {
            name: 'start_date',
            displayName: 'Start Date',
            type: 'date',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            name: 'end_date',
            displayName: 'End Date',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            name: 'CreatedDate',
            displayName: 'Created Date',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            name: 'Edit',
            displayName: 'Edit',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            name: 'Delete',
            displayName: 'Delete',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          }

        )
        console.log('sessiondata', sessionData)
        this.setState({ acadSessionField: sessionField,
          acadSessionData: sessionData,
          selectedYear: e.label,
          acadSession })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.SectionMapping, error)
      })
  }

  componentWillReceiveProps (props) {
    console.log('will receive', props)
  }
  handleClickOpen = (id) => {
    let currentlySelectedIndex
    let currentlySelected = this.state.acadSession.filter((session, index) => {
      if (session.id === id) {
        currentlySelectedIndex = index
        return true
      } else {
        return false
      }
    })[0]
    this.setState({ open: true, currentlySelected: currentlySelected, currentlySelectedIndex })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  render () {
    console.log(this.acadSessionField)
    // var acadSession = res['data']
    return (
      <React.Fragment>
        <div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle id='form-dialog-title'>Start Date</DialogTitle>
            <DialogContent>
              <input
                label='Start Date'
                onChange={(e) => {
                  console.log(e.target.value)
                  this.setState({ currentlySelected: { ...this.state.currentlySelected, start_date: e.target.value } })
                }}
                type='date'
                value={this.state.currentlySelected.start_date}
              />
            </DialogContent>
            <DialogTitle id='form-dialog-title'>End Date</DialogTitle>
            <DialogContent>
              <input
                onChange={(e) => {
                  console.log(e)
                  this.setState({ currentlySelected: { ...this.state.currentlySelected, end_date: e.target.value } })
                }}
                type='date'
                value={this.state.currentlySelected.end_date}
                // onClick={this.handleEndDate}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color='primary'>
              Cancel
              </Button>
              <Button onClick={this.getUpdatedDate} color='primary'>
              Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Toolbar
          floatRight={
            <React.Fragment>
              <RouterButton value={addSession} />
            </React.Fragment>
          } >
          <AlertMessage alertMessage={this.state.alertMessage} />

          <OmsSelect
            label={'Academic Year*'}
            options={this.props.session ? this.props.session.session_year.map((session) => ({ value: session, label: session })) : null}
            change={this.handleClick} />

        </Toolbar>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={15} mobile={13} tablet={15} className='staff-table1'>
              <OmsFilterTable
                filterTableData={filterTableData}
                tableData={this.state.acadSessionData}
                tableFields={this.state.acadSessionField}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)(Session)
