import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
// import Slide from '@material-ui/core/Slide'
// import Dialog from '@material-ui/core/Dialog'
import CustomButton from './btn'
import StudentPromotions from './studentPromotions'
import { CollapsableBar } from './collapsableDiv'
import { GlobalPowerSelector, FakeSearchParam, SessionStorageHandler } from '../../ui'

// const Transition = React.forwardRef(function Transition (props, ref) {
//   return <Slide direction='up' ref={ref} {...props} />
// })

class InitiateStudentPromotions extends Component {
  constructor (props) {
    super(props)
    this.sStgePromotions = new SessionStorageHandler('promotions')
    this.sStgeFilterdata = new SessionStorageHandler('promotions-filter')
    this.sStgeAcadYear = new SessionStorageHandler('promotions-academicYear')
    this.sStgeNotStudentErps = new SessionStorageHandler('notStudentErps')

    this.state = { pageSize: 5 }
    this.dialogBox = this.dialogBox.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleFilters = this.handleFilters.bind(this)
    // this.fetchStudents = this.fetchStudents.bind(this)
    this.getSearchParams = this.getSearchParams.bind(this)
    this.pushQueryParam = this.pushQueryParam.bind(this)
    this.popQueryParam = this.popQueryParam.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
    this.removeSeletedMappings = this.removeSeletedMappings.bind(this)
    this.setFilterData = this.setFilterData.bind(this)

    let userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    let { personal_info: { role } = {} } = userProfile
    this.userRole = role
    let collabarAccessRoles = ['Admin']
    this.canAccessCallapseBar = collabarAccessRoles.includes(this.userRole)
    this.canAccessCallapseBar = true
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
  dialogBox () {
    let { open } = this.state
    let { alert } = this.props
    let propsToChild = { handleFinish: this.handleClose, handleClose: this.handleClose, alert, ...this.state }
    if (open) {
      return <StudentPromotions {...propsToChild} />
    }
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
  removeSeletedMappings (itemId, index, itemObj) {
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
    this.setFilterData(filterData)
  }
  setFilterData (filterData, academicYear) {
    this.setState({ filterData })
    this.sStgeFilterdata.set(filterData)

    // clear notStudentERPs in session storage when there is change in mappings
    this.sStgeNotStudentErps.set([])
    if (academicYear) {
      this.sStgeAcadYear.set({ academicYear })
      this.setState({ academicYear })
    }
  }
  routeToPromotedStudents = () => {
    this.props.history.push('/student/promotions/academic/view/')
  }
  render () {
    let { open } = this.state
    return <React.Fragment>
      {open
        ? this.dialogBox()
        : <React.Fragment>
          <GlobalPowerSelector
            onChangeData={this.handleFilters}
          />
          {this.canAccessCallapseBar ? <CollapsableBar title='Selected Mappings' filterData={this.state.filterData || {}} handleItemClick={this.removeSeletedMappings} /> : null}
          <div style={{ margin: 10, display: 'flex', justifyContent: 'center' }}>
            <CustomButton
              // loading={isFetchingStudents}
              // label={isFetchingStudents ? 'Fetching eligeble students....' : 'Initiate Promotion'}
              label='Initiate Promotion'
              // style={{ margin: 'auto' }}
              style={{ margin: 10 }}
              onClick={this.handleClickOpen}
            />
            <CustomButton
              label='View Promoted Students'
              style={{ margin: 10 }}
              onClick={this.routeToPromotedStudents}

            />
          </div>
        </React.Fragment>

      }
    </React.Fragment>
  }
}

export default withRouter(InitiateStudentPromotions)
