import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'
import { connect } from 'react-redux'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import '../../../css/staff.css'
import { OmsSelect, RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'

const sectionTable = {
  namespace: 'Section Data'
}

const addSectionMapping = {
  label: 'Add Section mapping',
  color: 'blue',
  href: 'sectionMapping/add',
  disabled: false
}

const field = [
  {
    name: 'Sr',
    displayName: 'Sr'
  },
  {
    name: 'section_name',
    displayName: 'Section Name'
  },
  {
    name: 'created_at',
    displayName: 'Create Date'
  },
  {
    name: 'updated_at',
    displayName: 'Updated Date'
  },

  {
    name: 'Delete',
    displayName: 'Delete'
  }
]

field.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class sectionMapping extends Component {
  constructor () {
    super()
    this.state = {
      optionData: [],
      isDelete: 'False',
      tabValue: 0
    }
    this.handleBranch = this.handleBranch.bind(this)
    this.handleGrade = this.handleGrade.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.deleteAndUndeleteHandler = this.deleteAndUndeleteHandler.bind(this)
    this.showName = this.showName.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleBranch({ value: academicProfile.branch_id }) })
    }
  }

  deleteAndUndeleteHandler = (id, mode) => {
    let{ secMapId, isDelete } = this.state
    console.log(id)
    let url = ''
    // let { branchId, isDelete } = this.state
    let method = ''
    if (mode === 'Delete') {
      method = 'delete'
      url = urls.SectionMapping + id
    } else {
      method = 'put'
      url = urls.SectionMappingRestore + id + '/'
    }
    axios({
      method: method,
      url: url,
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then((res) => {
        if (method === 'delete') {
          this.props.alert.success('Deleted Successfully')
          this.props.sectionMap(secMapId)
        } else {
          this.props.alert.success('UnDeleted Successfully')
          this.props.sectionMap(secMapId, '', isDelete)
        }
      }).catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.SectionMapping)
        console.log(error)
        this.props.alert.error('Error: Something went wrong, please try again')
      })
  }

  handleBranch = (e) => {
    this.setState({ b_id: e.label, gradeValue: [], branchId: e.value })
    this.props.gradeMapBranch(e.value)
  }

  handleGrade = (e) => {
    this.setState({ secMapId: e.value })
    this.props.sectionMap(e.value)
    this.setState({ mappingId: e.value, gradeValue: e, g_id: e.label })
  }

  handleClick = (e) => {
    this.props.sections && this.props.sections.forEach((val) => {
      this.setState({ mappingId: e.value, gradeValue: e })
    })
  }

  componentWillReceiveProps (props) {
    console.log('will receive', props)
    var staffList = []
    props.sections && props.sections.forEach((val) => {
      staffList.push({
        Sr: val.section.id,
        section_name: val.section.section_name ? val.section.section_name : '',
        created_at: val.section.createdAt ? moment(val.section.createdAt).format('DD/MM/YYYY HH:MM:SS') : '',
        updated_at: val.section.updatedAt ? moment(val.section.updatedAt).format('DD/MM/YYYY HH:MM:SS') : '',
        Delete: <IconButton area-label='delete'
          onClick={e => this.deleteAndUndeleteHandler(val.id, 'Delete')} >
          <DeleteIcon fontSize='small' />
        </IconButton>,
        Restore:
  <IconButton area-label='restore' onClick={() => {
    this.deleteAndUndeleteHandler(val.id, 'Restore')
  }} >
    <RestoreFromTrashIcon fontSize='small' />
  </IconButton>
      })
    })
    this.setState({ data: staffList })
  }
  handleChangeTab (event, tab) {
    let{ secMapId } = this.state
    console.log(tab, secMapId, 'taa')
    if (tab === 0) {
      this.setState({ tabValue: tab, isDelete: 'False' })
      this.props.sectionMap(secMapId)
    } else if (tab === 1) {
      this.setState({ tabValue: tab, isDelete: 'True' })
      this.props.sectionMap(secMapId, '', 'True')
    }
  }
  showName (status) {
    let{ tabValue } = this.state

    if (status === 'columnHeader') {
      if (tabValue === 0) {
        return 'Delete'
      } else {
        return 'Restore'
      }
    } else {
      if (tabValue === 0) {
        return 'Delete'
      } else {
        return 'Restore'
      }
    }
  }

  render () {
    let { secMapId } = this.state
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <React.Fragment>
              {this.state.id &&
              <React.Fragment>
                <Button href={this.csv} target='_blank'>CSV</Button>
                <Button href={this.excel} target='_blank'>Excel</Button>
              </React.Fragment>
              }
              <RouterButton value={addSectionMapping} />
            </React.Fragment>
          } >
          <AlertMessage alertMessage={this.state.alertMessage} />

          <Grid style={{ backgroundColor: 'transparent' }}>
            <Grid.Row>
              <Grid.Column computer={5} mobile={16} tablet={6} className='student-section-inputField'>

                {this.role === 'Principal'
                  ? <input
                    label={'Branch'}
                    type='text'
                    value={this.state.branch_name}
                    disabled
                    className='form-control'
                    placeholder='Branch'
                  /> : (

                    <OmsSelect
                      label={'Branch'}
                      defaultValue={this.state.id}
                      options={
                        this.props.branches
                          ? this.props.branches.map(branch => ({
                            value: branch.id,
                            label: branch.branch_name
                          }))
                          : null
                      }
                      value={
                        this.role === 'Principal' &&
                this.state.currentPrincipalBranch
                      }
                      isDisabled={this.role === 'Principal'}

                      change={this.handleBranch}

                    />
                  )}
              </Grid.Column>

              <Grid.Column computer={5} mobile={16} tablet={6} className='student-section-inputField'>

                <OmsSelect
                  label={'Grade'}
                  defaultValue={this.state.gradeValue}
                  change={this.handleGrade}
                  options={this.props.grades ? this.props.grades.map((grades) => ({ value: grades.id, label: grades.grade.grade })) : null}
                />
              </Grid.Column>

              <Grid.Column computer={5} mobile={16} tablet={4} className='student-section-inputField-button'>
                <Button style={{ left: '500px', top: '-65px' }}color='purple' onClick={this.handleClick}>Get Section</Button>
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Toolbar>
        {(this.role === 'Admin' && secMapId) && <div className='grade_mapping'>
          <Grid >

            <Tabs value={this.state.tabValue} indicatorColor='primary' textColor='primary' onChange={this.handleChangeTab} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Tab label='ACTIVE' />
              <Tab label='DELETED' />
            </Tabs></Grid></div>}
        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={15}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                filterTableData={sectionTable}
                tableData={this.state.data}
                tableFields={[
                  {
                    name: 'section_name',
                    displayName: 'Section Name'
                  },
                  {
                    name: 'created_at',
                    displayName: 'Create Date'
                  },
                  {
                    name: 'updated_at',
                    displayName: 'Updated Date'
                  },

                  {
                    name: this.showName('columnValue'),
                    displayName: this.showName('ColumnHeader')
                  }]}
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
  branches: state.branches.items,
  grades: state.gradeMap.items,
  gradeLoader: state.gradeMap.loading,
  sections: state.sectionMap.items,
  sectionLoader: state.sectionMap.loading
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId, optional, isDelete) => dispatch(apiActions.getSectionMapping(acadMapId, '', isDelete))
})

export default connect(mapStateToProps, mapDispatchToProps)(sectionMapping)
