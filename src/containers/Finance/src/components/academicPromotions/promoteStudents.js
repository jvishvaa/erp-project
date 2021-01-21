import React from 'react'
import axios from 'axios'
import { urls } from '../../urls'
import CustomButton from './btn'
import { InternalPageStatus } from '../../ui'
import FullWidthTabs from './promoteMessage/tabMessage'

class PromoteStudents extends React.Component {
  constructor (props) {
    super(props)
    // this.state = { success: undefined, failures: undefined }
    // let success = []
    // for (let i = 1; i <= 100; i++) {
    //   success[i] = {
    //     'erp': '1705040218',
    //     'remark': 'Student Promoted.'
    //   }
    // }
    this.state = { success: undefined, failures: undefined }
    this.promote = this.promote.bind(this)
    this.getView = this.getView.bind(this)
    this.renderPromoteBtn = this.renderPromoteBtn.bind(this)
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
  }
  promote () {
    let { PromoteStudents: apiURL } = urls
    let { headers } = this
    let { academicYear, filterData, notStudentErps = new Map() } = this.props
    // const hasRequiredData = Object.keys(filterData).length >= 0 && academicYear
    // if (!hasRequiredData) return
    let payLoad = Object.assign({}, { academicYear }, filterData)
    notStudentErps = [...notStudentErps.keys()]
    if (notStudentErps.length) {
      payLoad['excludedStudentErps'] = notStudentErps
    }
    this.setState({ isPosting: true, isPostFailed: null })
    axios.post(apiURL, payLoad, headers)
      .then(res => {
        let { status, data } = res || {}
        if (status === 200) {
          let { success = [], failures = [] } = data
          this.setState({ success, failures })
          this.props.fetchStudents()
        }
        this.setState({ isPosting: false })
      })
      .catch(err => {
        console.log(err)
        let { message: errorMessage, response: { data: { message: msgFromDeveloper, detail } = {} } = {} } = err
        var message
        if (msgFromDeveloper) {
          this.props.alert.error(`${msgFromDeveloper}`)
          message = `${msgFromDeveloper}`
        } else if (detail) {
          this.props.alert.error(`${detail}`)
          message = `${detail}`
        } else if (errorMessage) {
          this.props.alert.error(`${errorMessage}`)
          //   message = `${errorMessage}`
          message = undefined
        } else {
          console.error('Failed to fetch students')
          message = `${msgFromDeveloper}`
        }
        this.setState({ isPosting: false, isPostFailed: true, errorMessage: message })
      })

    //   {
    //     "success": [
    //         {
    //             "erp": "1705040218",
    //             "remark": "Student Promoted."
    //         }
    //     ],
    //     "failures": [
    //         {
    //             "erp": "1705040219",
    //             "remark": "Student either does not exist for erp: 1234, or is not active or is deleted."
    //         }
    //     ]
    // }
  }
  renderPromoteBtn () {
    let { academicYear, filterData, isFetchingStudents, count: studentsCount = 0, notStudentErps = new Map(), financiallyPromoted } = this.props
    let getPromoCount = studentsCount - notStudentErps.size
    if (!getPromoCount || getPromoCount <= 0 || !financiallyPromoted) { return null }

    const hasRequiredData = Object.keys(filterData).length >= 0 && academicYear
    let btnLabel = isFetchingStudents
      ? 'Fetching Student info'
      : hasRequiredData
        ? 'Promote Selected Students'
        : 'Required data not found'
    return <div style={{ margin: 10, display: 'flex' }}>
      <CustomButton
      //   disabled={!hasRequiredData || isFetchingStudents}
        label={btnLabel}
        style={{ margin: 'auto' }}
        onClick={this.promote}
      />
    </div>
  }
  getView () {
    let { success, failures } = this.state
    const hasPromotedData = success || failures
    return <div>
      {hasPromotedData ? <FullWidthTabs data={{ success, failures }} /> : null}
      {this.renderPromoteBtn()}
    </div>
  }
  render () {
    let { isPosting, isPostFailed } = this.state
    if (isPosting) {
      return <InternalPageStatus label={'Please wait.. promotion is in progress'} />
    } else if (isPostFailed) {
      let { errorMessage } = this.state
      errorMessage = errorMessage || <div><h4>Server Error</h4>Looks like we're unable to connect you to the server. Request you to Refresh or Try Later</div>
      return <InternalPageStatus
        loader={false}
        label={errorMessage} />
    } else {
      return this.getView()
    }
  }
}
export default PromoteStudents
