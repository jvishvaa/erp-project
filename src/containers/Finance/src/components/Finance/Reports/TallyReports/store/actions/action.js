import axios from 'axios'
import * as actionTypes from '../../../../store/actions/actions'
import { urls } from '../../../../../../urls'

// actions types
export const FEE_ACOUNT_PER_BRANCH_AND_ACADID = 'FEE_ACOUNT_PER_BRANCH_AND_ACADID'
export const DOWNLOAD_TALLY_REPORT = 'DOWNLOAD_TALLY_REPORT'

// action creators
export const fetchFeeAccPerBranchAndAcad = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.FeeAccountPerBranch, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FEE_ACOUNT_PER_BRANCH_AND_ACADID,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.warning('Unable to load data')
        console.log(error)
      })
  }
}

export const downloadTallyReports = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.DownloadTallyReport, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
        // responseType: 'blob'
      }).then(response => {
        console.log('----response---------', response)
        const url = urls.BASE + response.data
        axios.get(url, {
          headers: {
            Authorization: 'Bearer ' + payload.user
          },
          responseType: 'blob'
        }).then(response => {
          // console.log(urls.BASE)
          const url = window.URL.createObjectURL(new Blob([response.data]))
          console.log('--url----------', url)
          const link = document.createElement('a')
          link.href = url
          link.target = '_blank'
          link.setAttribute('download', 'TallyReport.csv')
          document.body.appendChild(link)
          link.click()
        }).catch(err => {
          console.log('Error in Second Axios', err)
        })
        dispatch({
          type: DOWNLOAD_TALLY_REPORT,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
        // payload.alert.success('Downloading...')
      }).catch(error => {
        dispatch(actionTypes.dataLoaded())
        // payload.alert.error('Something Went Wrong')
        console.log(error)
      })
  }
}
