import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core'
// import Checkbox from '@material-ui/core/Checkbox'
// import Slide from '@material-ui/core/Slide'
// import Dialog from '@material-ui/core/Dialog'
import CustomButton from './btn'
// import StudentPromotions from './studentPromotions'
import { CollapsableBar } from './collapsableDiv'
import { urls } from '../../urls'
import { GlobalPowerSelector, FakeSearchParam, SessionStorageHandler } from '../../ui'

// const Transition = React.forwardRef(function Transition (props, ref) {
//   return <Slide direction='up' ref={ref} {...props} />
// })

const useStyles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'transparent'
  },
  title: {
    color: 'black',
    marginLeft: theme.spacing(2),
    flex: 1
  }
})
class PromotedStudents extends React.Component {
  constructor (props) {
    super(props)
    this.sStgePromotions = new SessionStorageHandler('promotions')
    this.sStgeFilterdata = new SessionStorageHandler('promotions-filter')
    this.sStgeAcadYear = new SessionStorageHandler('promotions-academicYear')
    this.sStgeNotStudentErps = new SessionStorageHandler('notStudentErps')

    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }

    this.state = {}
    this.handleClose = this.handleClose.bind(this)
    this.handleFilters = this.handleFilters.bind(this)
    this.fetchStudents = this.fetchStudents.bind(this)
    this.getSearchParams = this.getSearchParams.bind(this)
    this.pushQueryParam = this.pushQueryParam.bind(this)
    this.popQueryParam = this.popQueryParam.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.removeSeletedMappings = this.removeSeletedMappings.bind(this)
    this.setFilterData = this.setFilterData.bind(this)
    this.dialogBox = this.dialogBox.bind(this)
    this.getTitle = this.getTitle.bind(this)
    let userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    let { personal_info: { role } = {} } = userProfile
    this.userRole = role
    let collabarAccessRoles = ['Admin']
    this.canAccessCallapseBar = collabarAccessRoles.includes(this.userRole)
  }
  getSearchParams () {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
  pushQueryParam () {
    const fakeSearchParam = new FakeSearchParam().generate(10, 9)
    // let { academicYear, branchIds } = this.getSearchParams()
    this.props.history.push(`?${fakeSearchParam}&open=true&`)
  }
  popQueryParam () {
    this.props.history.push(this.props.location.pathname)
  }
  handleClickOpen () {
    this.setState({ open: true }, () => this.pushQueryParam())
    // this.setState({ open: true })
  }
  handleClose () {
    this.setState({ open: false }, () => this.popQueryParam())
    // this.setState({ open: false })
  }
  componentWillMount () {
    let { open } = this.getSearchParams()
    let filterData = this.sStgeFilterdata.get() || {}
    let { academicYear } = this.sStgeAcadYear.get() || {}
    this.setState({ open, filterData, academicYear })
  }

  handleFilters (dataObj) {
    const validateParams = (comaSprtdStr = '') => {
      return comaSprtdStr.split(',').filter(item => item !== '')
    }
    /**
    * Describes the dataObj from globalPowerSelector.
    * @typedef {Object} dataObj
    * @sample
        {
          "branch_id": "8" ,
          "acad_branch_grade_mapping_id": "1073",
          "section_mapping_id": "4959,4960",
          "academicYear": "2019-20"
        }
    */
    let { academicYear,
      branch_id: branchIds = '',
      acad_branch_grade_mapping_id: acadBranchGradeMappingIds = '',
      section_mapping_id: sectionMappingIds = ''
    } = dataObj || {}
    branchIds = validateParams(branchIds)
    acadBranchGradeMappingIds = validateParams(acadBranchGradeMappingIds)
    sectionMappingIds = validateParams(sectionMappingIds)
    let filterData = {}
    if (sectionMappingIds.length) {
      filterData = { sectionMappingIds }
    } else if (acadBranchGradeMappingIds.length) {
      filterData = { acadBranchGradeMappingIds }
    } else if (academicYear && branchIds.length) {
      filterData = { academicYear, branchIds }
    }

    /**
    * Describes the filterData .
    * @typedef {filterData} filterData
    * @sample
        {
          "sectionMappingIds": ["69193"]
        }
        or
        {
          "acadBranchGradeMappingIds": ["2445", "2494"]
        }
        or
        {
          "academicYear": "2020-21",
          "branchIds": ["8", "101"]
        }
    */
    if (Object.keys(filterData).length) {
      // this.setState({ filterData })
      // this.sStgeFilterdata.set(filterData)
      this.setFilterData(filterData, academicYear)
    }
  }
  removeSeletedMappings (itemId, index, itemObj, callBack) {
    let { filterData = {} } = this.state
    let { section, grade, id: mappingId } = itemObj
    const removeItemFromArr = (arr, item) => {
      // arr = arr.map(id => String(id))
      const index = arr.indexOf(String(item))
      let outArr = arr.filter(id => String(id) !== String(item))
      let returnObj = {
        has: !isNaN(index),
        output: outArr,
        input: arr,
        hasError: false, // or true
        message: 'success' // or failure
      }
      return returnObj
    }
    if (section) {
      // mappingId is sectionMapping id
      let { sectionMappingIds = [] } = filterData
      let { output } = removeItemFromArr(sectionMappingIds, mappingId)
      if (output.length) {
        filterData['sectionMappingIds'] = output
      } else {
        delete filterData.sectionMappingIds
      }
    } else if (grade) {
      // mappingId is acadeBranchGradeMapping id
      let { acadBranchGradeMappingIds = [] } = filterData
      let { output } = removeItemFromArr(acadBranchGradeMappingIds, mappingId)
      if (output.length) {
        filterData['acadBranchGradeMappingIds'] = output
      } else {
        delete filterData.acadBranchGradeMappingIds
      }
    } else {
      // mappingId is branch id
      let { branchIds = [] } = filterData
      let { output } = removeItemFromArr(branchIds, mappingId)
      if (output.length) {
        filterData['branchIds'] = output
      } else {
        delete filterData.branchIds
        delete filterData.academicYear
      }
    }
    // this.setState({ filterData })
    // this.sStgeFilterdata.set(filterData)
    this.setFilterData(filterData, null, callBack)
  }
  setFilterData (filterData, academicYear, callBack = () => {}) {
    this.setState({ filterData })
    this.sStgeFilterdata.set(filterData)

    // clear notStudentERPs in session storage when there is change in mappings
    this.sStgeNotStudentErps.set([])
    if (academicYear) {
      this.sStgeAcadYear.set({ academicYear })
      this.setState({ academicYear })
    }
    callBack()
  }
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')
  fetchStudents (reactTableState) {
    let { PromotedStudents } = urls
    let { filterData = {} } = this.state
    if (Object.keys(filterData).length <= 0) {
      this.props.alert.warning('Please choose Section or grade or branch')
      return
    }
    let { page: pageNumber = 0, pageSize = 5 } = reactTableState || {}
    pageNumber = Number(pageNumber) + 1// zero indexing
    // let { financiallyPromoted = true } = this.state
    let paramsObj = Object.assign({}, filterData, { pageNumber, pageSize })
    let query = this.createQuery(Object.entries(paramsObj))
    let apiURL = PromotedStudents + '?' + query
    this.setState({ isFetchingStudents: true, isFetchStudentsFailed: null })
    axios.get(apiURL, this.headers)
      .then(response => {
        // eslint-disable-next-line no-debugger
        debugger
        let { status, data = {} } = response || {}
        this.setState({ isFetchingStudents: false })
        if (status === 200) {
          let {
            promotedStudents,
            count,
            pageNumber,
            totalPages
          } = data
          pageNumber = Number(pageNumber)
          let students = promotedStudents
          // if (eligibleStudents) {
          //   students = eligibleStudents
          // } else if (ineligibleStudents) {
          //   students = ineligibleStudents
          // }
          this.setState({ students, pageSize, count, pageNumber, totalPages })
        } else {
          let { message } = data
          this.props.alert.error(`${message}`)
        }
      })
      .catch(err => {
        let { message: errorMessage, response: { data: { message: msgFromDeveloper } = {} } = {} } = err
        this.setState({ isFetchStudentsFailed: true, isFetchingStudents: false, students: undefined })
        if (msgFromDeveloper) {
          this.props.alert.error(`${msgFromDeveloper}`)
        } else if (errorMessage) {
          this.props.alert.error(`${errorMessage}`)
        } else {
          console.error('Failed to fetch students')
        }
      })
  }
  columns = [
    {
      Header: 'Sr',
      accessor: 'id',
      Cell: (row) => {
        let { pageNumber = 1, pageSize } = this.state
        return <div>{((pageNumber - 1) * pageSize) + row.index + 1}</div>
      },
      width: 60
    },
    {
      Header: 'ERP',
      accessor: 'erp',
      width: 100
    },
    {
      Header: 'Student Name',
      accessor: 'name'
      //  width: 150
    },
    {
      id: 'branch',
      Header: 'Branch',
      accessor: 'branch'
      //  width: 150
    },
    {
      id: 'from',
      Header: 'From',
      accessor: props => `${props.from_grade}-${props.from_section}`
      //  width: 150
    },
    {
      id: 'to',
      Header: 'To',
      accessor: props => `${props.to_grade}-${props.to_section}`
      //  width: 150
    },
    {
      id: 'promoted_by_name',
      Header: 'Promoted By ( Name )',
      accessor: 'promoted_by'
    },
    {
      id: 'promoted_by_role',
      Header: 'Promoted By ( Role )',
      accessor: 'role_of_promoter'
    },
    {
      id: 'promoted_time',
      Header: 'At',
      accessor: 'promoted_time'
    }
  ]
  getTitle (filterData) {
    /**
    * Describes the filterData from globalPowerSelector.
    * @typedef {Object} filterData
    * @sample
        {
          "sectionMappingIds": ["69193"]
        }
        or
        {
          "acadBranchGradeMappingIds": ["2445", "2494"]
        }
        or
        {
          "academicYear": "2020-21",
          "branchIds": ["8", "101"]
        }
    */
    const { academicYear, branchIds, acadBranchGradeMappingIds, sectionMappingIds } = filterData || {}
    let title
    if (sectionMappingIds) {
      let isPlural = sectionMappingIds.length > 1
      title = `You have selected ${sectionMappingIds.length} section${isPlural ? 's' : ''}`
    } else if (acadBranchGradeMappingIds) {
      let isPlural = acadBranchGradeMappingIds.length > 1
      title = `You have selected ${acadBranchGradeMappingIds.length} grade${isPlural ? 's' : ''}`
    } else if (academicYear && branchIds) {
      let isPlural = branchIds.length > 1
      title = `You have selected ${branchIds.length} branch${isPlural ? 'es' : ''} of Academic year ${academicYear}`
    } else {
      this.props.alert.warning('Please Choose')
      // this.props.handleClose()
      this.handleClose()
    }
    let { classes } = this.props
    return <h5 className={classes.title}>{title}</h5>
  }
  renderToolbar () {
    let { classes } = this.props
    let { filterData } = this.state
    return <AppBar className={classes.appBar}><Toolbar>
      <IconButton edge='start' color='primary' onClick={this.handleClose} aria-label='close'>
        <CloseIcon />
      </IconButton>
      {this.getTitle(filterData)}
    </Toolbar>
    </AppBar>
  }
  dialogBox () {
    let { students, isFetchingStudents, totalPages, open, count, filterData } = this.state
    // let{ totalPages, count, notStudentErps = new Map() } = this.state
    const tableContainer = { margin: 10, padding: 5, display: 'flex', justifyContent: 'space-between' }
    if (open) {
      return <React.Fragment>
        {this.renderToolbar()}
        <div style={tableContainer}>
          <div style={{ flexBasis: '20%' }}>
            <CollapsableBar
              title='Selected Mappings'
              filterData={filterData || {}}
              handleItemClick={(itemId, index, itemObj) => {
                this.removeSeletedMappings(itemId, index, itemObj, this.fetchStudents)
              }}
            // diasbleClick
            />
          </div>
          <div style={{ flexBasis: '75%' }}>
            <h4 style={{ whiteSpace: 'pre-line' }}>
              Total Students: {isFetchingStudents ? 'loading..' : count}
            </h4>
            <ReactTable
              data={students || []}
              manual
              loadingText={`Fetching Promoted Students...`}
              noDataText='No Students Found'
              onFetchData={this.fetchStudents}
              loading={isFetchingStudents}
              defaultPageSize={5}
              pages={totalPages}
              columns={this.columns}
            />
          </div>
        </div>
      </React.Fragment>
    }
  }

  render () {
    let { open } = this.state
    return <React.Fragment>
      {open ? this.dialogBox()
        : <React.Fragment>
          <GlobalPowerSelector
            onChangeData={this.handleFilters}
          />
          {
            this.canAccessCallapseBar
              ? <CollapsableBar title='Selected Mappings' filterData={this.state.filterData || {}} handleItemClick={this.removeSeletedMappings} />
              : null
          }
          <div style={{ margin: 10, display: 'flex' }}>
            <CustomButton
              label='View Promoted Students'
              style={{ margin: 'auto' }}
              // onClick={this.fetchStudents}
              onClick={this.handleClickOpen}
            />
          </div>

        </React.Fragment>
      }
    </React.Fragment>
  }
}

export default withRouter(withStyles(useStyles)(PromotedStudents))
