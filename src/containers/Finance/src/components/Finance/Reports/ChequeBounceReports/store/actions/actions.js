import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// action types
export const CHEQUE_BOUNCE_LIST_REPORTS = 'CHEQUE_BOUNCE_LIST_REPORTS'
export const DOWNLOAD_CHEQUE_BOUNCE_REPORTS = 'DOWNLOAD_CHEQUE_BOUNCE_REPORTS'

// action creators
export const chequeBounceList = (payload) => {
  let bounceListUrl = null
  if (payload.role === 'financeaccountant') {
    bounceListUrl = urls.ChequeBounceListAccountant + '?academic_year=' + payload.session + '&from=' + payload.fromDate + '&to=' + payload.toDate
  } else {
    bounceListUrl = urls.ChequeBounceListAdmin + '?academic_year=' + payload.session + '&Branch=' + payload.branchId + '&from=' + payload.fromDate + '&to=' + payload.toDate
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(bounceListUrl, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: CHEQUE_BOUNCE_LIST_REPORTS,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load reports')
        console.log(error)
      })
  }
}

export const downloadChequeBounceReports = (payload) => {
  let bounceListUrl = null
  if (payload.role === 'financeaccountant') {
    bounceListUrl = urls.ChequeBounceListAccountantReports + '?academic_year=' + payload.session.value + '&from=' + payload.fromDate + '&to=' + payload.toDate
  } else {
    bounceListUrl = urls.ChequeBounceListAdminReports + '?academic_year=' + payload.session.value + '&Branch=' + payload.branchId.value + '&from=' + payload.fromDate + '&to=' + payload.toDate
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(bounceListUrl, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        },
        responseType: 'blob'
      }).then(response => {
        // const url = urls.BASE + response.data
        // axios.get(url, {
        //   headers: {
        //     Authorization: 'Bearer ' + payload.user
        //   },
        //   responseType: 'blob'
        // }).then(response => {
        // }).catch(err => {
        // })
        // dispatch({
        //   type: DOWNLOAD_CHEQUE_BOUNCE_REPORTS,
        //   payload: {
        //     data: response.data
        //   }
        // })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.setAttribute('download', payload.reportName)
        document.body.appendChild(link)
        link.click()
        // payload.alert.success('Downloading...')
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
      })
  }
}
