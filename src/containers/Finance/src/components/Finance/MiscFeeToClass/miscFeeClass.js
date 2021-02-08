import React, { Component } from 'react'
import axios from 'axios'
import { Button, Grid } from '@material-ui/core/'

import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiActions } from '../../../_actions'
// import { RouterButton, OmsFilterTable } from '../../../ui'
import '../../css/staff.css'
import { urls } from '../../../urls'
import * as actionTypes from '../store/actions'
import Layout from '../../../../../Layout';
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

var grade = []
const MiscFeeTable = {
  namespace: 'Misc Fee'
}

class MiscFeeClass extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showtable: false,
      sessionData: null
    }
    this.deleteHandler = this.deleteHandler.bind(this)
    this.changehandlerbranch.bind(this)
    this.handleClickFeeData.bind(this)
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  handleClickSessionYear = (e) => {
    this.setState({ session: e.value, branchData: [], sessionData: e }, () => {
      this.props.fetchBranches(e.value, this.props.alert, this.props.user)
    })
  }

  handleType = (e) => {
    this.setState({ feeType: e.value })
  }

  handleClickFeeData = (e) => {
    this.renderTable()
  }

  deleteHandler = id => {
    console.log(id)
    axios
      .delete(urls.MiscFee + id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success('Deleted Successfully')
        this.renderTable()
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE + error)
        this.props.alert.error('Something Went Wrong')
      })
  };

  renderTable = () => {
    if (this.state.session && this.state.branchId && this.state.feeType) {
      axios
        .get(urls.MiscFee + '?session_year=' + this.state.session + '&branch=' + this.state.branchId + '&type_of_fee=' + this.state.feeType, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          var arr = res['data']
          console.log(arr)
          var feelist = []
          var feetable = []
          arr.forEach((data, index) => {
            feelist.push({ sr: index + 1, type: data.type })
            grade.forEach((grade) => {
              let curentGrade = data.grades.filter(gradelist => gradelist.grade_id === grade.id)
              console.log(curentGrade)
              feelist[feelist.length - 1][grade.grade] = (curentGrade.length > 0 ? curentGrade[0].amount : 0)
            })
            feelist[feelist.length - 1]['edit'] =
              // <RouterButton
              //   icon='edit'
              //   value={{
              //     basic: 'basic',
              //     href: '/finance/misc_feeClass/edit/' + data.type_id
              //   }}
              //   id={data.type_id}
              // />
            feelist[feelist.length - 1]['delete'] =
              <Button
                icon='delete'
                basic
                onClick={e => this.deleteHandler(data.type_id)}
              />
          })

          feetable = [
            {
              name: 'sr',
              displayName: 'Sr',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'type',
              displayName: 'Type',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            }
          ]
          grade.forEach((grade) => {
            feetable.push(
              {
                name: grade.grade,
                displayName: grade.grade,
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              }
            )
          })
          feetable.push({
            name: 'edit',
            displayName: 'Edit',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          },
          {
            name: 'delete',
            displayName: 'Delete',
            inputFilterable: true,
            exactFilterable: true,
            sortable: true
          })
          this.setState({ data: feelist })
          this.setState({ field: feetable, showtable: true })
        })
        .catch((error) => {
          console.log("Error: Couldn't fetch data from " + urls.MiscFee + error)
        })
    }
  }
  componentDidMount () {
    // to get all the grades
    axios
      .get(urls.GradeList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        grade = res.data
        console.log(grade)
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE + error)
      })
  }

  render () {
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.sessionData ? ({
                value: this.state.sessionData.value,
                label: this.state.sessionData.label
              }) : null}
              options={
                this.props.session && this.props.session.session_year.length
                  ? this.props.session.session_year.map(session => ({ value: session, label: session })
                  ) : []}
              onChange={this.handleClickSessionYear}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData ? this.state.branchData : ''}
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Type Of Fee*</label>
            <Select
              placeholder='Select Fee Type'
              options={
                [
                  {
                    value: 'Misc_Fee_Types',
                    label: 'Misc Fee Type'
                  },
                  {
                    value: 'Normal_Fee_Types',
                    label: 'Normal Fee Type'
                  },
                  {
                    value: 'Other_Fee_Types',
                    label: 'Other Fee Type'
                  }
                ]
              }
              onChange={this.handleType}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              style={{ marginTop: '20px' }}
              color='primary'
              variant='contained'
              onClick={this.handleClickFeeData}
            >
                    Show Mappings
            </Button>
          </Grid>
          {this.state.showtable
            ? <React.Fragment>
              <Grid item xs='12'>
                {/* <OmsFilterTable
                  filterTableData={MiscFeeTable}
                  tableData={this.state.data}
                  tableFields={this.state.field}
                /> */}
              </Grid>
            </React.Fragment>
            : null}
          {this.props.dataLoading ? <CircularProgress open /> : null}
        </Grid>
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  listBranches: dispatch(apiActions.listBranches()),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(MiscFeeClass)))
