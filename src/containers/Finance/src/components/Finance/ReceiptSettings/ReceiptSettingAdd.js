import React, { Component } from 'react'
import { Divider, Form } from 'semantic-ui-react'
import { Button, Grid } from '@material-ui/core/'

import { connect } from 'react-redux'
import * as actionTypes from '../store/actions'

import CircularProgress from '../../../ui/CircularProgress/circularProgress'

class ReceiptSettingAdd extends Component {
  state = {
    isActive: false
  }

  checkChangeHandler = e => {
    this.setState({
      isActive: e.target.checked
    })
  }
  createClickHandler = e => {
    const data = {
      academic_year: this.props.acadId,
      branch: this.props.branchId,
      prefix: this.props.prefix,
      receipt_sub_header: this.props.subHeader,
      payslip_header: this.props.header,
      receipt_footer: this.props.footer,
      receipt_sub_footer: this.props.subFooter,
      is_active: this.state.isActive
    }
    this.props.AddReceiptSetting(data, this.props.alert, this.props.user)
    this.props.close()
    this.props.clearProps()
  }
  render () {
    return (
      <React.Fragment>
        {this.props.dataLoading ? <CircularProgress open /> : <Form>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
              <label className='student-addStudent-segment1-heading'>
                    Add Receipt Settings
              </label>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='5'>
              <label>Prefix</label>
              <input
                name='prefix'
                type='text'
                className='form-control'
                placeholder='prefix'
                onChange={this.props.changeHandler}
                value={this.props.prefix}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Payslip Header</label>
              <input
                name='header'
                type='text'
                className='form-control'
                placeholder='Payslip Header'
                onChange={this.props.changeHandler}
                value={this.props.header}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Receipt Sub Header</label>
              <input
                name='subHeader'
                type='text'
                className='form-control'
                placeholder='Receipt Sub Header'
                onChange={this.props.changeHandler}
                value={this.props.subHeader}
              />

            </Grid>
            <Grid item xs='5'>
              <label>Footer</label>
              <input
                name='footer'
                type='text'
                className='form-control'
                placeholder='Footer'
                onChange={this.props.changeHandler}
                value={this.props.footer}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Receipt Sub Footer </label>
              <input
                name='subFooter'
                type='text'
                className='form-control'
                placeholder='Sub Footer'
                onChange={this.props.changeHandler}
                value={this.props.subFooter}
              />
            </Grid>
            <Grid item xs='5'>
              <label>Is Active</label>
              <input name='is Active'
                type='checkbox'
                onChange={this.checkChangeHandler}
                value={this.state.isActive}
              />
            </Grid>
            <div
              style={{ display: 'flex', margin: 'auto' }}
            >
              <Button
                type='submit'
                color='primary'
                variant='contained'
                onClick={this.createClickHandler}
                style={{ marginRight: '10px' }}
                disabled={!this.props.prefix || !this.props.footer || !this.props.subFooter || !this.props.subHeader || !this.props.header}
              >
                  Create
              </Button>
              <Button
                color='primary'
                variant='contained'
                type='button'
                onClick={this.props.close}
              >
                      Return
              </Button>
            </div>
          </Grid>
        </Form>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  dataLoading: state.finance.common.dataLoader,
  receiptSettingsList: state.finance.receiptSettings.receiptSettingsList,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  AddReceiptSetting: (data, alert, user) => dispatch(actionTypes.AddReceiptSetting({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptSettingAdd)
