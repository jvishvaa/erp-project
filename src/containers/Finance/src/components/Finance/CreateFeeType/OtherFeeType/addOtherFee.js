import React, { Component } from 'react'
import { Grid, Form, Divider } from 'semantic-ui-react'
import Select from 'react-select'
import axios from 'axios'
import { Checkbox, FormControlLabel, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
// import '../../../css/staff.css'

class AddOtherFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      is_multiple_records_allow: false,
      individual_student_wise: false,
      allow_partial_payments: false,
      can_be_group: false,
      is_allow_remarks: false,
      allow_excess_amount: false,
      is_last_year_due: false,
      status: false,
      alertMessage: ''
    }
    this.handlevalue = this.handlevalue.bind(this)
    this.handleAcademicyear = this.handleAcademicyear.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
  }

  changedHandler = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleClickBranch = (e) => {
    let branchId = []
    e.forEach((branch) => {
      branchId.push(branch.value)
    })
    this.setState({ branch: branchId, branchData: e })
  }

  handleAcademicyear = (e) => {
    // console.log(e)
    this.setState({ session: e.value, sessionValue: e, branchData: [] })
    axios
      .get(urls.MiscFeeClass + '?session_year=' + e.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (+res.status === 200) {
          // console.log(res.data);
          this.setState({ branchValue: res.data })
        }
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.MiscFeeClass + 'error' + error)
      })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
      academic_year: this.state.session,
      branch: this.state.branch,
      fee_type_name: e.target.fee_type_name.value,
      is_multiple_records_allow: this.state.is_multiple_records_allow,
      individual_student_wise: this.state.individual_student_wise,
      allow_partial_payments: this.state.allow_partial_payments,
      can_be_group: this.state.can_be_group,
      is_allow_remarks: this.state.is_allow_remarks,
      allow_excess_amount: this.state.allow_excess_amount,
      is_last_year_due: this.state.is_last_year_due,
      status: this.state.status
    }
    axios
      .post(urls.createOtherFeeType, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        if (+res.status === 201) {
          this.props.alert.success('Created Successfully')
          this.props.giveData('success', res.data)
          this.setState({
            sessionValue: [],
            branchData: [],
            fee_type_name: '',
            is_multiple_records_allow: false,
            individual_student_wise: false,
            allow_partial_payments: false,
            can_be_group: false,
            is_allow_remarks: false,
            allow_excess_amount: false,
            is_last_year_due: false,
            status: false
          })
        }
      })
      .catch((error) => {
        console.log(error.response)
        if (+error.response.status === 400) {
          // alert(`${Object.keys(error.response.data)[0]} : ${error.response.data[Object.keys(error.response.data)[0]]}`)
          this.props.alert.error('Something Went Wrong')
        }
        console.log("Error: Couldn't fetch data from " + urls.createOtherFeeType)
      })
  }

  render () {
    return (
      <Grid >
        <Grid.Row>
          <Grid.Column computer={16} className='student-addStudent-StudentSection'>
            <Form onSubmit={this.handlevalue}>
              <Grid>
                <Grid.Row>
                  <Grid.Column
                    floated='left'
                    computer={5}
                    mobile={5}
                    tablet={5}
                  >
                    <label className='student-addStudent-segment1-heading'>
                          Create Other Fee Type
                    </label>
                  </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row>
                  <Grid.Column
                    computer={8}
                    mobile={16}
                    tablet={8}
                    className='student-section-inputField'
                  >
                    <label>Academic Year*</label>
                    <Select
                      placeholder='Select Academic Year'
                      value={this.state.sessionValue}
                      options={this.props.session ? this.props.session.session_year.map((session) => ({ value: session, label: session })) : []}
                      onChange={this.handleAcademicyear}
                    />
                  </Grid.Column>
                  <Grid.Column
                    computer={8}
                    mobile={16}
                    tablet={8}
                    className='student-section-inputField'
                  >
                    <label>Branch*</label>
                    <Select
                      placeholder='Select Branch'
                      value={this.state.branchData}
                      isMulti
                      options={
                        this.state.branchValue
                          ? this.state.branchValue.map(branch => ({
                            value: branch.branch.id,
                            label: branch.branch.branch_name
                          }))
                          : []
                      }

                      onChange={this.handleClickBranch}
                    />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={8}
                    mobile={16}
                    tablet={8}
                    className='student-section-inputField'
                  >
                    <label>Fee Type Name</label>
                    <input
                      name='fee_type_name'
                      type='text'
                      className='form-control'
                      onChange={e =>
                        this.setState({ fee_type_name: e.target.value })
                      }
                      placeholder='Fee Type Name'
                      value={this.state.fee_type_name}
                    />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.is_multiple_records_allow}
                          onChange={this.changedHandler('is_multiple_records_allow')}
                          color='primary'
                        />
                      }
                      label='is_multiple_records_allow'
                    />

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.individual_student_wise}
                          onChange={this.changedHandler('individual_student_wise')}
                          color='primary'
                        />
                      }
                      label='individual_student_wise'
                    />

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.allow_partial_payments}
                          onChange={this.changedHandler('allow_partial_payments')}
                          color='primary'
                        />
                      }
                      label='allow_partial_payments'
                    />

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.can_be_group}
                          onChange={this.changedHandler('can_be_group')}
                          color='primary'
                        />
                      }
                      label='can_be_group'
                    />

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.is_allow_remarks}
                          onChange={this.changedHandler('is_allow_remarks')}
                          color='primary'
                        />
                      }
                      label='is_allow_remarks'
                    />

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.allow_excess_amount}
                          onChange={this.changedHandler('allow_excess_amount')}
                          color='primary'
                        />
                      }
                      label='allow_excess_amount'
                    />

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.is_last_year_due}
                          onChange={this.changedHandler('is_last_year_due')}
                          color='primary'
                        />
                      }
                      label='is_last_year_due'
                    />

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.status}
                          onChange={this.changedHandler('status')}
                          color='primary'
                        />
                      }
                      label='status'
                    />

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row style={{ padding: '20px' }}>
                  <Grid.Column
                    computer={4}
                    mobile={16}
                    tablet={15}
                    className='student-section-addstaff-button'
                  >
                    <Button type='submit' color='green'
                      disabled={
                        !this.state.session || !this.state.branch || !this.state.fee_type_name
                      }
                    >
                          Create
                    </Button>
                    <Button primary onClick={this.props.close} type='button'>Return</Button>
                  </Grid.Column>
                </Grid.Row>

              </Grid>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(AddOtherFeeType)))
