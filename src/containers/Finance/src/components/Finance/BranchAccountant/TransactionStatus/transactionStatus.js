import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { withStyles, Typography, Button } from '@material-ui/core/'
import Select from 'react-select'

import { apiActions } from '../../../../_actions'
import Payments from './Payments/payments'
import ChequePayments from './ChequePayments/chequePayment'
import Student from '../../Profiles/studentProfile'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    marginTop: '72px',
    marginLeft: '40px',
    paddingTop: '20px',
    minHeight: '75vh'
  }
})

class TransactionStatus extends Component {
  state = {
    value: 'one',
    currentSession: null,
    getData: true,
    erpNo: null
  };

  handleChange = (event, value) => {
    this.setState({ value })
  };

  handleChangeIndex = index => {
    this.setState({ value: index })
  };

  sessionChangeHandler = (e) => {
    this.setState({
      currentSession: e.value,
      getData: false
    })
  }

  erpChangeHander = (e) => {
    this.setState({
      erpNo: e.target.value,
      getData: false
    })
  }

  showTransactionHandler = () => {
    if (!this.state.currentSession && !this.state.erpNo) {
      this.props.alert.warning('Please Fill All The Fields')
      return
    }
    this.setState({
      getData: true
    })
  }

  render () {
    const style = {
      boxAlign: 'center',
      alignItems: 'center',
      backgroundColor: 'hsl(0,0%,100%)',
      borderColor: 'hsl(0,0%,80%)',
      borderRadius: '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
      cursor: 'default',
      height: '38px',
      width: '100%',
      paddingLeft: '15px'
    }

    let tabBar = null
    let cond = true
    if (cond) {
      tabBar = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='View Payments' />
              <Tab value='two' label='View Cheque Payments' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer>
            <Payments alert={this.props.alert}
              session={this.state.currentSession}
              getData={this.state.getData}
              erpNo={this.state.erpNo}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'two' && <TabContainer>
            <ChequePayments alert={this.props.alert}
              session={this.state.currentSession}
              getData={this.state.getData}
              erpNo={this.state.erpNo}
              user={this.props.user} />
          </TabContainer>}
        </React.Fragment>
      )
    }

    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={4}
              mobile={16}
              tablet={5}
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
            </Grid.Column>
            <Grid.Column
              computer={5}
              mobile={16}
              tablet={5}
              className='student-section-inputField-button'
            >
              <Button
                color='primary'
                variant='contained'
                onClick={this.showTransactionHandler}
              >Show Transactions</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Student erp={this.state.erpNo} user={this.props.user} alert={this.props.alert} />
        {tabBar}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  session: state.academicSession.items,
  user: state.authentication.user
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TransactionStatus))
