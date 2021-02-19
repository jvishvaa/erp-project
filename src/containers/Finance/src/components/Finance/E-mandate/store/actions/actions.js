import axios from 'axios'
import { urls } from '../../../../../urls'
import * as actionTypes from '../../../store/actions/actions'

export const LIST_DOMAIN_NAME = 'LIST_DOMAIN_NAME'
export const CREATE_DOMAIN_NAME = 'CREATE_DOMAIN_NAME'
export const SET_DOMAIN_DETAILS = 'SET_DOMAIN_DETAILS'
export const TODAY_DETAILS = 'TODAY_DETAILS'
export const DAILY_DETAILS = 'DAILY_DETAILS'
export const SET_CUSTOMER_DETAILS = 'SET_CUSTOMER_DETAILS'
export const LIST_CUSTOMER_DETAILS = 'LIST_CUSTOMER_DETAILS'
export const CREATE_ORDER_DETAILS = 'CREATE_ORDER_DETAILS'
export const GET_CUSTOMER_DETAILS = 'GET_CUSTOMER_DETAILS'
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS'
// export const ORDER_PAYMENT = 'ORDER_PAYMENT'
export const GET_SUBSEQUENT_PAYMENT = 'GET_SUBSEQUENT_PAYMENT'
export const UPDATE_CUSTOMER_DETAILS = 'UPDATE_CUSTOMER_DETAILS'
export const GET_DOMAIN_NAME_BY_ID = 'GET_DOMAIN_NAME_BY_ID'
export const TOTAL_BILLING_DETAILS = 'TOTAL_BILLING_DETAILS'
export const UPDATE_DOMAIN_NAME = 'UPDATE_DOMAIN_NAME'
export const SUBSEQUENT_PAYMENT = 'SUBSEQUENT_PAYMENT'
export const CREATE_LINK = 'CREATE_LINK'
export const DOMAIN_DAILY_BILL_STATUS = 'DOMAIN_DAILY_BILL_STATUS'

