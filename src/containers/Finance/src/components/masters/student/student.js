import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Restore from '@material-ui/icons/Restore'
// import CloseButton from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
// import Chip from '@material-ui/core/Chip'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
// import Snackbar from '@material-ui/core/Snackbar'
// import Card from '@material-ui/core/Card'
// import { CardHeader, CardContent } from '@material-ui/core'
import { ListItem, ListItemText, Paper, Collapse } from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton/IconButton'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import SearchIcon from '@material-ui/icons/Search'
import Switch from '@material-ui/core/Switch'
import SwapHorizontalIcon from '@material-ui/icons/SwapHorizOutlined'
import { fade } from '@material-ui/core/styles/colorManipulator'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import InputBase from '@material-ui/core/InputBase'
import { throttle, debounce } from 'throttle-debounce'
import '../../css/staff.css'
import { OmsSelect, RouterButton, Toolbar } from '../../../ui'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import Checkbox from '../../questbox/Checkbox/Checkbox'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../../_components/globalselector'
import RelationshipManager from './relationshipManager'

const StudentActions = {
  label: 'Student Actions',
  color: 'blue',
  href: '/student/studentActions',
  disable: false
}

const addStudentExcel = {
  label: 'Add Student Excel',
  color: 'blue',
  // href: '/student/addExcel',
  href: '/student/upload',
  disabled: false
}
// this.props.history.push(`/student/profiles/upload/${studentId}/`)
const studentProfilesRouteBtn = {
  label: 'Student Profile Images',
  color: 'blue',
  href: '/student/profiles/',
  disabled: false
}
const rshipManagerAccessRoles = ['Admin', 'Principal', 'FOE']
const stPfleAccessRoles = ['Admin', 'Principal', 'AcademicCoordinator', 'BDM', 'FOE', 'Teacher', 'CFO']
const field = [
  {
    name: 'srNumber',
    displayName: 'Sr.'
  }, {
    name: 'name',
    displayName: 'Student Name'
  }, {
    name: 'branch',
    displayName: 'Branch'
  }, {
    name: 'enrollmentCode',
    displayName: 'Enrollment Code'
  }, {
    name: 'admissionNo',
    displayName: 'Admission Number'
  }, {
    name: 'grNumber',
    displayName: 'GR Number'
  }, {
    name: 'doa',
    displayName: 'Date of Admission'
  }, {
    name: 'dob',
    displayName: 'Date of Birth'
  }, {
    name: 'gender',
    displayName: 'Gender'
  }, {
    name: 'rollNo',
    displayName: 'Roll Number'
  }, {
    name: 'aadharNo',
    displayName: 'Aadhar Number'
  }, {
    name: 'classGroup',
    displayName: 'Class Group'
  }, {
    name: 'sectionName',
    displayName: 'Section Name'
  }, {
    name: 'address',
    displayName: 'Address'
  }, {
    name: 'fatherName',
    displayName: 'Father Name'
  }, {
    name: 'fatherMobile',
    displayName: 'Father Mobile'
  }, {
    name: 'fatherEmail',
    displayName: 'Father Email'
  }, {
    name: 'motherName',
    displayName: 'Mother Name'
  }, {
    name: 'motherMobile',
    displayName: 'Mother Mobile'
  }, {
    name: 'motherEmail',
    displayName: 'Mother Email'
  }, {
    name: 'usingTransport',
    displayName: 'Using Transport'
  }, {
    name: 'category',
    displayName: 'Category'
  }, {
    name: 'lang1',
    displayName: 'Language 1'
  }, {
    name: 'lang2',
    displayName: 'Language 2'
  }, {
    name: 'lang3',
    displayName: 'Language 3'
  }, {
    name: 'lang4',
    displayName: 'Language 4'
  }, {
    name: 'addedDate',
    displayName: 'Added Date'
  }, {
    name: 'updatedDate',
    displayName: 'Updated Date'
  }, {
    name: 'loginAs',
    displayName: 'Login As'
  }, {
    name: 'edit',
    displayName: 'Edit'
  }, {
    name: 'Delete',
    displayName: 'Delete'
  }
]

