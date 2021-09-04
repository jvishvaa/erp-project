import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import { Typography, Grid, CircularProgress } from '@material-ui/core/';
import axios from 'axios';
import axiosInstance from '../../../../../../../config/axios';
import {urls} from '../../../../urls';
import FeeDetails from './feeDetails';
import MakePayment from './makePayment';
// import OtherFee from './otherFee'
import CurrentTransactions from './currentTransactions';
import AllTransactions from './allTransactions';
import '../../../css/staff.css';
import { apiActions } from '../../../../_actions';
// import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Financepeer from '../../../../assets/financepeer.jpg';
import Financegray from '../../../../assets/GQ_OIS_ERP.png';
import Layout from '../../../../../../Layout';

function TabContainer({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};
const BranchIdBangalore = [
  10, 8, 7, 57, 12, 18, 17, 21, 27, 24, 67, 72, 81, 82, 92, 77, 69, 14,
];
const BranchIdMumbai = [70, 26, 3, 15, 11, 13, 22, 4, 67, 41, 5, 6, 73, 76];

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
let moduleId;
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Finance' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Manage Payment') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          moduleId = item.child_id;
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

class ManagePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'one',
      sessionData: [],
      session: '',
      getList: false,
      erp: null,
      student: false,
    };
    this.currBrnch = JSON.parse(localStorage.getItem('userDetails')).branch_id;
  }
  componentDidMount() {
    if(this.props.user === null){
      window.location.reload()
    }
    // for disabling the terminal
    document.onkeydown = function (e) {
      if (e.keyCode === 123) {
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
        return false;
      }
      if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
        return false;
      }
    };
    let superUser = JSON.parse(localStorage.getItem('rememberDetails')) || {};
    let NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    let user_id = JSON.parse(localStorage.getItem('userDetails')).erp || {};
    let branch_name = JSON.parse(localStorage.getItem('userDetails')).role_details.branch[0].branch_name || {};
    console.log(branch_name , "branch");



    let domain = window.location.href;
    let arr = domain.split("/");
    let sub = arr[2]
    console.log(arr[2] , "domain");

    if (sub === 'localhost:3000') {
    if(branch_name === 'BLR'){
      this.checkPayment()
      console.log("match");
      }
      if(branch_name === 'BTM'){
        this.checkPayment()
        console.log("match");
        }
    }
    if (sub === 'dev.olvorchidnaigaon.letseduvate.com') {
      if(branch_name === 'BTM'){
      this.checkPayment()
      console.log("match");
      }
      if(branch_name === 'BLR'){
        this.checkPayment()
        console.log("match");
        }
    }
    if (sub === 'orchids.letseduvate.com') {
      this.checkPayment()
    }
    if (sub === 'aolschool.letseduvate.com') {
      this.checkPayment()
    }


    // console.log(this.state.student , "student state");
    // this.checkPayment()
    // console.log(superUser[0], 'super');
      // if (NavData && NavData.length) {
      //   NavData.forEach((item) => {
      //     if (
      //       item.parent_modules === 'Online Class' &&
      //       item.child_module &&
      //       item.child_module.length > 0
      //     ) {
      //       item.child_module.forEach((item) => {
      //         if (item.child_name === 'Attend Online Class') {
      //           // setModuleId(item.child_id);
      //           console.log('Student');
      //           this.setState({
      //             student: true,
      //           });
      //           return;
      //           // console.log(item.child_id, 'Chekk');
      //         }
      //       });
      //     }
      //   });
      // }
    // document.addEventListener('contextmenu', event => event.preventDefault())
  
   

}

  checkPayment(sub){
    let user_id = JSON.parse(localStorage.getItem('userDetails')).erp || {};
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
    axios
    .get(urls.CheckPayment + '?student=' + user_id ,{
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((res) => {
      console.log(res, 'current eventssss');
    this.setState({ student: res.data.is_allowed });
    })
    .catch((error) => {
      console.log(error);
    });

    // if ( sub === 'https://dev.olvorchidnaigaon.letseduvate.com'  ) {
    // if ( sub === 'aolschool.letseduvate.com' ) {

    //   this.setState({ student: true});
    // } else {
    //   this.setState({ student: false});

    // }
  }

  componentDidUpdate(){
    console.log(this.state.student , "student state");
  }

  handleChangeAppBar = (event, value) => {
    this.setState({ value });
  };

  handleAcademicyear = (e) => {
    this.setState({ session: e.value, sessionData: e, getList: true });
    console.log("hit academic");
  };



  render() {
    // const panes = [
    //   { menuItem: 'Fee Details', render: () => <FeeDetails sessionYear={this.state.session} /> },
    //   { menuItem: 'Make Payment', render: () => <MakePayment sessionYear={this.state.session} alert={this.props.alert} /> },
    //   { menuItem: 'Other Fee', render: () => <OtherFee userI={this.props.user} alert={this.props.alert} acadId={this.state.session} /> },
    //   { menuItem: 'Current Transactions', render: () => <CurrentTransactions /> },
    //   { menuItem: 'All Transactions', render: () => <AllTransactions /> }
    // ]

    // let pane = null
    // if (this.state.session) {
    //   pane = <Tab panes={panes} />
    // }
    let tabView = null;
    if (this.state.getList) {
      tabView = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChangeAppBar}>
              <Tab value='one' label='Fee Details' />
              {this.state.student ? (
                <Tab value='two' label='Make Payment' />
              ) : '' }
              {/* <Tab value='three' label='Other Fees' /> */}
              {/* {this.state.student ? (
                <Tab value='four' label='Current Transactions' />
              ) : '' } */}
              {/* <Tab value='two' label='Make Payment' /> */}
                <Tab value='four' label='Current Transactions' />
              <Tab value='five' label='All Transactions' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && (
            <TabContainer>
              <FeeDetails
                sessionYear={this.state.session}
                user={this.props.user}
                alert={this.props.alert}
                getList={this.state.getList}
              />
            </TabContainer>
          )}
          {this.state.value === 'two' && (
            <TabContainer>
              <MakePayment
                sessionYear={this.state.session}
                user={this.props.user}
                alert={this.props.alert}
                getList={this.state.getList}
                erp={JSON.parse(localStorage.getItem('userDetails')).erp}
                gradeId={JSON.parse(localStorage.getItem('userDetails')).grade_id}
              />
            </TabContainer>
          )}
          {/* {this.state.value === 'three' && <TabContainer>
            <OtherFee
              sessionYear={this.state.session}
              user={this.props.user}
              acadId={this.state.session}
              alert={this.props.alert}
              getList={this.state.getList}
            />
          </TabContainer>} */}
          {this.state.value === 'four' && (
            <TabContainer>
              <CurrentTransactions
                sessionYear={this.state.session}
                user={this.props.user}
                alert={this.props.alert}
                getList={this.state.getList}
              />
            </TabContainer>
          )}
          {this.state.value === 'five' && (
            <TabContainer>
              <AllTransactions
                sessionYear={this.state.session}
                user={this.props.user}
                alert={this.props.alert}
                getList={this.state.getList}
              />
            </TabContainer>
          )}
        </React.Fragment>
      );
    }
    return (
      <Layout>
        <Grid conatiner spacing={3} style={{ padding: 15 }}>
          <Grid conatiner spacing={3} border={2}>
            {BranchIdBangalore.includes(this.currBrnch) ? (
              <Grid item xs={12} sm={4} style={{ float: 'right' }}>
                <a href='https://www.financepeer.co/' target='blank'>
                  <img style={{ width: '250px' }} className='Image' src={Financepeer} />
                </a>
                <h2 className='ads'> 0% EMI Cost </h2>
              </Grid>
            ) : null}
            {BranchIdMumbai.includes(this.currBrnch) ? (
              <Grid item xs={12} sm={4} style={{ float: 'right' }}>
                <a href='https://www.grayquest.com/signup' target='blank'>
                  <img style={{ width: '250px' }} className='Image' src={Financegray} />
                </a>
                <h2 className='ads'> 0% EMI Cost </h2>
              </Grid>
            ) : null}
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <label>Academic Year*</label>
              {/* <OmsSelect
                options={this.props.session ? this.props.session.session_year.map((session) => ({ value: session, label: session })) : null}
                change={this.handleAcademicyear} /> */}
              <Select
                placeholder='Select Year'
                value={this.state.sessionData ? this.state.sessionData : null}
                options={
                  this.props.session
                    ? this.props.session.session_year.map((session) => ({
                        value: session,
                        label: session,
                      }))
                    : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
          </Grid>
          <Grid item xs='12' style={{ marginTop: 20 }}>
            {tabView}
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </Grid>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
});

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ManagePayment));