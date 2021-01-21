import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { Button } from '@material-ui/core/'

import { connect } from 'react-redux'
import moment from 'moment'
import ReactTable from 'react-table'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { withRouter } from 'react-router-dom'
import { RouterButton, Toolbar } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'
import { urls } from '../../../../urls'

const addSubject = {
  label: 'Add Subject',
  color: 'blue',
  href: 'subject/add',
  disabled: false
}

// const csv = {
//   label: 'CSV',
//   href: '#'
// }

// const excel = {
//   label: 'Excel',
//   href: '#'
// }

// const subjectTable = {
//   namespace: 'Subject Data'
// }

const subjectTableData = [
  {
    name: 'SubjectName',
    displayName: 'Subject Name'
  },
  {
    name: 'SubjectDescription',
    displayName: 'Subject Description'
  },
  {
    name: 'Optional',
    displayName: 'Optional'
  },
  {
    name: 'CreatedAt',
    displayName: 'Created At'
  },
  {
    name: 'UpdatedAt',
    displayName: 'Updated At'
  },
  {
    name: 'Edit',
    displayName: 'Edit'
  },
  {
    name: 'Delete',
    displayName: 'Delete'
  }
]

subjectTableData.forEach((obj) => {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class Subject extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      click: false
    }
    this.csv = urls.SubjectExport + '?export_type=csv'
    this.excel = urls.SubjectExport + '?export_type=excel'
    this.deleteHandler = this.deleteHandler.bind(this)
  }

  deleteHandler = id => {
    var updatedList = urls.SUBJECT + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.props.alert.success('Deleted Successfully')
      })

      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GRADE, error)
        this.props.alert.error('Error: Something went wrong, please try again.')
      })
  };

  componentDidMount () {
    if (this.props.subjects && this.props.subjects.length > 0) {
      var subjectList = []
      this.props.subjects.forEach((val) => {
        subjectList.push({
          SubjectName: val.subject_name ? val.subject_name : '',
          SubjectDescription: val.subject_description
            ? val.subject_description
            : '',
          Optional: val.is_optional ? 'YES' : 'NO',
          CreatedAt: val.createdAt
            ? moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS')
            : '',
          UpdatedAt: val.updatedAt
            ? moment(val.updatedAt).format('DD/MM/YYYY HH:MM:SS')
            : '',
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/subject/editSubject?' + val.id
              }}
              id={val.id}
            />
          ),
          Delete: (
            <Button
              icon='delete'
              basic
              onClick={e => this.deleteHandler(val.id)}
            />
          )
        })
      })
      this.setState({ data: subjectList })
    } else {
      this.props.listSubject()
    }
  }

  componentWillReceiveProps (props) {
    var subjectList = []
    if (props.subjects && props.subjects.length > 0) {
      props.subjects.forEach((val) => {
        subjectList.push({
          SubjectName: val.subject_name ? val.subject_name : '',
          SubjectDescription: val.subject_description
            ? val.subject_description
            : '',
          Optional: val.is_optional ? 'YES' : 'NO',
          CreatedAt: val.createdAt
            ? moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS')
            : '',
          UpdatedAt: val.updatedAt
            ? moment(val.updatedAt).format('DD/MM/YYYY HH:MM:SS')
            : '',
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/subject/editSubject?' + val.id
              }}
              id={val.id}
            />
          ),
          Delete: (
            <Button
              icon='delete'
              basic
              onClick={e => this.deleteHandler(val.id)}
            />
          )
        })
      })
      this.setState({ data: subjectList })
    }
  }

  render () {
    console.log(this.props.subjects, 'sub')
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addSubject} />
          } >

          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
          </div>

        </Toolbar >
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={12}
              tablet={15}
              className='staff-table1'
            >
              <ReactTable
                data={this.props.subjects}
                showPageSizeOptions={false}
                defaultPageSize={5}

                columns={[
                  {

                    Header: 'Subject Name',
                    accessor: 'subject_name',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
                    filterable: true

                  },

                  {
                    Header: 'Subject Description',
                    accessor: 'subject_description',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
                    filterable: true

                  },
                  {
                    Header: 'Optional',
                    accessor: 'is_optional',
                    Cell: props => <span className='number'>{props.value ? 'True' : 'False'}</span>,
                    filterable: true

                  },
                  {
                    Header: 'Created At',
                    accessor: 'createdAt',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
                    filterable: true

                  },
                  {
                    Header: 'Updated At',
                    accessor: 'updatedAt',
                    Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
                    filterable: true

                  },
                  {
                    id: 'x',
                    Header: 'Actions',
                    accessor: val => {
                      return (
                        <div>
                          <RouterButton
                            key={val.id}
                            icon='edit'
                            value={{
                              basic: 'basic',
                              href: '/subject/editSubject?' + val.id
                            }}
                            id={val.id}
                          />

                          {/* <Button
                            // key={val.id}
                            icon='delete'

                            onClick={e => this.deleteHandler(val.id)}
                          /> */}
                          <IconButton
                            aria-label='Delete'
                            onClick={e => this.deleteHandler(val.id)}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>

                        </div>
                      )
                    }

                  }

                ]}

              />
              {/* <OmsFilterTable
                filterTableData={subjectTable}
                tableData={this.state.data}
                tableFields={subjectTableData}
              /> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listSubject: () => dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Subject))
