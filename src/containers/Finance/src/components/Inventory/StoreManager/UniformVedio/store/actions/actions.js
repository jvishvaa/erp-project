import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const UNIFORM_VEDIO_URL = 'UNIFORM_VEDIO_URL'

// action - creators
export const fetchUniformVedioUrl = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListBulkUniform + '?session_year=' + payload.session + '&grade=' + payload.grade + '&section=' + payload.section, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: UNIFORM_VEDIO_URL,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