field.forEach(function (obj) {
  obj.inputFilterable = true
  obj.exactFilterable = true
  obj.sortable = true
})

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    alignItems: 'center'
  },
  column: {
    flexBasis: '20%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
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
    flexGrow: 1.5
  },
  grow1: {
    flexGrow: 0
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
const options = [
  'Select Colors',
  'Red',
  'Orange',
  'Blue'
]
class Student extends Component {
  constructor (props) {
    super(props)
    this.state = {
      aInactiveStudent: [],
      page: 1,
      rowsPerPage: 5,
      sectionData: null,
      sections: [],
      checkedA: true,
      checkedB: false,
      currentlySelected: {},
      openRemarksData: false,
      selectedIndex: 0,
      anchorEl: null,
      changeStats: null,
      academicYear: null,
      csv: {
        label: 'CSV'
      },
      excel: {
        label: 'Excel'
      },
      Tabvalue: 0,
      setvalue: 2,
      pageSize: 10,
      status: 'True',
      dummyState: true,
      isActive: 'True',
      isDelete: 'False',
      loading: false,
      radioBranchValue: null,
      radioStatusValue: null,
      checkedIndex: 0,
      filterGrades: [],
      filterSections: [],
      excelColumns: null,
      filterColumns: [],
      opener: false,
      opened: false,
      checkedShuffedata: [],
      checkedStatusdata: [],
      is_approved: false,
      status_value: false,
      datacheck: [],
      openModal: false,
      NeedsApprovalStatus: [],
      NeedsApprovalShuffle: [],
      tabValue: 0,
      openMessage: false,
      showDeleteAction: false,
      date: null,
      year: null,
      userAcadYear: null,
      userProfile: JSON.parse(localStorage.getItem('user_profile')),
      studentData: [],
      tabChangeLoading: false

    }

    this.handleClickGetStudentData = this.handleClickGetStudentData.bind(this)
    this.handleClickBranch = this.handleClickBranch.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickSection = this.handleClickSection.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.renderSwitch = this.renderSwitch.bind(this)
    this.renderSectionShuffle = this.renderSectionShuffle.bind(this)
    this.getStatusState = this.getStatusState.bind(this)
    this.getShuffleState = this.getShuffleState.bind(this)
    this.displayState = this.displayState.bind(this)
    this.displayShuffle = this.displayShuffle.bind(this)
    this.subComponent = this.subComponent.bind(this)
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
    this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch)
    this.getIndii = this.getIndii.bind(this)
    this.onChange = this.onChange.bind(this)
    this.DeleteSwitch = this.DeleteSwitch.bind(this)
    this.handleDeleteSwitch = this.handleDeleteSwitch.bind(this)
    this.ShowColumn = this.ShowColumn.bind(this)
    this.Action = this.Action.bind(this)
    this.getRemarkData = this.getRemarkData.bind(this)
    this.getFilterContent = this.getFilterContent.bind(this)
    this.getRadioBranches = this.getRadioBranches.bind(this)
    this.handleBranchRadioChange = this.handleBranchRadioChange.bind(this)
    this.handleStatusRadioChange = this.handleStatusRadioChange.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.getColumns = this.getColumns.bind(this)
    this.ExcelDownloadHandler = this.ExcelDownloadHandler.bind(this)
    this.delayedCallback = _.debounce((value) => {
      this.getStudentData(value)
    }, 2000)
  }

  componentDidMount () {
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    this.setState({ date: date })
    console.log(this.props.student.success)
    this.props.listBranches()
    this.props.listSections()
    this.user_id = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    const academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile

    if (this.role === 'Principal' || this.role === 'FOE' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') {
      this.setState({
        branchId: academicProfile.branch_id,
        branch_name: academicProfile.branch,
        id: {
          value: academicProfile.branch_id,
          label: academicProfile.branch
        }
      }, () => { this.handleClickBranch({ value: academicProfile.branch_id }) })
    } else if (this.role === 'BDM') {
      const branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
      const branchData = []
      const map = new Map()
      for (const item of branchsAssigned) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true)
          branchData.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }
      this.setState({ branchData })
    }

    axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res)
      let{ acad_session: academicyear } = res.data
      this.setState({ academicYear: academicyear })
    }).catch(err => {
      console.log(err)
    })
  }

  downloadHandler = (id) => {
    let url = ''
    url = urls.IdCard + '?student_ids=' + JSON.stringify([id]) + '&parent_id=' + 4
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        },
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'IDCard.pdf') // or any other extension
        document.body.appendChild(link)
        link.click()
      })
  }

  ExcelDownloadHandler () {
    if (this.state.filterSections.length !== 0) {
      let url = urls.ExcelColumns + '?acad_branch_grade_mapping_id=' + this.state.filterGrades.toString() + '&sections=' + this.state.filterSections.toString()
      if (this.state.radioStatusValue === 'active') {
        url = url + '&is_active=True'
      } else if (this.state.radioStatusValue === 'inactive') {
        url = url + '&is_active=False'
      }

      if (this.state.filterColumns.length !== 0) {
        const filter = this.state.filterColumns.toString()
        url = url + '&filter=' + filter
      }
      window.open(url)
    } else if (this.state.filterGrades.length !== 0) {
      let url = urls.ExcelColumns + '?acad_branch_grade_mapping_id=' + this.state.filterGrades.toString()
      if (this.state.radioStatusValue === 'active') {
        url = url + '&is_active=True'
      } else if (this.state.radioStatusValue === 'inactive') {
        url = url + '&is_active=False'
      }
      if (this.state.filterColumns.length !== 0) {
        const filter = this.state.filterColumns.toString()
        url = url + '&filter=' + filter
      }
      window.open(url)
    } else if (this.state.radioBranchValue.length !== 0) {
      axios
        .get(urls.ExcelColumns + '?branch_id=' + this.state.radioBranchValue,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
        .then(res => window.open(res.data))
    }
  }

    deleteHandler = (id) => {
      var updatedList = urls.Student + id + '/'
      axios
        .delete(updatedList, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then((res) => {
          this.props.alert.success('Deleted Student Successfully')
          this.handleClickGetStudentData()
        })
        .catch(function (error) {
          console.log("Error: Couldn't fetch data from " + urls.Student, error)
        })
    }

    fetchData (state, instance) {
      const { sectionId, status, isDelete, currentPage } = this.state
      let pageSize = 10
      this.setState({ currentPage: Number(this.state.page) }, () => {
        if (sectionId) {
          if (isDelete === 'False') {
            this.props.listStudentsV2(sectionId, status, currentPage && state.page ? state.page + 1 : 1, false, pageSize)
          } else {
            this.props.listStudentsV2(sectionId, status, currentPage && state.page ? state.page + 1 : 1, true, pageSize)
          }
        }
      })
    }

    handleClickBranch = (event) => {
      this.setState({ branchId: event.value, gradeValue: [], valueSection: [], gradeId: null, value: 0, status: 'True' })
      this.props.gradeMapBranch(event.value)
    }

    handleClickGrade = (event) => {
      this.setState({ value: 0, status: 'True' })
      this.setState({ gradeId: event.value, valueSection: [], sectionId: null, acadBranchGradeMappingId: event.value })
      const acadBranchGradeMappingId = event.value
      axios
        .get(urls.SectionMapping + '?acad_branch_grade_mapping_id=' + acadBranchGradeMappingId, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then((res) => {
          this.setState({ sectionData: res.data, gradeValue: event, valueSection: [] })
        })
    }

   handlechange=(e) => {
     this.setState({ searchvalue: e.target.value })
   }

    handleClickSection = (event) => {
      this.setState({ Tabvalue: 0, status: 'True' })
      this.setState({ sectionId: event.value, valueSection: event }, e => this.handleClickGetStudentData())
    }

    handleClickGetStudentData = (event, page = 1, pageSize = 10) => {
      const { gradeId, branchId, sectionId } = this.state
      if (!branchId) {
        this.props.alert.warning('Select Branch')
        return
      }
      if (!gradeId) {
        this.props.alert.warning('Select Grade')
        return
      }
      if (!sectionId) {
        this.props.alert.warning('Select section')
        return
      }

      if (sectionId) {
        this.setState({
          searchLength: 0,
          searchValue: '',
          currentPage: 0,
          pageNumber: 0,
          Tabvalue: 0,
          status: 'True',
          isDelete: 'False',
          isActive: 'True',
          csv: { href: urls.StudentExport + '?acadsectionmapping=' + sectionId + '&export_type=csv' + '&student_type=active', label: 'CSV' },
          excel: { href: urls.StudentExport + '?acadsectionmapping=' + sectionId + '&export_type=excel' + '&student_type=active', label: 'Excel' }
        }, () => this.getStudentData(null, 0)
        )
      }
    }

    returnSubject = (id) => {
      let x = ' '
      this.props.subjects.forEach((v) => {
        if (v.id === id) {
          x = v.subject_name
        }
      })
      return x
    }

    returnBranch = (id) => {
      let x = ' '
      this.props.branches.forEach((v) => {
        if (v.id === id) {
          x = v.branch_name
        }
      })

      return x
    }

    returnSection =(id) => {
      let x = ' '
      this.state.sectionData.forEach((v) => {
        if (v.section_id === id) {
          x = v.section_name
        }
      })
      return x
    }

    getIndii =(Stud) => {
      var dat = this.state.studentData && this.state.studentData.results
      if (dat.length > 1) {
        for (var i = 0; i < dat.length; i++) {
          if (this.state.studentData.results[i].id === Stud) {
            return i
          } else {
            console.log('element not found')
          }
        }
      } else {
        return 0
      }
    }

    returnAcadSessionYear = (branchId) => {
      console.log(branchId, 'check')
      axios.get(`${urls.BranchAcadSession + '?branchId=' + branchId}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((res) => {
        if (res.status === 200) {
          this.setState({ year: res.data }, () => {
            console.log(this.state.year, res, 'enterufnakjgndsjg')
          })
        }
      }).catch(error => {
        let { response: { data: { status } = {} } = {} } = error
        this.props.alert.error(status)
        // }
      })
    }

    handleUserAcadSession = (userId) => {
      console.log(userId, 'userud check')
      // let userID = this.props.user.user_id
      let acadUrl = urls.ACADSESSION + '?user_id=' + userId
      axios.get(acadUrl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          this.setState({ userAcadYear: res.data.acad_session }, () => {
            console.log(this.state.userAcadYear, 'useracd')
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
    handleChangeSwitch (event, v, val, props) {
      if (this.role === 'Teacher') {
        this.getStatusState(!props.flag, props.is_active)
        this.displayState(!props.flag, props.is_active)
      }

      var data = { student_id: val, stu_status: v }
      axios
        .post(urls.ConvertStudentStatus, data, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then((res) => {
          if (res.status === 200) {
            const msg = v ? 'Activated' : 'Inactivated'

            if (this.role === 'Teacher') {
              this.props.alert.success(res.data.status)
              this.handleClickGetStudentData()
            } else {
              this.props.alert.success(msg + ' student successfully')
              const { dummyState } = this.state
              var ind = this.getIndii(val)
              this.state.studentData && this.state.studentData.results.splice(ind, 1)
              this.setState({ dummyState: !dummyState })
            }
          }
        })
        .catch(error => {
          if (this.role === 'Teacher') {
            let { response: { data: { status } = {} } = {} } = error
            this.props.alert.error(status)
          }
        })
    }
    getStudentData (searchvalue, pageNo, sectionMapId) {
      const { isActive, isDelete, selectorData, pageSize, status, academicYear } = this.state
      if (searchvalue && selectorData && Object.keys(selectorData).length > 0) {
        this.setState({ tabChangeLoading: true })
        this.props.listStudentSearch('Student', searchvalue, sectionMapId || this.state.selectorData.section_mapping_id, (Number(pageNo || 0) + 1), isActive, isDelete)
          .then(({ payload }) => {
            if (!(Array.isArray(payload))) {
              this.setState({ totalPages: 1 })
            }
            this.setState({ studentData: payload, tabChangeLoading: false, totalPages: payload.total_pages, currentPage: Number(payload.current_page) - 1, pageSize: payload.page_size })
          }).catch(err => {
            console.log(err)
          })
      } else if (!searchvalue && selectorData && Object.keys(selectorData).length > 0) {
        this.setState({ tabChangeLoading: true })
        this.props.listStudentsV2(sectionMapId || this.state.selectorData.section_mapping_id, status, (Number(pageNo || 0) + 1), isDelete, pageSize, academicYear)
          .then(({ payload }) => {
            if (!(Array.isArray(payload))) {
              this.setState({ totalPages: 1 })
            }
            this.setState({ studentData: { ...payload, results: payload.result }, tabChangeLoading: false, totalPages: payload.total_pages, currentPage: Number(payload.current_page) - 1, pageSize: payload.page_size })
          }).catch(({ error }) => {
            console.log(error)
          })
      }
    }

   subComponent = (properties) => {
     const { original } = properties
     const row = original
     return <Grid container style={{ flexDirection: 'row', width: 1500, paddingRight: 50 }}>

       <Grid item>
         <Grid container style={{ flexDirection: 'column', paddingLeft: 100 }}>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Student Name :</Grid></th>
               <Grid item>{row.name ? row.name : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Date of Admission :</Grid></th>
               <Grid item>{row.admission_number ? row.admission_number : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Gr Number:</Grid></th>
               <Grid item>{row.gr_number ? row.gr_number : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Date Of Birth :</Grid></th>
               <Grid item>{row.date_of_birth ? row.date_of_birth : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Gender :</Grid></th>
               <Grid item>{row.gender ? row.gender : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Aadhar Number :</Grid></th>
               <Grid item>{row.aadhar_number ? row.aadhar_number : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Section Name :</Grid></th>
               <Grid item>{row.section ? this.returnSection(row.section) : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th> <Grid style={{ paddingRight: 8 }} item>Address :</Grid></th>
               <Grid item>{row.address ? row.address : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th> <Grid style={{ paddingRight: 8 }} item>Father Name  :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.father_name ? row.parent_fk.father_name : 'NIL'}</Grid>
             </Grid>
           </Grid>

           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Father Mobile  :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.father_mobile ? row.parent_fk.father_mobile : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Father Email :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.father_email ? row.parent_fk.father_email : 'NIL'}</Grid>
             </Grid>
           </Grid>
         </Grid>
       </Grid>
       <Grid item>
         <Grid container style={{ flexDirection: 'column', paddingLeft: 100 }}>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Enrollment Code :</Grid></th>
               <Grid item>{row.erp ? row.erp : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Mother Name :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.mother_name ? row.parent_fk.mother_name : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Mother Email :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.mother_email ? row.parent_fk.mother_email : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Mother Mobile :</Grid></th>
               <Grid item>{row.parent_fk && row.parent_fk.mother_mobile ? row.parent_fk.mother_mobile : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Using Transport:</Grid></th>
               <Grid item>{row.transport ? 'True' : 'False'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Category:</Grid></th>
               <Grid item>{row.stay_category ? row.stay_category : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Language 1:</Grid></th>
               <Grid item>{row.first_lang ? this.returnSubject(row.first_lang) : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Language 2:</Grid></th>
               <Grid item>{row.second_lang ? this.returnSubject(row.second_lang) : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Language 3:</Grid></th>
               <Grid item>{row.third_lang ? this.returnSubject(row.third_lang) : 'NIL'}</Grid>
             </Grid>
           </Grid>
           <Grid item>
             <Grid container style={{ flexDirection: 'row', paddingBottom: 8 }}>
               <th><Grid style={{ paddingRight: 8 }} item>Language 4:</Grid></th>
               <Grid item>{row.fourth_lang ? this.returnSubject(row.fourth_lang) : 'NIL'}</Grid>
             </Grid>
           </Grid>

         </Grid>
       </Grid>

     </Grid>

     //  </Grid>
   }

   handleSearch = (e) => {
     e.persist()
     if (!(this.state.selectorData && this.state.selectorData.section_mapping_id)) {
       this.setState({ tabChangeLoading: false })
     } else {
       this.setState({ currentPage: 0, searchLength: e.target.value.length, searchValue: e.target.value, tabChangeLoading: true, pageNumber: 0 })
     }
     this.delayedCallback(e.target.value)
   }

   switchUser = (userId) => {
     axios.post(urls.LOGIN, {
       user_id: userId
     }, {
       headers: {
         Authorization: 'Bearer ' + this.props.user
       }
     }).then(res => {
       localStorage.setItem('user_profile', JSON.stringify(res.data))
       localStorage.setItem('id_token', res.data.personal_info.token)
       window.location.assign('/')
     })
   }

   changeQuery = event => {
     this.setState({ q: event.target.value }, () => {
       const q = this.state.q
       if (q.length < 5) {
         this.autocompleteSearchThrottled(this.state.q)
       } else {
         this.autocompleteSearchDebounced(this.state.q)
       }
     })
   };

   autocompleteSearch = (q) => {
     this.props.listStudentSearch(this.state.selectorData.section_mapping_id.value, q)
   }

   getisActiveDeteteStatus=(mode, tab, selectorData) => {
     if (tab === 0) {
       this.setState({ csv: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=csv' + '&student_type=active', label: 'CSV' }, excel: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=excel' + '&student_type=active', label: 'Excel' } })
       if (mode === 'isDelete') {
         return 'False'
       } else if (mode === 'isActive') {
         return 'True'
       } else {
         return 'True'
       }
     } else if (tab === 1) {
       this.setState({ csv: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=csv' + '&student_type=inactive', label: 'CSV' }, excel: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=excel' + '&student_type=inactive', label: 'Excel' } })
       if (mode === 'isDelete') {
         return 'False'
       } else if (mode === 'isActive') {
         return 'False'
       } else {
         return 'False'
       }
     } else {
       this.setState({ csv: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=csv' + '&student_type=deleted', label: 'CSV' }, excel: { href: urls.StudentExport + '?acadsectionmapping=' + selectorData.section_mapping_id + '&export_type=excel' + '&student_type=deleted', label: 'Excel' } })
       if (mode === 'isDelete') {
         return 'True'
       } else {
         return 'False'
       }
     }
   }

   handleChangeTab = (event, tabVal) => {
     const { selectorData } = this.state

     if (selectorData.section_mapping_id) {
       this.setState({
         Tabvalue: tabVal,
         isTabClicked: true,
         tabChangeLoading: true,
         searchValue: '',
         isDelete: this.getisActiveDeteteStatus('isDelete', tabVal, selectorData),
         isActive: this.getisActiveDeteteStatus('isActive', tabVal, selectorData),
         status: this.getisActiveDeteteStatus('Status', tabVal, selectorData),
         currentPage: 0,
         pageNumber: 0
       }, () => this.getStudentData(null, 0))
     } else {
       console.log('no data')
     }
   }

   handleShuffleSection = (event, props) => {
     if (this.role === 'Teacher') {
       this.getShuffleState('shuffle', props.is_shuffle, !props.is_active)
       this.displayShuffle('shuffle', props.is_shuffle, !props.is_active)
     }
     if (event.value) {
       const { id } = props
       axios.post(urls.SECTIONSHUFFLE, {
         student_id: id,
         branch_grade_mapping_id: this.state.acadBranchGradeMappingId,
         section_mapping_id: event.value
       }, {
         headers: {
           Authorization: 'Bearer ' + this.props.user
         }
       })
         .then(res => {
           console.log(res)

           if (this.role === 'Teacher') {
             this.props.alert.success(res.data.status)
           }
           this.handleClickGetStudentData()
         })
         .catch(err => {
           console.log(err)

           if (this.role === 'Teacher') {
             let { response: { data: { status } = {} } = {} } = err
             this.props.alert.error(status)
           }
         })
     }
   }

   getColumns () {
     axios.get(urls.ExcelColumns, {
       headers: {
         Authorization: 'Bearer ' + this.props.user
       }
     }).then(res => {
       this.setState({ excelColumns: ['All'].concat(res.data) }, console.warn(this.state.excelColumns))
     }).catch(err => {
       console.log(err)
     })
   }

   getSections () {
     const sectionsArr = []
     this.state.sectionData.map(section => {
       if (this.state.valueSection.label !== section.section.section_name) {
         sectionsArr.push({
           value: section.id,
           label: section.section.section_name
         })
       } else {
         return []
       }
     })
     return sectionsArr
   }

   restoreUser = (userId) => {
     axios.post(`${urls.StaffV2}restore_user/`, {
       user_id: userId
     }, {
       headers: {
         Authorization: 'Bearer ' + this.props.user
       }
     }).then(res => {
       console.log(res)
       this.props.alert.success(res.data.response)
       this.setState({ loading: false }, () => { this.handleClickGetStudentData() })
     })
       .catch(err => {
         console.log(err)
       })
   }

   onChange (data, fetchData) {
     const { selectorData } = this.state
     this.setState({
       csv: { href: urls.StudentExport + '?acadsectionmapping=' + data.section_mapping_id + '&export_type=csv' + '&student_type=active', label: 'CSV' },
       excel: { href: urls.StudentExport + '?acadsectionmapping=' + data.section_mapping_id + '&export_type=excel' + '&student_type=active', label: 'Excel' },
       searchLength: 0,
       searchValue: '',
       selectorData: data,
       branchId: data.branch_id,
       gradeId: data.grade_id,
       sectionId: data.section_mapping_id,
       sectionData: fetchData[2],
       pageNumber: 0,
       Tabvalue: 0,
       currentPage: 0,
       status: 'True',
       isDelete: 'False',
       isActive: 'True'
     })
     if (data.branch_id) {
       this.returnAcadSessionYear(data.branch_id)
       this.handleUserAcadSession(this.user_id)
     }
     if (selectorData && data && data.section_mapping_id && data.section_mapping_id !== selectorData.section_mapping_id) {
       this.getStudentData(null, 0, data.section_mapping_id)
     }
   }

   handleChange = name => event => {
     this.setState({ [name]: event.target.value })
   };

   getRemarkData () {
     const { currentlySelected, selectedIndex } = this.state

     const obj = {
       name: currentlySelected.name,
       erp: currentlySelected.erp,
       color: options[selectedIndex],
       remark: this.state.name

     }

     axios
       .post(urls.StudentDiscipline, JSON.stringify(obj), {
         headers: {
           Authorization: 'Bearer ' + this.props.user,
           'Content-Type': 'application/json'
         }
       })
       .then(res => {
         if (String(res.status).startsWith(String(2))) {
           this.props.alert.success('Successfully Updated')
           this.setState((prevState) => {
             const newState = prevState
             const remarkData = this.state.studentData && this.state.studentData.results
             remarkData[prevState.currentlySelectedIndex] = {
               ...remarkData[prevState.currentlySelectedIndex],
               name: currentlySelected.name,
               erp: currentlySelected.erp
               //  color: currentlySelected.options

             }
             newState.remarkData = remarkData
             return newState
           })
           this.setState({ changeStats: false, name: '', selectedIndex: 0 })
         } else if (String(res.status).startsWith(String(4))) {
           this.props.alert.error('Remark String Length is too long')
         }
       })
       .catch(error => {
         this.props.alert.error('Error occured')
         console.log(error)
       })
   }

   handleCheckbox = (e, i) => {
     let { filterGrades, filterSections, filterColumns } = this.state
     if (i.name === 'Grade') {
       if (i.checked) {
         if (filterGrades.includes(String(i.value)) === false) {
           filterGrades.push(`${i.value}`)
         }
       } else {
         if (filterGrades.includes(String(i.value)) === true) {
           const index = filterGrades.indexOf(String(i.value))
           filterGrades.splice(index, 1)
         }
       }
       this.setState({ filterGrades })
     } else if (i.name === 'Section') {
       if (i.checked) {
         if (filterSections.includes(String(i.value)) === false) {
           filterSections.push(`${i.value}`)
         }
       } else {
         if (filterSections.includes(String(i.value)) === true) {
           const index = filterSections.indexOf(String(i.value))
           filterSections.splice(index, 1)
         }
       }
       this.setState({ filterSections })
     } else if (i.name === 'Select Columns') {
       if (i.checked) {
         if (i.value === 'All') {
           filterColumns = filterColumns.concat(this.state.excelColumns)
         } else if (filterColumns.includes(String(i.value)) === false) {
           filterColumns.push(`${i.value}`)
         }
       } else {
         if (i.value === 'All') {
           filterColumns = []
         }
         if (filterColumns.includes(String(i.value)) === true) {
           const index = filterColumns.indexOf(String(i.value))
           filterColumns.splice(index, 1)
         }
       }
       this.setState({ filterColumns })
     }
   }

   handleClickOpen = (id) => {
     let currentlySelectedIndex
     const currentlySelected = this.state.studentData && this.state.studentData.results.filter((student, index) => {
       if (student.id === id) {
         currentlySelectedIndex = index
         return true
       } else {
         return false
       }
     })[0]
     this.setState({ openRemarksData: true, currentlySelected: currentlySelected, currentlySelectedIndex })
   };

   handleClose = () => {
     this.setState({ openRemarksData: false, changeStats: false })
   };

   handleClick = event => {
     this.setState({ anchorEl: event.currentTarget, colorValue: event.target.value })
   };

   handleMenuItemClick = (event, index) => {
     this.setState({ selectedIndex: index, anchorEl: null })
   };

   handleListClose = () => {
     this.setState({ anchorEl: null })
   };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  getRemarksData = (e) => {
    var path = urls.GetStudentDiscipline + '?'

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      if (res.status === 200) {
        this.setState({ remarksData: res.data })
      } else {
        this.props.alert.error('Error Occured')
      }
    })
      .catch(error => {
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }

  getRadioBranches () {
    var radioBranches = this.props.branches && this.props.branches.map((branch, index) => {
      const branchName = branch.branch_name
      const branchId = branch.id
      return (
        <div style={{ paddingLeft: 20 }}>
          <FormControlLabel value={`${branchId}`} control={<Radio />} label={`${branchName}`} checked={`${branchId}` === this.state.radioBranchValue} />
        </div>
      )
    })
    return radioBranches
  }

    getsearchvalue = () => {
      var radioBranches = this.props.branches && this.props.branches.filter(branch => {
        if (branch.branch_name.toLowerCase().includes(this.state.searchvalue.toLowerCase())) {
          return true
        } else {
          return false
        }
      }).map(branch => {
        var branchName = branch.branch_name
        var branchId = branch.id
        return (
          <div style={{ marginLeft: 20 }}>
            <FormControlLabel value={`${branchId}`} control={<Radio />} label={`${branchName}`} checked={`${branchId}` === this.state.radioBranchValue} />
          </div>
        )
      })
      return radioBranches
    }

    handleBranchRadioChange (e) {
      if (Number(e.target.value)) {
        this.setState({ radioBranchValue: e.target.value, checkedIndex: e.target.value, filterGrades: [], filterColumns: [], filterSections: [] }, () => { this.props.gradeMapBranch(this.state.radioBranchValue) })
      }
    }

    handleStatusRadioChange (e) {
      this.setState({ radioStatusValue: e.target.value })
    }

  handleCheckbox = (e, i) => {
    let { filterGrades, filterSections, filterColumns } = this.state
    if (i.name === 'Grade') {
      if (i.checked) {
        if (filterGrades.includes(String(i.value)) === false) {
          filterGrades.push(`${i.value}`)
        }
      } else {
        if (filterGrades.includes(String(i.value)) === true) {
          const index = filterGrades.indexOf(String(i.value))
          filterGrades.splice(index, 1)
        }
      }
      this.setState({ filterGrades })
    } else if (i.name === 'Section') {
      if (i.checked) {
        if (filterSections.includes(String(i.value)) === false) {
          filterSections.push(`${i.value}`)
        }
      } else {
        if (filterSections.includes(String(i.value)) === true) {
          const index = filterSections.indexOf(String(i.value))
          filterSections.splice(index, 1)
        }
      }
      this.setState({ filterSections })
    } else if (i.name === 'Select Columns') {
      if (i.checked) {
        if (i.value === 'All') {
          filterColumns = filterColumns.concat(this.state.excelColumns)
        } else if (filterColumns.includes(String(i.value)) === false) {
          filterColumns.push(`${i.value}`)
        }
      } else {
        if (i.value === 'All') {
          filterColumns = []
        }
        if (filterColumns.includes(String(i.value)) === true) {
          const index = filterColumns.indexOf(String(i.value))
          filterColumns.splice(index, 1)
        }
      }
      this.setState({ filterColumns })
    }
  }

  handleSectionClick= () => {
    axios
      .get(urls.SectionMapping_s + '?acad_branch_grade_mapping_id=' + this.state.filterGrades.toString(), {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((res) => {
        this.setState({ sections: res.data })
      })
  }

  getFilterContent=() => {
    return (<>
      <ListItem button onClick={() => this.setState({ opener: !this.state.opener })}><ListItemText
        style={{ fontSize: '4px', padding: 0 }} inset primary='Branch' secondary={this.state.radioBranchValue ? 'Selected' : 'No item Selected'}
      />{this.state.opener ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      {this.state.opener &&

        <RadioGroup style={{ marginLeft: 0 }} name='branches' value={this.state.radioBranchValue} onChange={this.handleBranchRadioChange}>
          <ListItem style={{ position: 'relative', display: 'flex', overflow: 'auto' }}><SearchIcon />
            <InputBase
              placeholder='Search…'
              onChange={this.handlechange}
              value={this.state.searchvalue}
              style={{ marginLeft: 20, width: '100%', position: 'relative', display: 'flex' }}
            />
          </ListItem>
          <Paper elevation={3} primary='Branch' style={{ width: '100%', padingLeft: 20, maxHeight: 200, overflow: 'auto' }}>

            {this.state.searchvalue ? this.getsearchvalue() : this.getRadioBranches()}
          </Paper>
        </RadioGroup>}
      <Checkbox
        key='Grade'
        heading='Grade'
        array={
          Array.isArray(this.props.grades) && this.props.grades.map(item => {
            return {
              key: `${item.id}`,
              value: item.id,
              text: item.grade.grade
            }
          })
        }
        change={this.handleCheckbox}
        checkedItems={this.state.filterGrades}

      />
      <Checkbox
        key='Section'
        heading='Section'
        onTitleClick={this.handleSectionClick}
        array={this.state.sections && this.state.sections.map(item => {
          return {
            key: `${item.section_id}`,
            value: item.section_id,
            text: item.section_name
          }
        })}
        change={this.handleCheckbox}
        checkedItems={this.state.filterSections}
      />
      <ListItem button onClick={() => this.setState({ opened: !this.state.opened })} disabled={!(this.state.radioBranchValue && (this.state.filterGrades.length > 0 || this.state.filterSections.length > 0))}><ListItemText
        style={{ fontSize: '4px', padding: 0 }} inset primary='Select Status' secondary={this.state.radioStatusValue ? 'Selected' : 'No item Selected'}
      />{this.state.opened ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      {(this.state.radioBranchValue && (this.state.filterGrades.length > 0 || this.state.filterSections.length > 0)) && this.state.opened &&
        <RadioGroup
          style={{ marginLeft: 0 }}
          //  aria-label='radioStatusValue'
          name='status'
          value={this.state.radioStatusValue}
          onChange={this.handleStatusRadioChange}
        >
          <Paper elevation={3} style={{ width: '100%', padingLeft: 20, overflow: 'auto' }}>
            <div style={{ paddingLeft: 20 }}>
              <FormControlLabel value='active' control={<Radio />} label='Active' checked={this.state.radioStatusValue === 'active'} /><br />
              <FormControlLabel value='inactive' control={<Radio />} label='InActive' checked={this.state.radioStatusValue === 'inactive'} /><br />
              <FormControlLabel value='both' control={<Radio />} label='Both' checked={this.state.radioStatusValue === 'both'} />
            </div>
          </Paper>
        </RadioGroup>}

      {(this.state.radioBranchValue && (this.state.filterGrades.length > 0 || this.state.filterSections.length > 0)) ? <Checkbox
        key='Select Columns'
        heading='Select Columns'
        array={this.state.excelColumns && this.state.excelColumns.map((item, key) => {
          return {
            key: `${key}`,
            value: item,
            text: item
          }
        })}
        change={this.handleCheckbox}
        checkedItems={this.state.filterColumns}
      /> : ''}

      <Button
        onClick={this.ExcelDownloadHandler}
        variant='outlined'
        color='primary'
        size='large'
        style={{ width: '100%' }}

      >
        Download Excel
      </Button>
      <br />
    </>)
  }
  displayShuffle (mode, Shuffle, studentStatus) {
    if (mode === 'shuffle') {
      if (this.state.Tabvalue === 0 && !studentStatus && !Shuffle) {
        return 'block'
      } else if (this.state.Tabvalue === 0 && (!studentStatus || Shuffle)) {
        return 'none'
      }
    }
  }
  displayState (Flag, studentStatus) {
    if (this.state.Tabvalue === 0 && studentStatus && !Flag) {
      return 'block'
    } else if (this.state.Tabvalue === 0 && (!studentStatus || Flag)) {
      return 'none'
    } else if (this.state.Tabvalue === 1 && !studentStatus && !Flag) {
      return 'block'
    } else if (this.state.Tabvalue === 1 && (studentStatus || Flag)) {
      return 'none'
    } else if (this.state.Tabvalue === 2 && !studentStatus && !Flag) {
      return 'block'
    } else if (this.state.Tabvalue === 2 && (studentStatus || Flag)) {
      return 'none'
    }
  }

  renderSectionShuffle=(props, showselector) => {
    return (
      <div style={{ display: this.displayShuffle('shuffle', props.is_shuffle, props.is_active) }}>
        { showselector && <OmsSelect
          label='Section'
          options={
            this.state.sectionData.map(item => ({
              value: item.section_id,
              label: item.section_name
            }))
          }
          change={(event) => { this.handleShuffleSection(event, props) }}
        />}
      </div>
    )
  }
  getShuffleState (mode, Shuffle, studentStatus) {
    if (mode === 'shuffle') {
      if (this.state.Tabvalue === 0 && studentStatus && !Shuffle) {
        return false
      } else if (this.state.Tabvalue === 0 && (!studentStatus || Shuffle)) {
        return <span className='status-shuffle-approval'>Approval  pending</span>
      }
    }
  }

  renderSwitch=(props, showswitch, checked, Tabvalue, disable) => {
    return (<div style={{ display: this.displayState(props.flag, props.is_active) }}>{showswitch && <Switch
      checked={checked}
      onChange={(e, v) => this.handleChangeSwitch(e, v, props.id, props)}
      value={Tabvalue}
      inputProps={{ 'aria-label': 'secondary checkbox' }}
    />}</div>)
  }

  getStatusState=(Flag, studentStatus) => {
    if (this.state.Tabvalue === 0 && studentStatus && !Flag) {
      return false
    } else if (this.state.Tabvalue === 0 && (!studentStatus || Flag)) {
      return <span className='status-shuffle-approval'>Approval  pending</span>
    } else if (this.state.Tabvalue === 1 && !studentStatus && !Flag) {
      return false
    } else if (this.state.Tabvalue === 1 && (studentStatus || Flag)) {
      return <span className='status-shuffle-approval'>Approval  pending</span>
    } else if (this.state.Tabvalue === 2 && !studentStatus && !Flag) {
      return false
    } else if (this.state.Tabvalue === 2 && (studentStatus || Flag)) {
      return <span className='status-shuffle-approval'>Approval  pending</span>
    }
  }
  handleDeleteSwitch (event) {
    this.setState({ showDeleteAction: event.target.checked })
  }
  Action () {
    if (this.role === 'Principal') {
      return 'action'
    } else {
      return 'delete-action'
    }
  }

  DeleteSwitch () {
    let { showDeleteAction, Tabvalue } = this.state
    return (<div className={this.Action()}>Actions{(this.role === 'Admin' || this.role === 'FOE') && Tabvalue !== 2 && <Switch color='primary'checked={showDeleteAction} onChange={(e) => this.handleDeleteSwitch(e)} />}</div>)
  }
  ShowColumn (show) {
    let { Tabvalue } = this.state
    if (show === 'actions') {
      if ((this.role === 'Admin' || this.role === 'FOE' || this.role === 'Principal' || this.role === 'EA Academics')) {
        return true
      } else {
        return false
      }
    } else if (show === 'restore') {
      if ((this.role === 'Admin' && Tabvalue === 2)) {
        return true
      } else {
        return false
      }
    } else {
      if (Tabvalue === 0) {
        return true
      } else {
        return false
      }
    }
  }

  render () {
    const { classes } = this.props
    const { anchorEl } = this.state
    let { checkedA, checkedB, showDeleteAction } = this.state
    // let { checkedItem } = this.state
    const sameYearColumns = [
      {
        Header: <div className='student'>Sr</div>,
        accessor: 'id',
        Cell: (row) => {
          return <div>{(this.state.pageSize * this.state.pageNumber + (row.index + 1))}</div>
        },
        maxWidth: 60
      },
      {
        Header: <div className='student'>Student Name</div>,
        // className: 'student_',
        accessor: 'name',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 100
      },
      {
        Header: <div className='student'>Enrollment Code</div>,
        accessor: 'erp',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 100
      },
      {
        Header: <div className='student'>Admission Number</div>,
        accessor: 'admission_number',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 100
      },
      {
        Header: <div className='student'>Gr Number</div>,
        accessor: 'gr_number',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 70
      },
      {
        Header: <div className='student'>Date of Admission</div>,
        accessor: 'admission_date',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 50

      },

      {
        Header: <div className='student'>Date Of Birth</div>,
        accessor: 'date_of_birth',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 100

      },
      {
        Header: <div className='student'>Gender</div>,
        accessor: 'gender',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 70

      },
      {
        Header: <div className='student'>Roll Number</div>,
        accessor: 'roll_no',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 50

      },
      {
        Header: <div className='student'>Adhar Number</div>,
        accessor: 'aadhar_number',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>,
        maxWidth: 70
      },
      {
        id: 'x',
        show: this.ShowColumn('actions'),
        // show: () => this.returnAcadSessionYear(this.state.branchId) ? (this.ShowColumn('actions')) : '',
        Header: this.DeleteSwitch(),
        // minWidth: 90,

        accessor: props => {
          console.log(props)
          return (
            <div>
              {console.log(this.state.branchId, 'brnacj')}
              {console.log(this.state.date, 'brnacj')}

              {this.role === 'Admin' && <IconButton
                aria-label='Login As'
                onClick={() => this.switchUser(props.user)}
                className={classes.margin}
              >
                <SwapHorizontalIcon fontSize='small' />
              </IconButton>}
              {(this.role === 'Admin' || this.role === 'Principal' || this.role === 'FOE' || this.role === 'EA Academics') && <IconButton
                aria-label='Edit'
                onClick={e => {
                  console.log(props, 'id')
                  e.stopPropagation()
                  this.props.history.push(
                    '/student/edit/' + props.id
                  )
                }}
                className={classes.margin}
              >
                {console.log(this.state.branchId, 'brnacj')}
                <EditIcon fontSize='small' />
              </IconButton>}
              {(this.role === 'Admin' || this.role === 'FOE') && showDeleteAction && <IconButton
                aria-label='Delete'
                onClick={(e) => this.deleteHandler(props.id)}
                className={classes.margin}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>}
            </div>
          )
        }
      },
      {
        id: 'status',
        Header: <div className='student'>Status</div>,
        minWidth: 120,
        accessor: (props) => {
          console.log(props, this.state.value, props.flag)
          return (
            <div>
              {(this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') && (JSON.stringify(props.is_active) === 'true') && <Switch
                checked={this.state.checkedA}
                onChange={(e, v) => this.handleChangeSwitch(e, v, props.id)}
                value='true'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />}
              {(this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') && (JSON.stringify(props.is_active) === 'false') && <Switch
                checked={this.state.checkedB}
                onChange={(e, v) => this.handleChangeSwitch(e, v, props.id)}
                value='false'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />}
              {(this.role === 'Teacher') && (JSON.stringify(props.is_active) === 'true') && this.renderSwitch(props, (!props.flag), checkedA, 'true', !props)}
              { this.role === 'Teacher' && this.getStatusState(props.flag, props.is_active)}
              {(this.role === 'Teacher') && (JSON.stringify(props.is_active) === 'false') && this.renderSwitch(props, (!props.flag), checkedB, 'flase', props.is_active)}
            </div>
          )
        }
      },
      {
        id: 'info',
        Header: <div className='student'>Shuffle sections</div>,
        minWidth: 120,
        className: 'col-shuffle',
        accessor: (props, column) => {
          console.log(props, column)
          return (
            <div>
              {(props.is_active) && (this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') &&
                <OmsSelect
                  label='Section'
                  options={
                    this.state.sectionData.map(item => ({
                      value: item.section_id,
                      label: item.section_name
                    }))
                  }
                  change={(event) => { this.handleShuffleSection(event, props) }}
                />}

              { (props.is_active) && this.role === 'Teacher' && this.renderSectionShuffle(props, !props.is_shuffle) }
              <div className='shuffle-section'>{ (props.is_active) && this.role === 'Teacher' && this.getShuffleState('shuffle', props.is_shuffle, props.is_active)}</div>
            </div>
          )
        }
      },
      {
        id: 'restore',
        show: this.ShowColumn('restore'),
        Header: <div className='student' >Restore</div>,
        minWidth: 60,
        accessor: (props) => {
          console.log(props)
          if ((!props.is_active || props.is_delete) && (this.role === 'Admin')) {
            return (
              <IconButton
                aria-label='Delete'
                onClick={(e) => {
                  this.setState({ loading: true }, () => {
                    this.restoreUser(props.user)
                  })
                }}
                className={classes.margin}
              >
                <Restore />
              </IconButton>
            )
          }
        }
      },
      {
        id: 'remarks',
        Header: <div className='student'>Remarks</div>,
        minWidth: 300,
        accessor: (props) => {
          return (
            <div>
              <> {this.role !== 'CFO' && <Button variant='outlined' size='small' color='primary' onClick={() => this.handleClickOpen(props.id)}>
                Give Remarks
              </Button>}
              </>

              <> <Button
                variant='outlined' size='small' color='primary' onClick={e => {
                  console.log(props, 'id')
                  e.stopPropagation()
                  this.props.history.push(
                    '/remarks/' + props.id
                  )
                }}
              >
                View Remarks
              </Button>
              </>
            </div>
          )
        }
      }
      //  {
      //    id: 'status',
      //    Header: 'Status',
      //    minWidth: 120,
      //    accessor: props => {
      //      return (
      //        <div>
      //          { (this.role === 'Admin' || this.role === 'Principal') && <Switch
      //            checked={this.state.checkedA}
      //            onChange={() => this.handleChangeSwitch(props.is_active)}
      //            value='checkedA'
      //            inputProps={{ 'aria-label': 'secondary checkbox' }}
      //          />}
      //        </div>
      //      )
      //    }
      //  }

    ]
    const diffYearColumns = [{
      Header: <div className='student'>Sr</div>,
      accessor: 'id',
      Cell: (row) => {
        return <div>{(this.state.pageSize * this.state.pageNumber + (row.index + 1))}</div>
      }
    },
    {
      Header: <div className='student'>Student Name</div>,
      // className: 'student_',
      accessor: 'name',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span> },
    {
      Header: <div className='student'>Enrollment Code</div>,
      accessor: 'erp',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
    },
    {
      Header: <div className='student'>Admission Number</div>,
      accessor: 'admission_number',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
    },
    {
      Header: <div className='student'>Gr Number</div>,
      accessor: 'gr_number',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
    },
    {
      Header: <div className='student'>Date of Admission</div>,
      accessor: 'admission_date',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

    },

    {
      Header: <div className='student'>Date Of Birth</div>,
      accessor: 'date_of_birth',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

    },
    {
      Header: <div className='student'>Gender</div>,
      accessor: 'gender',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

    },
    {
      Header: <div className='student'>Roll Number</div>,
      accessor: 'roll_no',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>

    },
    {
      Header: <div className='student'>Adhar Number</div>,
      accessor: 'aadhar_number',
      Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
    }]

    return (
      <>
        <div>
          <Dialog
            open={this.state.openRemarksData}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <DialogContent>
              <TextField
                label='Student Name'
                onChange={(e) => {
                  this.setState({ currentlySelected: { ...this.state.currentlySelected, name: e.target.value } })
                }}
                value={this.state.currentlySelected.name}
                InputProps={{
                  readOnly: true
                }}
              />
            </DialogContent>
            <DialogContent>
              <TextField
                label='ERP'
                onChange={(e) => {
                  console.log(e)
                  this.setState({ currentlySelected: { ...this.state.currentlySelected, erp: e.target.value } })
                }}
                value={this.state.currentlySelected.erp}
                InputProps={{
                  readOnly: true
                }}
              />
            </DialogContent>

            <DialogContent>
              <List component='nav'>
                <ListItem
                  button
                  aria-haspopup='true'
                  aria-controls='lock-menu'
                  aria-label='Select Color'
                  onClick={this.handleClickListItem}
                >
                  <ListItemAvatar>
                    <div style={{ backgroundColor: options[this.state.selectedIndex].toLowerCase(), width: 24, height: 24, borderRadius: 10 }} />
                  </ListItemAvatar>
                  <ListItemText
                    // primary='Select Colors'
                    secondary={options[this.state.selectedIndex]}

                  />
                </ListItem>
              </List>
              <Menu
                id='lock-menu'
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleListClose}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    disabled={index === 0}
                    selected={index === this.state.selectedIndex}
                    onClick={event => this.handleMenuItemClick(event, index)}
                  >
                    <div style={{ backgroundColor: option.toLowerCase(), width: 24, height: 24, borderRadius: 10 }} />
                    {option}
                  </MenuItem>
                ))}
              </Menu>

            </DialogContent>
            <DialogContent>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Remark'
                type='email'
                multiline
                fullWidth
                value={this.state.name}
                disabled={this.state.selectedIndex === 0}
                onChange={this.handleChange('name')}

              />
            </DialogContent>
            <DialogActions>
              <Button color='primary' onClick={() => { const val = this.state.changeStats; this.setState({ changeStats: !val }); this.handleClose() }}>
    Cancel
              </Button>

              <Button
                color='primary'onClick={() => {
                  if (this.state.selectedIndex && this.state.name) {
                    const val = this.state.changeStats; this.setState({ changeStats: !val }); this.getRemarkData()
                  } else {
                    this.props.alert.warning('Please enter required fields')
                  }
                }}
              >
    Save
              </Button>
            </DialogActions>
          </Dialog>

        </div>
        <Toolbar

          floatRight={<>

            {this.role === 'Admin' && <RouterButton value={addStudentExcel} />}
            {this.role === 'Admin' && <RouterButton value={StudentActions} />}
            {rshipManagerAccessRoles.includes(this.role) ? <RelationshipManager alert={this.props.alert} /> : null}
            {stPfleAccessRoles.includes(this.role)
              ? <RouterButton
                value={((studentProfilesRouteBtn) => {
                  let { selectorData: { section_mapping_id: sectionMappingId } = {} } = this.state || {}
                  if (sectionMappingId) {
                    // if sectionMappingId exists..then redirection happens with  sectionMappingId
                    let { href } = studentProfilesRouteBtn
                    return { ...studentProfilesRouteBtn, href: `${href}?sectionMappingId=${sectionMappingId}` }
                  } else {
                    return studentProfilesRouteBtn
                  }
                })(studentProfilesRouteBtn)}
              />
              : null
            }
          </>}
        >
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect config={COMBINATIONS} variant='filter' onChange={this.onChange} />
          </Grid>
          <Button
            onClick={e => this.handleClickGetStudentData(e, 1, 10)}
          >Get Students
          </Button>
          <div className={classes.grow} />
          <div className={classes.download}>
            <Grid item xs={12} style={{ marginLeft: 0 }}>
              <ListItem
                button
                onOut
                onClick={(e) => {
                  const { height, top, left } = e.target.getClientRects()[0]
                  const { currentTarget } = e
                  this.setState(state => ({ anchorEl: currentTarget, open: !state.open, positionTop: (height + top + window.screenTop), positionLeft: left }))
                  this.getColumns()
                }}
              >
                <ListItemText style={{ fontSize: '4px', padding: 0 }} inset primary='Download' />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              {this.state.open
                ? <Grid item xs={window.isMobile ? 10 : 3} style={{ zIndex: 9999, position: 'absolute' }}>
                  <Paper elevation={10} style={{ width: '100%', overflow: 'scroll', maxHeight: 400 }}>
                    <Collapse in={this.state.open} timeout='auto' unmountOnExit>
                      {this.getFilterContent()}
                    </Collapse>
                  </Paper>
                </Grid> : null}
            </Grid>
          </div>

          <div className={classes.grow1} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={this.state.searchValue}
              onChange={this.handleSearch}
              onBlur={(e) => { e.target.value.length < 0 && this.setState({ searching: false }) }}
              onFocus={(e) => { e.target.value.length > 0 && this.setState({ searching: true }) }}
            />
          </div>
          <Button href={this.state.csv.href}>{this.state.csv.label}</Button>
          <Button href={this.state.excel.href}>{this.state.excel.label}</Button>
          <Tabs value={this.state.Tabvalue} indicatorColor='primary' textColor='primary' onChange={this.handleChangeTab}>
            <Tab label='Active' />
            <Tab label='InActive' />
            <Tab label='Alumni' />
          </Tabs>
        </Toolbar>
        {<div className={classes.tableWrapper} style={{ overflowX: 'auto' }}>
          <div style={{ padding: 10 }}>
            {this.state.year === this.state.userAcadYear
              ? <ReactTable
                manual
                loading={this.state.tabChangeLoading}
                data={this.state.studentData && this.state.sectionData ? this.state.studentData.results : []}
                showPagination
                showPageSizeOptions={false}
                defaultPageSize={this.state.pageSize}
                style={{ maxWidth: '100%' }}
                // onFetchData={this.fetchData}
                SubComponent={this.subComponent}
                onPageChange={(pNo) => {
                  this.setState({ pageNumber: pNo, tabChangeLoading: true }, () => { this.getStudentData(null, pNo) })
                }}
                page={this.state.pageNumber}
                pages={this.state.totalPages}
                columns={sameYearColumns}
              />
              : <ReactTable
                manual
                loading={this.state.tabChangeLoading}
                data={this.state.studentData && this.state.sectionData ? this.state.studentData.results : []}
                showPagination
                showPageSizeOptions={false}
                defaultPageSize={this.state.pageSize}
                style={{ maxWidth: '100%' }}
                // onFetchData={this.fetchData}
                SubComponent={this.subComponent}
                onPageChange={(pNo) => {
                  this.setState({ pageNumber: pNo, tabChangeLoading: true }, () => { this.getStudentData(null, pNo) })
                }}
                page={this.state.pageNumber}
                pages={this.state.totalPages}
                columns={diffYearColumns}
              />}
          </div>
        </div>}
        {/* </Paper>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div> */}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.authentication.user,
    branches: state.branches.items,
    subjects: state.subjects.items,
    student: state.student,
    grades: state.gradeMap.items,
    studentResult: state.studentSearch,
    sections: state.sectionMap.items,
    sectionList: state.sections.items
  }
}

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listSections: () => dispatch(apiActions.listSections()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId) => dispatch(apiActions.getSectionMapping(acadMapId)),
  listStudents: (sectionId, status, pageId = 1, isDelete) => dispatch(apiActions.listStudents(sectionId, status, pageId, isDelete)),
  listStudentSearch: (role, search, sectionMappingId, pageId = 1, isActive, isDelete) => dispatch(apiActions.listStudentSearch(role, search, sectionMappingId, pageId, isActive, isDelete)),
  listStudentsV2: (sectionId, status, pageId, isDelete, pageSize = 10, academicYear) => dispatch(apiActions.listStudentsV2(sectionId, status, pageId, isDelete, pageSize, academicYear))
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(withStyles(styles)(Student))))
