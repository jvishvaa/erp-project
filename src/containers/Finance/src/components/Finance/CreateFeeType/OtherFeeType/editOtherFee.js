import React, { Component } from 'react'
import { Grid, Form, Divider } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
// import '../../../css/staff.css'

class EditOtherFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    let currentData = this.props.feeDetails.filter(val => +val.id === +this.props.id)
    currentData.forEach(arr => {
      this.setState((state) => ({
        fee_type_name: arr.fee_type_name ? arr.fee_type_name : '',
        is_multiple_records_allow: arr.is_multiple_records_allow,
        individual_student_wise: arr.individual_student_wise,
        allow_partial_payments: arr.allow_partial_payments,
        can_be_group: arr.can_be_group,
        is_allow_remarks: arr.is_allow_remarks,
        allow_excess_amount: arr.allow_excess_amount,
        is_last_year_due: arr.is_last_year_due,
        status: arr.status
      }))
    })
  }

  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked })
  }

  handlevalue = e => {
    e.preventDefault()
    var data = {
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
    var updatedList = urls.Finance + this.props.match.params.id + '/' + 'editotherfee/'
    axios
      .put(updatedList, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.status)
        if (+res.status === 200) {
          this.props.alert.success('Updated Successfully')
          this.props.giveData('success', res.data)
        }
      })
      .catch((error) => {
        this.props.alert.error('Something went Wrong')
        console.log("Error: Couldn't fetch data from " + urls.OthersFeeType + error)
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
                          Edit Normal Fee Type
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

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('is_multiple_records_allow', e)}
                      checked={this.state.is_multiple_records_allow}
                    /> &nbsp; Multiple Records Allow

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('individual_student_wise', e)}
                      checked={this.state.individual_student_wise}
                    /> &nbsp; Individual Student Wise

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('allow_partial_payments', e)}
                      checked={this.state.allow_partial_payments}
                    /> &nbsp; Allow Partial Payments

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('can_be_group', e)}
                      checked={this.state.can_be_group}
                    /> &nbsp; Can Be Group

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('is_allow_remarks', e)}
                      checked={this.state.is_allow_remarks}
                    /> &nbsp; Allow Remarks

                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('allow_excess_amount', e)}
                      checked={this.state.allow_excess_amount}
                    /> &nbsp; Allow Excess Amount

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('is_last_year_due', e)}
                      checked={this.state.is_last_year_due}
                    /> &nbsp; Last Year Due

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                    className='student-section-inputField'
                  >

                    <input
                      type='checkbox'
                      onChange={(e) => this.changedHandler('status', e)}
                      checked={this.state.status}
                    /> &nbsp; status

                  </Grid.Column>
                </Grid.Row>

                <Grid.Row style={{ padding: '20px' }}>
                  <Grid.Column
                    computer={8}
                    mobile={16}
                    tablet={8}
                    className='student-section-addstaff-button'
                  >
                    <Button type='submit' color='green'>
                            Update
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
  branches: state.branches.items,
  session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(EditOtherFeeType)))
