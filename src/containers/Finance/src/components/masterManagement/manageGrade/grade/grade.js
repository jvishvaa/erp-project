import React, { Component } from 'react'
import { Grid
} from 'semantic-ui-react'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'
import { urls } from '../../../../urls'
import AuthService from '../../../AuthService'
import {
  OmsSelect,
  RouterButton,
  OmsFilterTable,
  Toolbar
} from '../../../../ui'

const addGrade = {
  label: 'Add Grade',
  color: 'blue',
  href: 'grade/add',
  disabled: false
}

const filterTableData = {
  namespace: 'Grade Category'
}

const fields = [
  {
    name: 'Grade',
    displayName: 'Grade',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'CreatedDate',
    displayName: 'Created Date',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'UpdatedDate',
    displayName: 'Updated Date',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Edit',
    displayName: 'Edit',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Delete',
    displayName: 'Delete',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  }
]

class Grade extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categoryData: [],
      click: false
    }
    var objAuth = new AuthService()
    this.auth_token = objAuth.getToken()
    this.handleChangeGradeCategory = this.handleChangeGradeCategory.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
  }

  deleteHandler = id => {
    console.log('deleting', id)
    var updatedList = urls.GRADE + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        this.setState({
          alertMessage: {
            messageText: 'Deleted Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch((error) => {
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error.response.data)
      })
  };

  handleChangeGradeCategory = event => {
    this.csv = urls.GradeExport + '?grade_category=' + event.value + '&export_type=csv'
    this.excel = urls.GradeExport + '?grade_category=' + event.value + '&export_type=excel'
    this.props.loadGradeCategoryId(event.value)
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <React.Fragment>
              {this.state.gradecategory &&
              <React.Fragment>
                <div>
                  <Button href={this.csv} target='_blank'>CSV</Button>
                   margin: theme.spacing.
                </div>
                <Button href={this.excel} target='_blank'>Excel</Button>
              </React.Fragment>
              }
              <RouterButton value={addGrade} />
            </React.Fragment>
          }>
          <OmsSelect
            label={'Grade category*'}
            options={
              this.props.gradeCategory
                ? this.props.gradeCategory.map(gradeCategory => ({
                  value: gradeCategory.id,
                  label: gradeCategory.grade_category
                }))
                : []
            }
            change={this.handleChangeGradeCategory}
          />
          <Button style={{ margin: 8 }} href={this.csv} variant='contained' color='primary' target='_blank'>CSV</Button>
          <Button style={{ margin: 8 }} href={this.excel} variant='contained' color='primary'target='_blank'>Excel</Button>
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
                filterTableData={filterTableData}
                tableData={this.props.listGradeCategoryId
                  ? this.props.listGradeCategoryId.map((gradecategory) =>
                    ({
                      Grade: gradecategory.grade,
                      CreatedDate: moment(gradecategory.createdAt).format('DD/MM/YYYY HH:MM:SS'),
                      UpdatedDate: moment(gradecategory.updatedAt).format('DD/MM/YYYY HH:MM:SS'),
                      Edit: (<RouterButton icon='edit' value={{ basic: 'basic', href: 'grade/editGrade?' + gradecategory.id }} id={gradecategory.id} />),
                      Delete: (
                        <IconButton
                          // key={val.id}
                          aria-label='Delete'
                          value={{ basic: 'basic' }}
                          onClick={e => this.deleteHandler(gradecategory.id)}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      )
                    })) : []
                }
                tableFields={fields}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  gradeCategory: state.gradeCategory.items,
  listGradeCategoryId: state.listGradeCategoryId.items
})

const mapDispatchToProps = dispatch => ({
  loadGradeCategory: dispatch(apiActions.listGradeCategories()),
  loadGradeCategoryId: (gradecategory) => { dispatch(apiActions.listGradeCategoryId(gradecategory)) }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grade)
