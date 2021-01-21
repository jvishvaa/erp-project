import React, { Component } from 'react'
import axios from 'axios'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { apiActions } from '../../../../_actions'
import AuthService from '../../../AuthService'
import { urls } from '../../../../urls'
import '../../../css/staff.css'
import { RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../../ui'

const addSection = {
  label: 'Add Section',
  color: 'blue',
  href: 'section/add',
  disabled: false
}

const sectionData = {
  label: 'section',
  namespace: 'Section Data'
}

class Section extends Component {
  constructor () {
    super()
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      data: [],
      field: [],
      click: false
    }
    this.csv = urls.SectionExport + '?export_type=csv'
    this.excel = urls.SectionExport + '?export_type=excel'
    this.deleteHandler = this.deleteHandler.bind(this)
  }

  componentDidMount () {
    if (this.props.sections && this.props.sections.length > 0) {
      var sectionList = []
      var sectionTable = []
      var that = this
      this.props.sections.forEach(function (val) {
        sectionList.push({
          SectionId: val.id,
          SectionName: val.section_name,
          AddedDate: moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS'),
          UpdatedDate: moment(val.updatedAt).format('DD/MM/YYYY HH:MM:SS'),
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/section/editSection?' + val.id
              }}
              id={val.id}
            />
          ),
          Delete: (
            <Button
              icon='delete'
              basic
              onClick={e => that.deleteHandler(val.id)}
            />
          )
        })
      })
      sectionTable.push(
        {
          name: 'SectionId',
          displayName: 'Section Id',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'SectionName',
          displayName: 'Section Name',
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
      )
      this.setState({ data: sectionList })
      this.setState({ field: sectionTable })
    } else {
      this.props.listSections()
    }
  }

  deleteHandler = id => {
    console.log(id)
    var sectionList = urls.SECTION + id + '/'
    var object = { is_delete: true }
    axios
      .put(sectionList, object, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        //  alert("Section Deleted Successfully");
        this.setState({
          alertMessage: {
            messageText: 'Section Deleted Successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.SECTION, error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  };

  componentWillReceiveProps (props) {
    console.log('will receive', props)
    if (props.sections && props.sections.length > 0) {
      var sectionList = []
      var sectionTable = []
      var that = this
      props.sections.forEach(function (val) {
        sectionList.push({
          SectionId: val.id,
          SectionName: val.section_name,
          AddedDate: moment(val.createdAt).format('DD/MM/YYYY HH:MM:SS'),
          UpdatedDate: moment(val.updatedAt).format('DD/MM/YYYY HH:MM:SS'),
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/section/editSection?' + val.id
              }}
              id={val.id}
            />
          ),
          Delete: (
            <IconButton
              area-label='Delete'
              onClick={e => that.deleteHandler(val.id)}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
      })
      sectionTable.push(
        {
          name: 'SectionId',
          displayName: 'Section Id',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'SectionName',
          displayName: 'Section Name',
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
      )
      this.setState({ data: sectionList })
      this.setState({ field: sectionTable })
    }
    console.log('sestionlist', sectionList)
  }
  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addSection} />
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
              mobile={15}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                filterTableData={sectionData}
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
  sections: state.sections.items
})

const mapDispatchToProps = dispatch => ({
  listSections: () => dispatch(apiActions.listSections())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Section))
