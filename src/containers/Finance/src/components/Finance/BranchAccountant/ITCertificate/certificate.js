import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid } from '@material-ui/core/'

// import { withStyles } from '@material-ui/core/'
import Select from 'react-select'
import axios from 'axios'

// import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
// import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import Student from '../../Profiles/studentProfile'
import generateCertificate from '../../Receipts/itCertificate'

const PARENT = [
  { id: 1, value: 'Father' },
  { id: 2, value: 'Mother' }
]

class Certificate extends Component {
  state= {
    currentSession: null,
    erpNo: null,
    selectedParent: null
  }

  componentDidMount () {
    // console.log('NUmber------------', Number.toNumericString(12000, 'only'))
    const d = new Date()
    // console.log('///////////DATE', d && d.withMonthName())
  }

  // sessionChangeHandler = (e) => {
  //   this.setState({
  //     currentSession: e.value
  //   })
  // }

  // erpChangeHander = (e) => {
  //   this.setState({
  //     erpNo: e.target.value
  //   })
  // }

  parentChangeHandler = (e) => {
    this.setState({
      selectedParent: {
        id: e.value,
        value: e.label
      }
    })
  }

  getPdfData = (session, erp, parent) => {
    return (axios.get(`${urls.GenerateITC}?erp_code=${erp}&academic_year=${session}&name=${parent}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }))
  }

  generatePdf = async () => {
    const {
      selectedParent
    } = this.state
    const {
      session,
      erp
    } = this.props
    try {
      const response = await this.getPdfData(session, erp, selectedParent.id)
      console.log('-====Response====', response)
      if (typeof response.data === 'string') {
        this.props.alert.warning(response.data)
        return
      }
      const date = new Date()
      const data = {
        studentName: response.data[0].student_name,
        amount: response.data[0].fee_amount,
        amountString: Number.toNumericString(+response.data[0].fee_amount, 'only'),
        date: date.withMonthName(),
        grade: response.data[0].grade,
        session: session,
        parentName: response.data[0].father_name || response.data[0].mother_name || '',
        location: response.data[0] && response.data[0].location,
        institute: response.data[0] && response.data[0].institute_name
      }
      console.log('DATA+++++++++++', data)
      generateCertificate(data)
    } catch (error) {
      console.log(error)
      this.props.alert.warning('Something Went Wrong')
    }
  }

  render () {
    // const style = {
    //   boxAlign: 'center',
    //   alignItems: 'center',
    //   backgroundColor: 'hsl(0,0%,100%)',
    //   borderColor: 'hsl(0,0%,80%)',
    //   borderRadius: '4px',
    //   borderStyle: 'solid',
    //   borderWidth: '1px',
    //   cursor: 'default',
    //   height: '38px',
    //   width: '100%',
    //   paddingLeft: '15px'
    // }

    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          {/* <Grid.Column
              computer={4}
              mobile={16}
              tablet={4}
              className='student-section-inputField'
            >
              <label>Academic Year*</label>
              <Select
                placeholder='Select Session'
                value={this.state.currentSession ? ({
                  value: this.state.currentSession,
                  label: this.state.currentSession
                }) : null}
                options={
                  this.props.session && this.props.session.session_year.length
                    ? this.props.session.session_year.map(session => ({ value: session, label: session })
                    ) : []}
                onChange={this.sessionChangeHandler}
              />
            </Grid.Column>
            <Grid.Column
              computer={4}
              mobile={16}
              tablet={4}
            >
              <label>ERP Code*</label>
              <input type='number' placeholder='ERP Code'
                style={style}
                value={this.state.erpNo ? this.state.erpNo : ''}
                onChange={this.erpChangeHander} />
            </Grid.Column> */}
          <Grid item xs='3'>
            <label>Parent*</label>
            <Select
              placeholder='Select Parent'
              value={this.state.selectedParent ? ({
                value: this.state.selectedParent.id,
                label: this.state.selectedParent.value
              }) : null}
              options={
                PARENT.map(parent => ({ value: parent.id, label: parent.value })
                )}
              onChange={this.parentChangeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              color='primary'
              variant='contained'
              style={{ marginTop: 20 }}
              onClick={this.generatePdf}
            >Generate</Button>
          </Grid>
        </Grid>
        {/* <Student erp={this.state.erpNo} user={this.props.user} /> */}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user
  // session: state.academicSession.items
})

const mapDispatchToProps = (dispatch) => ({
  // loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Certificate)
