import React, { Component } from 'react'
// import { connect } from 'react-redux'
import axios from 'axios'
import Switch from '@material-ui/core/Switch'
import ReactTable from 'react-table'
import Checkbox from '@material-ui/core/Checkbox'
import LinkTag from '@material-ui/core/Link'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { urls } from '../../urls'
import { InternalPageStatus, SessionStorageHandler } from '../../ui'
import PromoteStudents from './promoteStudents'
import { CollapsableBar, ExcludedStdsCollapseBar } from './collapsableDiv'

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
class StudentPromotions extends Component {
  constructor (props = {}) {
    super(props)
    this.sStgeNotStudentErps = new SessionStorageHandler('notStudentErps')
    this.state = { pageSize: 5, notStudentErps: new Map(), financiallyPromoted: true }
    this.renderToolbar = this.renderToolbar.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.fetchStudents = this.fetchStudents.bind(this)
    this.renderStudents = this.renderStudents.bind(this)
    this.removeStudentFromNotMap = this.removeStudentFromNotMap.bind(this)
    this.removeSeletedMappings = this.removeSeletedMappings.bind(this)
    this.setSessionNotStudents = this.setSessionNotStudents.bind(this)
    this.clearNotStudentErps = this.clearNotStudentErps.bind(this)
    this.renderChckBxFP = this.renderChckBxFP.bind(this)
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
  }
  componentWillMount () {
    this.getSessionNotStudents()
  }
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
      this.props.handleClose()
    }
    let { classes } = this.props

    return <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
      <h5 className={classes.title}>{title}</h5>
      {this.renderChckBxFP()}
    </div>
  }
  /**
   * @param
   * [['is_comprehension', 'False'], ['page_size', 10], ['temp', false]]
   * createQuery([['is_comprehension', 'False'], ['page_size', 10], ['temp', false]])
   * @return
   * returns only params has true val
   * is_comprehension=False&page_size=10
  */
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')

  fetchStudents (reactTableState) {
    let { PromotionEligebleStudents } = urls
    let { filterData = {} } = this.props
    if (Object.keys(filterData).length <= 0) {
      this.props.alert.warning('Please choose Section or grade or branch')
      this.props.handleClose()
      return
    }
    let { page: pageNumber = 0, pageSize = 5 } = reactTableState || {}
    pageNumber = Number(pageNumber) + 1// zero indexing
    let { financiallyPromoted } = this.state
    let paramsObj = Object.assign({}, filterData, { pageNumber, pageSize, financiallyPromoted })
    let query = this.createQuery(Object.entries(paramsObj))
    let apiURL = PromotionEligebleStudents + '?' + query
    this.setState({ isFetchingStudents: true, isFetchStudentsFailed: null })
    axios.get(apiURL, this.headers)
      .then(response => {
        let { status, data = {} } = response || {}
        this.setState({ isFetchingStudents: false })
        if (status === 200) {
          let {
            ineligibleStudents,
            eligibleStudents,
            count,
            pageNumber,
            totalPages
          } = data
          pageNumber = Number(pageNumber)
          let students = []
          if (eligibleStudents) {
            students = eligibleStudents
          } else if (ineligibleStudents) {
            students = ineligibleStudents
          }
          this.setState({ students, pageSize, count, pageNumber, totalPages })
        } else {
          let { message } = data
          this.props.alert.error(`${message}`)
        }
      })
      .catch(err => {
        let { message: errorMessage, response: { data: { message: msgFromDeveloper } = {} } = {} } = err
        this.setState({ isFetchStudentsFailed: true, isFetchingStudents: false })
        if (msgFromDeveloper) {
          this.props.alert.error(`${msgFromDeveloper}`)
        } else if (errorMessage) {
          this.props.alert.error(`${errorMessage}`)
        } else {
          console.error('Failed to fetch students')
        }
      })
  }
  renderToolbar () {
    let { filterData, classes } = this.props
    return <AppBar className={classes.appBar}><Toolbar>
      <IconButton edge='start' color='primary' onClick={this.props.handleClose} aria-label='close'>
        <CloseIcon />
      </IconButton>
      <div style={{ width: '75%' }}>
        {this.getTitle(filterData)}

      </div>
    </Toolbar>
    </AppBar>
  }
  renderTable () {

  }
  columns = [
    {
      id: 'checkbox',
      Header: () => 'Select or Deselect',
      Cell: ({ original: props }) => {
        return <span>
          <Checkbox
            key={props.erp}
            checked={!this.state.notStudentErps.has(props.erp)}
            onClick={() => {
              let { notStudentErps = new Map() } = this.state
              if (notStudentErps.has(props.erp)) {
                notStudentErps.delete(props.erp)
              } else {
                notStudentErps.set(props.erp, props)
              }
              this.setState({ notStudentErps })
              this.setSessionNotStudents(notStudentErps)
            }}
            indeterminate={this.state.notStudentErps.has(props.erp)}
            value='primary'
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </span>
      },
      width: 80
    },
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
    }
  ]
  renderChckBxFP () {
    let { financiallyPromoted } = this.state
    return <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <Switch color='primary'
          checked={this.state.financiallyPromoted}
          //  onChange={(e) => this.handleDeleteSwitch(e)}
          onClick={() => {
            this.setState(currentState => ({ financiallyPromoted: !currentState.financiallyPromoted }),
              this.fetchStudents)
            //  clear notStudentErps
            this.clearNotStudentErps()
            this.sStgeNotStudentErps.set([])
          }}
        />
      </div>
      <h4 style={{ color: 'black' }}>Financially {financiallyPromoted ? '' : 'Not'} Promoted Students</h4>
    </div>
  }
  renderStudents () {
    let { students = [], isFetchingStudents, financiallyPromoted, isFetchStudentsFailed } = this.state
    let str = `Financially ${financiallyPromoted ? '' : 'Not'} Promoted Students`
    if (isFetchStudentsFailed) {
      return <InternalPageStatus
        loader={false}
        label={<p>Error occured in fetching data&nbsp;
          <LinkTag
            component='button'
            onClick={this.fetchStudents}>
            <b>Click here to reload_</b>
          </LinkTag>
        </p>}
      />
    }
    let { totalPages, count, notStudentErps = new Map() } = this.state
    return <div>
      <h4 style={{ whiteSpace: 'pre-line' }}>
        Total Students: {isFetchingStudents ? 'loading..' : count}
        {notStudentErps.size ? ` , Excluded student count: ${notStudentErps.size}` : null}
        {notStudentErps.size ? `\nNo of students going to get promoted: ${count - notStudentErps.size}` : null}
      </h4>
      <ReactTable
        data={students}
        manual
        noDataText={`No ${str} Found`}
        loadingText={`Fetching ${str}... please wait..`}
        onFetchData={this.fetchStudents}
        loading={isFetchingStudents}
        defaultPageSize={5}
        pages={totalPages}
        columns={this.columns}
      />
    </div>
  }
  clearNotStudentErps () {
    this.setState({ notStudentErps: new Map() })
    this.sStgeNotStudentErps.set([])
  }
  removeStudentFromNotMap (studentId, index, studentObj = {}) {
    let { notStudentErps = new Map() } = this.state
    let { erp } = studentObj
    notStudentErps.delete(erp)
    this.setState({ notStudentErps })
    this.setSessionNotStudents(notStudentErps)
  }
  getSessionNotStudents () {
    let notStudentErps = this.sStgeNotStudentErps.get() || []
    this.setState({ notStudentErps: new Map(notStudentErps.map(stObj => [stObj.erp, stObj])) })
  }
  setSessionNotStudents (notStudentErps = new Map()) {
    let studentObjs = [...notStudentErps.values()]
    this.sStgeNotStudentErps.set(studentObjs)
  }
  removeSeletedMappings (itemId, index, itemObj) {
    console.log('')
  }
  render () {
    let { filterData = {}, isFetchingStudents, alert, academicYear } = this.props
    let { notStudentErps = new Map(), count, financiallyPromoted } = this.state
    let propsToPromoteSt = {
      filterData,
      fetchStudents: this.fetchStudents,
      isFetchingStudents,
      alert,
      count,
      academicYear,
      notStudentErps,
      financiallyPromoted
    }
    const tableContainer = { margin: 10, padding: 5, display: 'flex', justifyContent: 'space-between' }
    return <div>

      {this.renderToolbar()}
      <div style={tableContainer}>
        <div style={{ flexBasis: '30%' }}>
          <CollapsableBar
            title='Selected Mappings'
            filterData={filterData || {}}
            handleItemClick={this.removeSeletedMappings}
            diasbleClick
          />
          <ExcludedStdsCollapseBar
            title='Excluded Students'
            items={[...notStudentErps.values()]}
            handleItemClick={this.removeStudentFromNotMap}
          />

          <PromoteStudents {...propsToPromoteSt} />

        </div>
        <div style={{ flexBasis: '65%' }}>
          {this.renderStudents()}
        </div>
      </div>
    </div>
  }
}
export default withRouter(withStyles(useStyles)(StudentPromotions))
