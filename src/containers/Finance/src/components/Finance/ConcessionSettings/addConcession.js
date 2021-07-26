import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button, Grid } from '@material-ui/core/';

import * as actionTypes from '../store/actions';
import { apiActions } from '../../../_actions';
import '../../css/staff.css';

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
let moduleId = null;

if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Concession' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Concession Settings') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
          moduleId = item.child_id;
          // })
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
class AddConcessionSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concession_name: '',
      concession_type: [],
      normalFee: [],
      MiscFee: [],
      otherFee: [],
      concessionTypeId: '',
      normalFeeId: '',
      miscFeeId: '',
      otherFeeId: '',
      percentageValue: false,
      manualAmount: false,
      fixedAmount: false,
      concession_percentage: '',
      branch_level_concession_limit_amount: '',
      fixed_amount: '',
      automatic_manual_fixed: '',
      session: '',
      sessionData: [],
      branchData: [],
      branchIds: [],
    };
  }

  concessionTypeHandler = (e) => {
    this.setState({ concessionTypeId: e.value });
  };

  normalFeeTypeHandler = (e) => {
    this.setState({ normalFeeId: e.value });
  };

  miscFeeTypeHandler = (e) => {
    this.setState({ miscFeeId: e.value });
  };

  otherFeeTypeHandler = (e) => {
    this.setState({ otherFeeId: e.value });
  };

  fixedAmountHandler = (e) => {
    if (e.target.value < 1) {
      this.props.alert.warning('Invalid Amount');
      return;
    }
    this.setState({ fixed_amount: e.target.value });
  };

  handleAmount = (e) => {
    this.setState({ automatic_manual_fixed: e.value });
    if (e.value === '1') {
      this.setState({ percentageValue: true, manualAmount: false, fixedAmount: false });
    } else if (e.value === '2') {
      this.setState({ manualAmount: true, percentageValue: false, fixedAmount: false });
    } else if (e.value === '3') {
      this.setState({ fixedAmount: true, manualAmount: false, percentageValue: false });
    }
  };

  concessionNameHandler = (e) => {
    this.setState({ concession_name: e.target.value });
  };

  manualAmountHandler = (e) => {
    if (e.target.value < 1) {
      this.props.alert.warning('Invalid Amount');
      return;
    }
    this.setState({ branch_level_concession_limit_amount: e.target.value });
  };

  adjusmentOrderHandler = (e) => {
    this.setState({
      adjustmentOrder: e.value,
    });
  };

  minAmountHandler = (e) => {
    this.setState({ amount: e.target.value });
  };

  concessionPercentageHandler = (e) => {
    // if (e.target.value < 1) {
    //   this.props.alert.warning('Invalid Per')
    //   return
    // }
    this.setState({ concession_percentage: e.target.value });
  };

  handleAcademicyear = (e) => {
    this.setState({ session: e.value, branchData: [], sessionData: e }, () => {
      this.props.fetchBranches(
        this.state.session,
        this.props.alert,
        this.props.user,
        moduleId
      );
    });
  };

  changehandlerbranch = (e) => {
    // this.setState({
    //   branch: {
    //     id: e.value,
    //     branch_name: e.label
    //   },
    //   branchData: e
    // })
    let branchIds = [];
    e.forEach(function (grdae) {
      branchIds.push(grdae.value);
    });
    this.setState({ branchIds: branchIds, branchData: e });
  };

  handleSubmitConcession = () => {
    let data = {
      academic_year: this.state.session,
      branch_id: this.state.branchIds,
      concession_type_id: this.state.concessionTypeId,
      concession_name: this.state.concession_name,
      automatic_manual_fixed: this.state.automatic_manual_fixed,
      adjustment_order: this.state.adjustmentOrder,
      normal_fee_types: this.state.normalFeeId || null,
      miscellaneous_fee_types: this.state.miscFeeId || null,
      other_fee_types: this.state.otherFeeId || null,
      minimum_amount: this.state.amount,
    };
    if (this.state.percentageValue) {
      data.concession_percentage = this.state.concession_percentage;
    } else if (this.state.manualAmount) {
      data.branch_level_concession_limit_amount =
        this.state.branch_level_concession_limit_amount;
    } else {
      data.fixed_amount = this.state.fixed_amount;
    }
    this.props.addConcession(data, this.props.alert, this.props.user);
    this.props.close();
  };
  render() {
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='10'>
            <label className='student-addStudent-segment1-heading'>
              Add Concession Settings
            </label>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction='column' spacing={3} style={{ padding: 15 }}>
          <Grid item xs='5'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              name='academicYear'
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
          <Grid item xs='5'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : null}
              isMulti
              name='branch'
              options={
                this.props.branches.length && this.props.branches
                  ? this.props.branches.map((branch) => ({
                      value: branch.branch.id,
                      label: branch.branch.branch_name,
                    }))
                  : []
              }
              onChange={this.changehandlerbranch}
            />
          </Grid>

          <Grid item xs='5'>
            <label>Concession Type*</label>
            <Select
              placeholder='Select Concession Type'
              name='concessionType'
              options={
                this.props.listConcessionTypes.concession_type &&
                this.props.listConcessionTypes.concession_type.length
                  ? this.props.listConcessionTypes.concession_type.map((concession) => ({
                      value: concession.id,
                      label: concession.type_name,
                    }))
                  : []
              }
              onChange={this.concessionTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Concession Name*</label>
            <input
              name='concession_name'
              placeholder='Concession Name'
              type='text'
              className='form-control'
              onChange={this.concessionNameHandler}
              value={this.state.concession_name}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Automatic/Manual/Fixed*</label>
            <Select
              placeholder='Select ..'
              id='autoManual'
              name='automaticManualAndFixed'
              options={[
                {
                  value: '1',
                  label: 'Automatic(On percentage wise)',
                },
                {
                  value: '2',
                  label: 'Manual',
                },
                {
                  value: '3',
                  label: 'Fixed Amount',
                },
              ]}
              onChange={this.handleAmount}
            />
          </Grid>
          {this.state.percentageValue ? (
            <Grid item xs='5'>
              <label>Concession Percentage*</label>
              <input
                name='concession_percentage'
                placeholder='Concession Percentage'
                type='number'
                min='1'
                className='form-control'
                onChange={this.concessionPercentageHandler}
                value={this.state.concession_percentage}
              />
            </Grid>
          ) : null}
          {this.state.manualAmount ? (
            <Grid item xs='5'>
              <label>Branch level concession limit amount*</label>
              <input
                name='branch_level_concession_limit_amount'
                placeholder='Concession Limit Amount'
                type='number'
                className='form-control'
                onChange={this.manualAmountHandler}
                value={this.state.branch_level_concession_limit_amount}
              />
            </Grid>
          ) : null}
          {this.state.fixedAmount ? (
            <Grid item xs='5'>
              <label>Fixed Amount*</label>
              <input
                name='fixed_amount'
                placeholder='Fixed Amount'
                type='number'
                className='form-control'
                onChange={this.fixedAmountHandler}
                value={this.state.fixed_amount}
              />
            </Grid>
          ) : null}
          <Grid item xs='5'>
            <label>Normal Fee Type</label>
            <Select
              placeholder='Select Normal Type'
              name='normalFee'
              options={
                this.props.listConcessionTypes.normal_fee_types &&
                this.props.listConcessionTypes.normal_fee_types.length
                  ? this.props.listConcessionTypes.normal_fee_types.map(
                      (normalFeeType) => ({
                        value: normalFeeType.id,
                        label: normalFeeType.fee_type_name,
                      })
                    )
                  : []
              }
              onChange={this.normalFeeTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Misc Fee Type</label>
            <Select
              placeholder='Select Misc Type'
              name='miscFee'
              options={
                this.props.listConcessionTypes.misc_fee_types &&
                this.props.listConcessionTypes.misc_fee_types.length
                  ? this.props.listConcessionTypes.misc_fee_types.map((miscFeeType) => ({
                      value: miscFeeType.id,
                      label: miscFeeType.fee_type_name,
                    }))
                  : []
              }
              onChange={this.miscFeeTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Other Fee Type</label>
            <Select
              placeholder='Select Other Type'
              name='otherFee'
              options={
                this.props.listConcessionTypes.other_fee_types &&
                this.props.listConcessionTypes.other_fee_types.length
                  ? this.props.listConcessionTypes.other_fee_types.map(
                      (otherFeeType) => ({
                        value: otherFeeType.id,
                        label: otherFeeType.fee_type_name,
                      })
                    )
                  : []
              }
              onChange={this.otherFeeTypeHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>Adjustment Order*</label>
            <Select
              placeholder='Select Adjustment Order'
              name='adjustmentorder'
              options={[
                {
                  value: '1',
                  label: 'Ascending',
                },
                {
                  value: '2',
                  label: 'Descending',
                },
                {
                  value: '3',
                  label: 'Installment Wise Percentage',
                },
              ]}
              onChange={this.adjusmentOrderHandler}
            />
          </Grid>
          <Grid item xs='5'>
            <label>
              Minimum amount to be payable for this concession to be availed(only normal
              fees)*
            </label>
            <input
              name='amount'
              placeholder='amount'
              style={{ width: '200px' }}
              type='number'
              min='0'
              className='form-control'
              onChange={this.minAmountHandler}
              value={this.state.amount}
            />
          </Grid>
          <Grid item xs='5'>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              onClick={this.handleSubmitConcession}
              style={{ marginRight: '10px' }}
              disabled={
                !this.state.concessionTypeId ||
                !this.state.concession_name ||
                !this.state.automatic_manual_fixed ||
                !this.state.adjustmentOrder ||
                !this.state.amount ||
                !this.state.concession_percentage ||
                this.state.branchIds.length === 0
              }
            >
              Add
            </Button>
            <Button
              color='primary'
              variant='contained'
              onClick={this.props.close}
              type='button'
            >
              Return
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  listConcessionTypes: state.finance.concessionSettings.listConcessionType,
});

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) =>
    dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  addConcession: (data, alert, user) =>
    dispatch(actionTypes.addListConcessionSettings({ data, alert, user })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddConcessionSettings));
