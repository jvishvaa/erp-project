import React, { Component } from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { connect } from 'react-redux'
import { Toolbar, Button, Grid } from '@material-ui/core'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
import { OmsSelect } from './../.././ui'

class ViewClassGroup extends Component {
  constructor () {
    super()
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.state = {
      tableData: [],
      loading: false
    }
  }
  handleClickBranch = (e) => {
    this.setState({ classGroupBranchId: e.value, gradevalue: [], branchValue: e })
    this.props.gradeMapBranch(e.value)
  }
  handleGrade = (e) => {
    this.setState({ grade: e.value, gradevalue: e })
    console.log(e.value)
    // this.getData(this.state.classGroupBranchId, e.value)
  }

   handleGet = () => {
     let { classGroupBranchId, grade } = this.state
     this.setState({ loading: true })

     classGroupBranchId && grade ? axios.get(urls.ClassGroup + `?mapping_grade=${grade}`, {
       headers: {
         Authorization: 'Bearer ' + this.props.user,
         'Content-Type': 'application/json'
       }
     })
       .then(res => {
         console.log(res)
         this.setState({ tableData: res.data })
         this.setState({ loading: false })
       })
       .catch(error => {
         console.log(error)
       })

       : axios.get(urls.ClassGroup + `?branch_id=${classGroupBranchId}`, {
         headers: {
           Authorization: 'Bearer ' + this.props.user,
           'Content-Type': 'application/json'
         }
       })
         .then(res => {
           console.log(res)
           this.setState({ tableData: res.data })
           this.setState({ loading: false })
         })
         .catch(error => {
           console.log(error)
         })
   }
  deleteHandler = (id) => {
    axios
      .delete(urls.ClassGroup + String(id) + '/', {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.props.alert.success('ClassGroup deleted')
        this.setState({ loading: true })
        this.handleGet()
      })
      .catch(error => {
        console.log(error)
      })
  }

  render () {
    let { tableData } = this.state
    console.log(this.props.grades, 'grade'
    )
    console.log(this.state.grade, 'gggg')
    console.log(this.state)
    console.log(this.props)
    console.log(this.props.user.id)
    console.log(tableData)
    console.log(this.role)
    return (
      <React.Fragment>
        <Toolbar>
          <Grid container>
            <Grid item>
              <OmsSelect
                options={
                  this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : []
                }
                defaultValue={this.state.branchValue}
                change={this.handleClickBranch}
              />
            </Grid><Grid>
              <OmsSelect
                name='grade'
                placeholder='Grade'
                options={this.props.grades
                  ? this.props.grades.map(grade => ({
                    value: grade.id,
                    label: grade.grade.grade
                  }))
                  : []}
                defaultValue={this.state.gradevalue}
                change={this.handleGrade}
              /></Grid>
            <Grid>
              <Button variant='contained'color='primary'style={{ padding: '5px', marginLeft: '10px' }}onClick={this.handleGet}
              >
              Get
              </Button></Grid>
          </Grid>
        </Toolbar>

        {tableData && (

          <ReactTable
            data={this.state.tableData}
            loading={this.state.loading}
            columns={[
              {
                Header: 'Class Group Name',
                accessor: 'class_group_name'
              },
              {
                Header: ' Branch Name',
                accessor: 'class_group_branch.branch_name'
              },
              {
                Header: ' City',
                accessor: 'class_group_branch.city'
              },
              {
                id: 'x',
                Header: ' Action',
                Cell: ({ original }) => {
                  return <IconButton aria-label='Delete'>
                    <DeleteIcon fontSize='small' onClick={(e) => {
                      this.deleteHandler(original.id)
                    }} />
                  </IconButton>
                }
                // accessor: props => (<IconButton aria-label='Delete' onClick={(e) => this.deleteHandler(props.user.id)} >
                //   <DeleteIcon fontSize='small' />

                // </IconButton>)
              }
            ]
            }
          />
        )
        }

      </React.Fragment>

    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  grades: state.gradeMap.items,
  classgrouptypes: state.classgrouptypes.items

})

const mapDispatchToProps = dispatch => ({
  loadBranches: dispatch(apiActions.listBranches()),
  listClassGroupType: dispatch(apiActions.listClassGroupType()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewClassGroup)
