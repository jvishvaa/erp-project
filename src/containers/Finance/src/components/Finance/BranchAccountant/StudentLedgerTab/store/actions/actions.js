import axios from 'axios'
import { urls } from '../../../../../../urls'
import * as actionTypes from '../../../../store/actions/actions'

export const STUDENT_ERP_SEARCH = 'STUDENT_ERP_SEARCH'

export const studentErpSearch = (payload) => {
  let url = ''
  if (payload.type === 'erp') {
    url = urls.SuggestionsForErpStudent + '?erp=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  } else if (payload.type === 'student') {
    url = urls.SuggestionsForErpStudent + '?student_name=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  } else if (payload.type === 'fatherName') {
    url = urls.SuggestionsForErpStudent + '?father_name=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  } else if (payload.type === 'fatherNo') {
    url = urls.SuggestionsForErpStudent + '?father_contact_no=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  } else if (payload.type === 'motherName') {
    url = urls.SuggestionsForErpStudent + '?mother_name=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  } else if (payload.type === 'motherNo') {
    url = urls.SuggestionsForErpStudent + '?mother_contact_no=' + payload.erp +
      '&session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section +
      '&state=' + payload.status
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: STUDENT_ERP_SEARCH,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.warning('Unable To Load')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
