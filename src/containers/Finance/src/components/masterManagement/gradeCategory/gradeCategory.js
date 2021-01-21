import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../ui'
import '../../css/staff.css'

const addGradeCategory = {
  label: 'Add Grade Category',
  color: 'blue',
  href: '/gradeCategory/addgradecategory',
  disabled: false
}

const gradeCategoryTable = {
  namespace: 'Grade Category Data'
}

// const csv = {
//   label: 'CSV'
// }

// const excel = {
//   label: 'Excel'
// }

const field = [
  {
    name: 'srNumber',
    displayName: 'Sr.'
  },
  {
    name: 'gradeCategory',
    displayName: 'Grade Category'
  },
  {
    name: 'createdDate',
    displayName: 'Created Date'
  },
  {
    name: 'updatedDate',
    displayName: 'Updated Date'
  },
  {
    name: 'edit',
    displayName: 'Edit'
  },
  {
    name: 'delete',
    displayName: 'Delete'
  }
]

field.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class gradeCategory extends Component {
  constructor (props) {
    super()
    this.state = {
      aGradeCategory: [],
      data: [],
      click: false
    }
    this.csv = urls.GradeCategoryExport + '?export_type=csv'
    this.excel = urls.GradeCategoryExport + '?export_type=excel'
    this.deleteHandler = this.deleteHandler.bind(this)
  }

  deleteHandler = id => {
    var updatedList = urls.GRADECATEGORY + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({
          alertMessage: {
            messageText: 'Deleted grade category successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + urls.GRADECATEGORY)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  };

  componentDidMount () {
    var aGradeCategory = []
    if (this.props.gradeCategory && this.props.gradeCategory.length > 0) {
      var that = this
      this.props.gradeCategory.forEach(function (gradeCat, index) {
        that.setState({
          edit: {
            name: 'edit',
            href: '/gradeCategory/updateGradeCategory?' + gradeCat.id
          }
        })
        aGradeCategory.push({
          srNumber: index + 1,
          gradeCategory: gradeCat.grade_category,
          createdDate: gradeCat.createdAt,
          updatedDate: gradeCat.updatedAt,
          edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/gradeCategory/updateGradeCategory?' + gradeCat.id
              }}
            />
          ),
          delete: (
            <IconButton
              area-label='delete'
              onClick={() => { that.deleteHandler(gradeCat.id) }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
      })
      this.setState({ aGradeCategory: aGradeCategory })
    } else {
      this.props.listGradeCategories()
    }
  }
  componentWillReceiveProps (props) {
    console.log('will receive', props)
    var aGradeCategory = []
    if (props.gradeCategory && props.gradeCategory.length > 0) {
      var that = this
      props.gradeCategory.forEach(function (gradeCat, index) {
        that.setState({
          edit: {
            name: 'edit',
            href: '/gradeCategory/updateGradeCategory?' + gradeCat.id
          }
        })
        aGradeCategory.push({
          srNumber: index + 1,
          gradeCategory: gradeCat.grade_category,
          createdDate: gradeCat.createdAt,
          updatedDate: gradeCat.updatedAt,
          edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/gradeCategory/updateGradeCategory?' + gradeCat.id
              }}
            />
          ),
          delete: (
            <IconButton
              area-label='Delete'
              basic
              onClick={() => { that.deleteHandler(gradeCat.id) }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
      })
      this.setState({ aGradeCategory: aGradeCategory })
    }
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addGradeCategory} />
          }>
          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
          </div>

          <AlertMessage alertMessage={this.state.alertMessage} />
        </Toolbar>
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={13}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                filterTableData={gradeCategoryTable}
                tableData={this.state.aGradeCategory}
                tableFields={field}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  gradeCategory: state.gradeCategory.items
})

const mapDispatchToProps = dispatch => ({
  listGradeCategories: () => dispatch(apiActions.listGradeCategories())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(gradeCategory))
