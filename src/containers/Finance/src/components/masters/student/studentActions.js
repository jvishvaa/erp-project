import React, { Component } from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import { apiActions } from '../../../_actions'
import { COMBINATIONS } from './gselect_for_student_action'
import GSelect from '../../../_components/globalselector'

const styles = theme => ({
  root: {
    width: '100%'
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '40%'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  expandCol: {
    width: '5%'
  },
  expand: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    margin: 0,
    padding: 0
  },
  expandOpen: {
    transform: 'rotate(0deg)'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  grow: {
    flexGrow: 1
  }
})

class studentActions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectorData: [],
      responseData: '',
      isStudentDataLoading: false,
      hideTable: false
    }
    this.onChange = this.onChange.bind(this)
    this.getStudentActions = this.getStudentActions.bind(this)
  }

  getStudentActions (data) {
    this.setState({ hideTable: true, isStudentDataLoading: true })
    let { selectorData } = this.state
    if (selectorData.branch_id && selectorData.grade_id && selectorData.section_id) {
      axios
        .get(urls.StudentActions + '?branch_id=' + selectorData.branch_id + '&grade_id=' + selectorData.grade_id + '&section_id=' + selectorData.section_id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then((Res) => {
          this.setState({ responseData: Res.data, isStudentDataLoading: false })
        })
    }
    if (selectorData.branch_id && !selectorData.grade_id && !selectorData.section_mapping_id) {
      axios
        .get(urls.StudentActions + '?branch_id=' + selectorData.branch_id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then((Res) => {
          this.setState({ responseData: Res.data, isStudentDataLoading: false })
        })
    }
    if (selectorData.branch_id && selectorData.grade_id && !selectorData.section_id) {
      axios
        .get(urls.StudentActions + '?branch_id=' + selectorData.branch_id + '&grade_id=' + selectorData.grade_id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then((Res) => {
          this.setState({ responseData: Res.data, isStudentDataLoading: false })
        })
    }
  }

  onChange (data) {
    this.setState({ selectorData: data })
    if (data.section_id) {
      this.getStudentActions()
    }
    if (!data.section_mapping_id) {
      this.setState({ hideTable: false })
    }
  }

  render () {
    let { classes } = this.props
    return (
      <React.Fragment>
        <Grid style={{ marginLeft: 4 }} item>
          <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          <Button onClick={() => this.getStudentActions()}>Get Students Actions</Button>
        </Grid>
        <div className={classes.grow} />
        <div className={classes.tableWrapper} style={{ overflowX: 'auto' }}>
          {this.state.hideTable && <div>{this.state.isStudentDataLoading ? <InternalPageStatus label={'student data loading...'} /> : <ReactTable
            manual
            data={this.state.responseData || []}
            defaultPageSize={5}
            style={{ maxWidth: '100%' }}
            showPageSizeOptions={false}
            getStudentAction={this.getStudentActions}
            columns={[
              {
                Header: 'Student Name',
                accessor: props => {
                  let { student: { name } = { name: 'No-student-data' } } = props
                  return name
                },
                id: 'sName',
                maxWidth: 300
              },
              {
                Header: 'Enrollment Code',
                accessor: 'student.erp',
                maxWidth: 300
              },
              {
                Header: 'Last Action',
                accessor: 'action',
                maxWidth: 300
              },
              {
                Header: 'Action_Done_By',
                accessor: 'applied_by.username',
                maxWidth: 300
              },
              {
                Header: 'Action_Done_At',
                accessor: 'applied_at',
                maxWidth: 300
              }
            ]}
          />}
          </div>}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  student: state.student,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  sectionList: state.sections.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSections: () => dispatch(apiActions.listSections()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId) => dispatch(apiActions.getSectionMapping(acadMapId)),
  listStudents: (sectionId, status, pageId = 1, isDelete) => dispatch(apiActions.listStudents(sectionId, status, pageId, isDelete))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(withStyles(styles)(studentActions))))
