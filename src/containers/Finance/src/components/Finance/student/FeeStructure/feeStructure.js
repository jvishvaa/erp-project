import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core/'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import DefaultView from './defaultView'
import DueDateWise from './dueDateWise'
import Layout from '../../../../../../Layout'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
}

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Finance' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Fee Structure') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

class FeeStructure extends Component {
  constructor (props) {
    super(props)
    this.state = {
      erp: null,
      feeRecords: null,
      value: 'one',
      getList: false
    }
  }

  componentDidMount () {
    if (!this.props.feeStructureList.length) {
      this.props.fetchListDefaultView(this.props.alert, this.props.user)
      this.setState({ getList: true })
    } else {
      this.setState({ getList: true })
    }
    // for disabling the terminal
    // document.onkeydown = function (e) {
    //   if (e.keyCode === 123) {
    //     return false
    //   }
    //   if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
    //     return false
    //   }
    //   if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
    //     return false
    //   }
    //   if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
    //     return false
    //   }
    // }
    // document.addEventListener('contextmenu', event => event.preventDefault())
    // console.log('dues', this.props.studentDues.dues)
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('--------------nextProps-----------', nextProps.feeStructureList)
  //   console.log('--------------myProps-----------', this.props.feeStructureList)
  //   if (nextProps.feeStructureList !== this.props.feeStructureList) {
  //     this.props.fetchListDefaultView(this.props.alert, this.props.user)
  //   } else {
  //     return false
  //   }
  // }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  render () {
    let tabView = null
    if (this.state.getList && this.props.feeStructureList && this.props.feeStructureList.length) {
      tabView = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='Default View Wise' />
              <Tab value='two' label='Due Date Wise' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer>
            <DefaultView
              alert={this.props.alert}
              defaultViewList={this.props.feeStructureList}
              user={this.props.user}
              getList={this.state.getList}
            />
          </TabContainer>}
          {this.state.value === 'two' && <TabContainer>
            <DueDateWise
              alert={this.props.alert}
              dueDateWiseList={this.props.feeStructureList}
              user={this.props.user}
              getList={this.state.getList}
            />
          </TabContainer>}
        </React.Fragment>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid >
          <Grid.Row>
            <Grid.Column computer={16} className='student-addStudent-StudentSection'>
              <Grid>
                {/* <Grid.Row>
                      <Grid.Column computer={6}>
                      <input
                      style={{marginLeft : 30}}
                        name='searchBox'
                        type='number'
                        className='form-control'
                        placeholder='Search ERP'
                        onChange= {this.erpFieldHandler}
                      />
                      </Grid.Column>
                      <Grid.Column computer={4}>
                        <Button
                          style={{marginLeft : '10px'}}
                          variant="contained"
                          color="primary"
                          onClick={this.erpHandler}>
                          Submit
                        </Button>
                      </Grid.Column>
                    </Grid.Row> */}

                <Grid.Row>
                  <Grid.Column
                    style={{ paddingLeft: '20px' }}
                    computer={16}
                    mobile={16}
                    tablet={16}
                  >
                    {tabView}
                  </Grid.Column>
                </Grid.Row>

              </Grid>

            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  feeStructureList: state.finance.studentFeeStructure.feeStructurelist,
  studentDues: state.finance.studentFeeStructure.studentDues,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  fetchStudentDues: (erp, session, alert, user) => dispatch(actionTypes.fetchStudentDues({ erp, session, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchListDefaultView: (alert, user) => dispatch(actionTypes.fetchStudentFeeStructureList({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(FeeStructure)))
