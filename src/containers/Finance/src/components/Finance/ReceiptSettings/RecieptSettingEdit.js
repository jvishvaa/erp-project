import React, { Component } from 'react'
import { Divider, Form } from 'semantic-ui-react'
import { Button, Grid } from '@material-ui/core/'

import { connect } from 'react-redux'

import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

class ReceiptSettingEdit extends Component {
  // state= {
  //   prefix: '',
  //   subHeader: '',
  //   header: '',
  //   footer: ''
  // }

  componentDidMount () {
    // let currentdata = this.props.receiptlists.filter(row => row.id === this.props.id)
  }

  // SrHandler = e => {
  //   this.setState({ Sr: e.target.value })
  // }

  // prefixHandler = e => {
  //   this.setState({ prefix: e.target.value })
  // }

  // subHeaderHandler = e => {
  //   this.setState({ subHeader: e.target.value })
  // }

  // headerHandler = e => {
  //   this.setState({ header: e.target.value })
  // }

  // FooterHandler = e => {
  //   this.setState({ Footer: e.target.value })
  // }
  // state = {
  //   isActive: false
  // }

  // checkChangeHandler = e => {
  //   this.setState({
  //     isActive: e.target.checked
  //   })
  // }
  clickEditReceiptHandler = e => {
    const data = {
      id: this.props.id,
      academic_year: this.props.acadId,
      branch: this.props.branchId,
      prefix: this.props.prefix,
      receipt_sub_header: this.props.subHeader,
      payslip_header: this.props.header,
      receipt_footer: this.props.footer,
      receipt_sub_footer: this.props.subFooter,
      is_active: this.props.isActive
    }
    this.props.updateReceipt(data, this.props.alert, this.props.user)
    this.props.close()
  }
  // saveEditHandler = () => {
  //   let data = {
  //     receipt_sub: this.state.subHeader,
  //     prefix: this.state.prefix,
  //     pay_slip_header: this.state.header
  //   }
  //   this.props.saveEdit(data, this.props.user, this.props.alert)
  // }

  render () {
    return (
      <React.Fragment>
        {this.props.dataLoading ? <CircularProgress open /> : null}
        <Form>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='12'>
              <label className='student-addStudent-segment1-heading'>
                      Edit Receipt Settings
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
              <label>Receipt Sub Footer</label>
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
              <input
                type='checkbox'
                onChange={this.props.checkHandler}
                checked={this.props.isActive}
              />
            </Grid>
            <div
              style={{ display: 'flex', margin: 'auto' }}
            >
              <Button
                type='submit'
                disabled={!this.props.prefix || !this.props.footer || !this.props.subFooter || !this.props.subHeader || !this.props.header}
                color='primary'
                variant='contained'
                style={{ marginRight: '10px' }}
                onClick={this.clickEditReceiptHandler}
              >
                    Update
              </Button>
              <Button
                color='primary'
                variant='outlined'
                type='button'
                onClick={this.props.returnHandler}
              >
                    Return
              </Button>
            </div>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  dataLoading: state.finance.common.dataLoader,
  receiptlists: state.finance.receiptSettings.receiptSettingsList
})

const mapDispatchToProps = dispatch => ({
  updateReceipt: (data, alert, user) => dispatch(actionTypes.editReceiptSettings({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptSettingEdit)
