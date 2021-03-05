import axios from 'axios'

import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

export const BULK_ACTIVE_INACTIVE = 'BULK_ACTIVE_INACTIVE'
export const BULK_ACCOUNTANT_LOGIN = Symbol('BULK_ACCOUNTANT_LOGIN')
export const BRANCH_LISTING = Symbol('BRANCH_LISTING')
export const BULK_FEE_UPLOAD = 'BULK_FEE_UPLOAD'
export const BULK_REPORT_UPLOAD = 'BULK_REPORT_UPLOAD'
export const BULK_REPORT_STATUS = 'BULK_REPORT_STATUS'
export const BULK_REPORT_LIST = 'BULK_REPORT_LIST'
export const ONLINE_PAYMENT_UPLOAD = 'ONLINE_PAYMENT_UPLOAD'

export const bulkActiveInactive = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.BulkActiveInactive, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(res => {
      if (+res.status === 200) {
        payload.alert.success('Successfully Done')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      if (err.response && err.response.status === 400) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const bulkActiveInactiveParent = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.BulkActiveInactiveParent, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(res => {
      if (+res.status === 200) {
        payload.alert.success('Successfully Done')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      if (err.response && err.response.status === 400) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const bulkAccountantLogin = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.AccountantLogin, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('Login Accountant : ', response.data)
      if (response.status === 200) {
        payload.alert.success('Success')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      if (err.response && err.response.status === 400) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Unable To get Status')
      }
    })
  }
}

export const branchListing = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.BranchListing, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: BRANCH_LISTING,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
export const bulkReportUpload = (payload) => {
  let url = null
  // console.log('report......', payload.reportId)
  if (payload.reportId === 1) {
    url = `${urls.BulkReportUpload}concession/`
  } else if (payload.reportId === 2) {
    url = `${urls.BulkReportUpload}other-fee-concession/`
  } else if (payload.reportId === 3) {
    url = `${urls.BulkReportUpload}normal-fee/`
  } else if (payload.reportId === 4) {
    url = `${urls.BulkReportUpload}app-reg-upload/`
  } else if (payload.reportId === 5) {
    url = `${urls.BulkReportUpload}other-fee-upload/`
  } else if (payload.reportId === 6) {
    url = `${urls.BulkReportUpload}store-report/`
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(url, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
        // 'Content-Type': 'multipart/form-data',
        // 'mimeType': 'multipart/form-data'
      }
    }).then(res => {
      console.log('responseeeee', res)
      if (+res.status === 201) {
        payload.alert.success('Successfully Done')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log('error response...', JSON.stringify(err))
      // console.log('reponse+++', err.response.data.err_msg)
      if (err.response && err.response.status === 400) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Unable To get Status')
      }

      dispatch(actionTypes.dataLoaded())
    })
  }
}
export const bulkReportList = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.BulkReportList, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: BULK_REPORT_LIST,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      payload.alert.warning('Unable To get Status')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const fetchBulkReportStatus = (payload) => {
  let url = null
  if (payload.isAdmin) {
    url = `${urls.BulkReportStatus}?session_year=${payload.sessionYear}&branch_id=${payload.branch}&report_type=${payload.reportType}&page=${payload.page}&page_size=${payload.pageSize}`
  } else {
    url = `${urls.BulkReportStatus}?session_year=${payload.sessionYear}&report_type=${payload.reportType}&page=${payload.page}&page_size=${payload.pageSize}`
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: BULK_REPORT_STATUS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      payload.alert.warning('Unable To get Status')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const bulkFeeUpload = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.BulkFeeStructureUpload, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
        // 'Content-Type': 'multipart/form-data',
        // 'mimeType': 'multipart/form-data'
      }
    }).then(res => {
      console.log('responseeeee', res)
      if (+res.status === 201) {
        payload.alert.success('Successfully Done')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log('error response...', JSON.stringify(err))
      // console.log('reponse+++', err.response.data.err_msg)
      if (err.response && err.response.status === 400) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Unable To get Status')
      }

      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const onlinePaymentUpload = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.OnlinePaymentUpload, payload.body, {
      headers: {
        'Authorization': 'Bearer ' + payload.user
      }
    }).then(res => {
      if (+res.status === 200) {
        payload.alert.success('Successfully Done')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Failed To Perform')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
 payload.alert.warning(err.response.data.err_msg)