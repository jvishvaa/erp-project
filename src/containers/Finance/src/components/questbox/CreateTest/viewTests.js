import React, { Component, Fragment } from 'react'
// import axios from 'axios'
import { connect } from 'react-redux'
import { Card } from 'semantic-ui-react'
import LinkTag from '@material-ui/core/Link'
import { Button, withStyles, Typography, Tabs, Tab, AppBar, Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
// import classnames from 'classnames'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import { apiActions } from '../../../_actions'
import { InternalPageStatus } from '../../../ui'
// import OnlineTest from '../../Test'
// import { urls } from '../../../urls'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    // marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

class ViewTests extends Component {
  constructor () {
    super()
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.state = {
      attemtingAssessNo: 0,
      assessmentCount: 0,
      questionPaperData: [],
      testId: null,
      expanded: false,
      status: { NS: 'Not started', S: 'started', C: 'Completed' },
      tab: 0
    }
    this.getTabContent = this.getTabContent.bind(this)
  }

  componentWillMount () {
    // if (!this.props.listTests) {
    this.props.getAllTests()
    // }
  }

  // changes

  handleTabChange = (event, value) => {
    this.setState({ tab: value })
  }

  getTabContent (testsData, classes, type) {
    console.log(testsData)
    let { queryString } = this.state
    let filteredTestsData = queryString
      ? testsData.filter(obj => obj.onlinetest_name.includes(queryString))
      : testsData
    return (
      <div style={{ minHeight: '50vh', padding: 16 }}>
        <Card.Group>
          {filteredTestsData.length > 0 ? filteredTestsData.map(test => (
            <Card
              style={{ maxWidth: '21vw', borderRadius: 0, border: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}
              data={test}
            >
              <Card.Content header={test.onlinetest_name} meta={() => {
                return <div>
                  <Typography
                    component='p'
                    style={{ float: 'left', color: test.status === 'C' ? 'green' : 'rgba(0,0,0,0.5)' }}
                  >
                    {this.state.status[test.status]}
                  </Typography>
                  {test.status === 'NS'
                    ? ''
                    : <Typography
                      component='p'
                      style={{ float: 'right', color: 'rgba(0,0,0,0.5)' }}
                    >
                      Marks: {test.total_score !== null ? test.total_score : '--'} out of {test.max_score ? test.max_score : '--'}
                    </Typography>
                  }
                </div>
              }} />
              <Button variant='contained' style={{ boxShadow: 'none', borderRadius: 0 }}color={test.status === 'C' ? 'default' : test.status === 'NS' ? 'primary' : 'secondary'} className={classes.button} onClick={() => this.props.history.push(`/questbox/handleTest/${test.id}`)}>
                {test.status === 'C' ? <Fragment>D e t a i l s</Fragment> : null}
                {test.status === 'NS' ? <Fragment> T a k e        &nbsp; t e s t </Fragment> : null}
                {test.status === 'S' ? <Fragment> C o n t i n u e </Fragment> : null}
              </Button>
            </Card>
          )) : <InternalPageStatus label='No Tests' loader={false} />
          }
        </Card.Group>
      </div>
    )
  }

  decideTab=() => {
    let { practiceTests, normalTests, classes, listTests, isListTestsFailed } = this.props
    console.log(this.props)
    let { tab } = this.state
    let testsType, testsData
    if (tab === 0) {
      testsData = normalTests
      testsType = 'online'
    } else if (tab === 1) {
      testsData = practiceTests
      testsType = 'practice'
    }
    if (isListTestsFailed) {
      return (
        <InternalPageStatus
          label={
            <p>Error occured in fetching Tests&nbsp;
              <LinkTag component='button' onClick={() => { this.props.getAllTests() }}>
                <b>Click here to reload_</b></LinkTag>
            </p>
          }
          loader={false}
        />
      )
    }
    return (listTests && testsData) ? this.getTabContent(testsData, classes, testsType)
      : <InternalPageStatus label={`Loding ${testsType} tests...`} />
  }
  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid item>
              <Tabs
                value={this.state.tab}
                onChange={this.handleTabChange}
                indicatorColor='secondary'
                textColor='secondary'
                variant='fullWidth'
              >
                <Tab label='Online Tests' />
                {this.role !== 'Applicant' && <Tab label='Practice Tests' />}
              </Tabs>
            </Grid>
            <Grid item>
              <InputBase className={classes.input} onChange={(e) => { this.setState({ queryString: e.target.value }) }} placeholder='Search Tests' />
              <IconButton className={classes.iconButton} aria-label='Search'>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        {this.decideTab()}
      </React.Fragment>
    )
  }
}
function getRole () {
  let personalInfo = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).personal_info : undefined
  let role = personalInfo ? personalInfo.role : undefined
  return role
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  listTests: state.listTests.items,
  isListTestsFailed: state.listTests.isFailed,
  //   filtering practice tests, according to the usr role from all test data
  practiceTests: state.listTests.items ? state.listTests.items.filter(item => item.onlinetest_type === 'Practice').filter(ftItem => {
    // return true
    let role = getRole()
    let isAllowedRole = ftItem.allowed_roles.some(obj => (role === obj.role_name))
    if (isAllowedRole) { return true }
  }) : [],

  normalTests: state.listTests.items ? state.listTests.items.filter(item => item.onlinetest_type === 'Normal').filter(ftItem => {
    // return true
    let role = getRole()
    let isAllowedRole = ftItem.allowed_roles.some(obj => (role === obj.role_name))
    if (isAllowedRole) { return true }
  }) : [],

  selectedTestData: state.onlineTest.items
})

const mapDispatchToProps = dispatch => ({
  getAllTests: () => dispatch(apiActions.listTests()),
  getOnlineTest: testId => dispatch(apiActions.getOnlineTest(testId))
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewTests)))
