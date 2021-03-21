import axios from 'axios'
import * as actionTypes from '../../../../../Finance/store/actions/actions'
import { urls } from '../../../../../../urls'

// action-types
export const UPLOAD_ORDER_STATUS = 'UPLOAD_ORDER_STATUS'

// action - creators
export const UploadOrderStatus = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.OrderStatusUpload, payload.body, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200) {
        payload.alert.success('Successfully Uploading the status...')
        // dispatch({
        //   type: UPLOAD_ORDER_STATUS,
        //   payload: {
        //     data: response.data
        //   }
        // })
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