export const listDomainName = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ListDomainName + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: LIST_DOMAIN_NAME,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200) {
        if (response.data.length > 0) {
          // payload.alert.success('Successfully Got Branch Names!')
        } else {
          // payload.alert.warning('Create branch name first to get!')
        }
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }

      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createDomainName = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateDomainName, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: CREATE_DOMAIN_NAME,
        payload: {
          data: response.data
        }
      })
      if (response.status === 201) {
        // payload.alert.success('Successfully Added!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const setDomainDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SetDomainDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: SET_DOMAIN_DETAILS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 201) {
        // payload.alert.success('Successfully Added!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const todayEMandateDetails = (payload) => {
  let url = null
  if (payload.role === 'EMedateAdmin') {
    url = urls.todayDetails + '?academic_year=' + payload.session + '&branch=' + payload.branch
  } else {
    url = urls.todayDetails + '?academic_year=' + payload.session
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: TODAY_DETAILS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200 && response.data && response.data.length > 0) {
        // payload.alert.success('Successfully got Billing Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const dailyEMandateDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.dailyDetails + payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: DAILY_DETAILS,
        payload: {
          data: response.data
        }
      })
      // if (response.status === 200) {
      // }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const setCustomerDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.setCustomerDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: SET_CUSTOMER_DETAILS,
          payload: {
            data: response.data
          }
        })
        // payload.alert.success('Successfully Added Customer Details!')
      }
      if (response.status === 200) {
        // payload.alert.success('Branch Name Allready Used !!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const listCustomerDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.setListCustomerDetails + '?branch=' + payload.id, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: LIST_CUSTOMER_DETAILS,
        payload: {
          data: response.data
        }
      })
      // if (response.status === 200) {
      // }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createOrderDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.createOrderDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      console.log('aaa', response.data)
      if (response.status === 201 && response.data) {
        console.log('rrr', response.data)
        dispatch({
          type: CREATE_ORDER_DETAILS,
          payload: {
            data: response.data
          }
        })
      }
      if (response.status === 201) {
        // payload.alert.success('Successfully Added Order Details!')
      }
      if (response.status === 200) {
        // payload.alert.success('First Order Is AllReady Created')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const getCustomerDetails = (payload) => {
  let url = null
  if (payload.role === 'EMedateAdmin') {
    url = urls.getCustumerDetails + '?academic_year=' + payload.session + '&branch=' + payload.branch
  } else {
    url = urls.getCustumerDetails + '?academic_year=' + payload.session
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: GET_CUSTOMER_DETAILS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200 && response.data && response.data.length > 0) {
        // payload.alert.success('Successfully got Customer Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const getOrderDetails = (payload) => {
  let url = null
  if (payload.role === 'EMedateAdmin') {
    url = urls.getOrderDetails + '?academic_year=' + payload.session + '&branch=' + payload.branch
  } else {
    url = urls.getOrderDetails + '?academic_year=' + payload.session
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: GET_ORDER_DETAILS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200 && response.data && response.data.length > 0) {
        // payload.alert.success('Successfully Get Order Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}
// export const orderPayment = (payload) => {
//   return (dispatch) => {
//     dispatch(actionTypes.dataLoading())
//     axios.get(urls.order_payment + '?customer_id=' + payload.customer + '&order_id=' + payload.order, {
//       headers: {
//         Authorization: 'Bearer ' + payload.user
//       }
//     }).then(response => {
//       dispatch({
//         type: ORDER_PAYMENT,
//         payload: {
//           data: response.data
//         }
//       })
//       if (response.status === 200) {
//         payload.alert.success('Successfull!')
//       } else {
//         payload.alert.success('No Record Found!')
//       }
//       dispatch(actionTypes.dataLoaded())
//     }).catch(err => {
//       console.error(err)
      // payload.alert.warning('Something Went Wrong')
//       dispatch(actionTypes.dataLoaded())
//     })
//   }
// }

export const getGenerateSubsequents = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.getGenerateSubsequent + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: GET_SUBSEQUENT_PAYMENT,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200 && response.data && response.data.length > 0) {
        // payload.alert.success('Successfully Subsequent Payment Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const updateCustDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.updateCustDetails, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: UPDATE_CUSTOMER_DETAILS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200) {
        // payload.alert.success('Successfully Updated!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const totalBillingDetails = (payload) => {
  let url = null
  if (payload.role !== 'FinanceAdmin' && payload.role !== 'FinanceAccountant') {
    url = urls.TotalBillingDetails + '?academic_year=' + payload.session + '&branch=' + payload.domain + '&month=' + payload.month
  } else {
    url = urls.TotalBillingDetails + '?month=' + payload.month
  }
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 200 && response.data && response.data.length > 0) {
        dispatch({
          type: TOTAL_BILLING_DETAILS,
          payload: {
            status: response.status,
            data: response.data
          }
        })
        // payload.alert.success('Successfully got Total Billing Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const getDomainNameWithCusId = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.getDomainNameWithCusId + '?academic_year=' + payload.session, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: GET_DOMAIN_NAME_BY_ID,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200 && response.data && response.data.length > 0) {
        // payload.alert.success('Successfully Get Order Details!')
      } else {
        // payload.alert.success('No Record Found!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const updateDomainName = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.updateDomainName, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: UPDATE_DOMAIN_NAME,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200) {
        // payload.alert.success('Successfully Updated!')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const generateSubsequentPayment = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SubsequentPayment, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: SUBSEQUENT_PAYMENT,
        payload: {
          data: response.data
        }
      })
      if (response.status === 201) {
        // payload.alert.success('Payment Successfully !')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        // payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const createLink = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.CreateLink, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      if (response.status === 201) {
        dispatch({
          type: CREATE_LINK,
          payload: {
            data: response.data,
            data1: response.status
          }
        })
        // payload.alert.success('Created Successfully !')
      }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        payload.alert.warning(err.response.data.err_msg)
      } else {
        // payload.alert.warning('Something Went Wrong!')
      }
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const domainDailyBillGenerateStatus = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.DomainDailyBillGenerateStatus, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: DOMAIN_DAILY_BILL_STATUS,
        payload: {
          data: response.data
        }
      })
      if (response.status === 200) {
        // payload.alert.success('Successfully Generated Daily Billing Details!')
      }
      // else {
      //   payload.alert.success('No Record Found!')
      // }
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      console.error(err)
      // payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}
