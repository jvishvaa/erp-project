import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import IconButton from '@material-ui/core/IconButton/IconButton'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { RouterButton, OmsFilterTable, Toolbar } from '../../../ui'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import { urls } from '../../../urls'

const addDesignation = {
  label: 'Add Designation',
  color: 'blue',
  href: 'designation/add',
  disabled: false
}
const designationData = {
  label: 'designation',
  namespace: 'Designation Data'
}

class Designation extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      field: [],
      click: false,
      isDelete: 'False'
    }
    this.csv = urls.DesignationExport + '?export_type=csv'
    this.excel = urls.DesignationExport + '?export_type=excel'
  }

  componentDidMount () {
    if (this.props.designations && this.props.designations.length > 0) {
      var designationList = []
      var designationTable = []

      this.props.designations.forEach(function (val, i) {
        console.log(val)
        designationList.push({
          Sr: ++i,
          DesignationName: val.designation_name,
          AddedDate: moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS')
        })
      })

      designationTable.push(
        {
          name: 'Sr',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'DesignationName',
          displayName: 'Designation Name',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'AddedDate',
          displayName: 'Added Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'Delete',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        }
      )
      this.setState({ data: designationList })
      this.setState({ field: designationTable })
    } else {
      this.props.listDesignations()
    }
  }

  componentWillReceiveProps (props) {
    console.log('will receive', props, this)
    if (props.designations && props.designations.length > 0) {
      var designationList = []
      var designationTable = []
      let deleteHandler = (id, index) => {
        console.log(id)
        var updatedList = urls.DESIGNATION + String(id) + '/'
        axios
          .delete(updatedList, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then((res) => {
            this.setState(prevState => {
              let newList = prevState.data
              delete newList[index - 1]
              return newList
            })
            this.props.alert.success('Deleted  Successfully')
          })
          .catch((error) => {
            console.log(error)
          })
      }
      props.designations.forEach(function (val, i) {
        designationList.push({
          Sr: ++i,
          DesignationName: val.designation_name,
          AddedDate: moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS'),
          delete: <IconButton
            aria-label='Delete'
            onClick={(e) => deleteHandler(val.id, i)}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        })
      })

      designationTable.push(
        {
          name: 'Sr',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'DesignationName',
          displayName: 'Designation Name',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'AddedDate',
          displayName: 'Added Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'delete',
          displayName: 'Delete',
          showButton: true,
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        }
      )
      // eslint-disable-next-line no-debugger
      // debugger

      this.setState({ data: designationList })
      this.setState({ field: designationTable })
    }
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addDesignation} />
          }>
          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
          </div>

        </Toolbar>

        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={15}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                filterTableData={designationData}
                tableData={this.state.data}
                tableFields={this.state.field}
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
  designations: state.designations.items
})

const mapDispatchToProps = dispatch => ({
  listDesignations: () => dispatch(apiActions.listDesignations())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Designation))
