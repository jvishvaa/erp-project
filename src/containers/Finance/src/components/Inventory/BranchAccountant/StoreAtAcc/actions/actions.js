import axios from 'axios'
import { urls } from '../../../../../urls'

import * as actionTypes from '../../../../Finance/store/actions/actions'

// action-types
export const IS_NEW_STUDENT = 'IS_NEW_STUDENT'
export const LIST_STORE = 'LIST_STORE'
export const SUBMIT_LANGUAGE = 'SUBMIT_LANGUAGE'
export const LIST_STORE_ITEMS = 'LIST_STORE_ITEMS'
export const HAS_SUBJECT_CHOOSEN = 'HAS_SUBJECT_CHOOSEN'
export const STORE_PAYMENT = 'STORE_PAYMENT'
export const STORE_RECEIPT_NUMBERS = 'STORE_RECEIPT_NUMBERS'
export const FETCH_KIT_SUBJECTS = 'FETCH_KIT_SUBJECTS'
export const STUDENT_PROFILE = 'STUDENT_PROFILE'
export const UPDATE_STU_DETAIL = 'UPDATE_STU_DETAIL'
export const ORDER_PAID = 'ORDER_PAID'
export const FETCH_DELIVERY_DETAILS = 'FETCH_DELIVERY_DETAILS'
export const SEND_DELIVERY_DETAILS = 'SEND_DELIVERY_DETAILS'
export const FETCH_DELIVERY_AMOUNT = 'FETCH_DELIVERY_AMOUNT'
export const FETCH_SHIPPING_TRANSACTION = 'FETCH_SHIPPING_TRANSACTION'
export const FETCH_COUPON_DISCOUNT = 'FETCH_COUPON_DISCOUNT'
export const FETCH_SUB_CATEGORY_STORE = 'FETCH_SUB_CATEGORY_STORE'
export const FETCH_WALLET_INFO = 'FETCH_WALLET_INFO'
// action-creators

export const fetchWalletInfo = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.WalletInfo + '?academic_year=' + payload.session + '&student=' + payload.erp, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        dispatch({
          type: FETCH_WALLET_INFO,
          payload: {
            data: response.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      }).catch(err => {
        dispatch(actionTypes.dataLoaded())
        if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
          payload.alert.warning(err.response.data.err_msg)
        } else {
          payload.alert.warning('Something Went Wrong!')
        }
        console.log(err)
      })
  }
}

export const fetchSubCategoryStore = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.FetchSubcategoryStore + '?academic_year=' + payload.session + '&erp_code=' + payload.erp, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
      .then(res => {
        dispatch({
          type: FETCH_SUB_CATEGORY_STORE,
          payload: {
            data: res.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })
      .catch((error) => {
        payload.alert.error('Something Went Wrong')
        console.log(error)
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const subjectChoosen = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.ListStudentKits + '?erp=' + payload.erp + '&academic_year=' + payload.session + '&role=' + payload.role, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      }).then(response => {
        if (!response.data || response.data[0].status === false) {
          dispatch({
            type: HAS_SUBJECT_CHOOSEN
          })
          dispatch(actionTypes.dataLoaded())
        } else {
          axios.get(`${urls.CheckKit}?erp=${payload.erp}`, {
            headers: {
              Authorization: 'Bearer ' + payload.user
            }
          }).then(res => {
            if (res.data.length === 0) {
              payload.alert.warning('Kit Not Found!')
            }
            console.log(res)
            dispatch({
              type: LIST_STORE,
              payload: {
                data: response.data,
                isUniformBought: res.data.has_uniform_kit,
                isStationaryBought: res.data.has_book_kit,
                isNewStudent: res.data.is_new_student
              }
            })
            dispatch(actionTypes.dataLoaded())
          })
        }
      }).catch(err => {
        console.log(err)
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const submitLanguage = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    const header = {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }
    let newURL = null
    if (!payload.secondLangId && !payload.thirdLangId) {
      newURL = urls.ListStudentKits + '?second=' + payload.secondLangId + '&third=' + payload.thirdLangId + '&erp=' + payload.erp + '&no_subjects=' + 1 + '&academic_year=' + payload.sessionYear + '&role=' + payload.role
    } else {
      newURL = urls.ListStudentKits + '?second=' + payload.secondLangId + '&third=' + payload.thirdLangId + '&erp=' + payload.erp + '&academic_year=' + payload.sessionYear + '&role=' + payload.role
    }
    axios.all([
      axios.get(newURL, header),
      axios.get(`${urls.CheckKit}?erp=${payload.erp}`, header)
    ]).then(axios.spread((kits, bought) => {
      if (kits.data.length === 0) {
        payload.alert.warning('Kit Not Found!')
      }
      dispatch({
        type: LIST_STORE,
        payload: {
          data: kits.data,
          isUniformBought: bought.data.has_uniform_kit,
          isStationaryBought: bought.data.has_book_kit,
          isNewStudent: bought.data.is_new_student
        }
      })
      dispatch(actionTypes.dataLoaded())
    })).catch(err => {
      console.log(err)
      payload.alert.warning('Something Went Wrong')
      dispatch(actionTypes.dataLoaded())
    })
  }
}

export const listStoreItemsAccountant = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(urls.ListStoreItems, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
      .then(res => {
        dispatch({
          type: LIST_STORE_ITEMS,
          payload: {
            data: res.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })
      .catch((error) => {
        payload.alert.error('Something Went Wrong')
        console.log("Error: Couldn't fetch data from " + urls.FeeStructureDefault + error)
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const storePayment = (payload) => {
  // WalletPaymentOne StorePaymentAcc
  let storeUrl = null
  if (payload.data && payload.data.payment_mode === 7) {
    storeUrl = urls.Eswipe
  } else {
    storeUrl = urls.StorePaymentAcc
  }
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios
      .post(storeUrl, payload.data, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
      .then(res => {
        console.log('--------RES------', res)
        if (+res.status === 201) {
          // payload.alert.success('Payment Successful')
          dispatch({
            type: STORE_PAYMENT,
            payload: {
              data: res.data,
              status: true,
              uniId: payload.data.uniform && payload.data.uniform.uniform_id,
              statId: payload.data.stationary && payload.data.stationary.stationary_id,
              kitId: payload.data && payload.data.delivery_data_kit_id ? payload.data.delivery_data_kit_id : null
            }
          })
        }
        dispatch(actionTypes.dataLoaded())
      })
      .catch((error) => {
        // payload.alert.error('Something Went Wrong')
        console.log("Error: Couldn't fetch data from " + urls.FeeStructureDefault + error)
        dispatch(actionTypes.dataLoaded())
      })
  }
}

export const storeReceiptNumbers = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ReceiprRangeMsg + '?academic_year=' + payload.session + '&erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }

    }).then(response => {
      dispatch({
        type: STORE_RECEIPT_NUMBERS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.warning('Unable To Load Receipt No.')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
// jdjdhj
export const fetchKitSubjects = (payload) => {
  return dispatch => {
    dispatch(actionTypes.dataLoading())
    axios
      .get(urls.SubjectStoreUrl + '?academic_year=' + payload.session + '&erp=' + payload.erp + '&role=' + payload.role, {
        headers: {
          Authorization: 'Bearer ' + payload.user
        }
      })
      .then(res => {
        dispatch({
          type: FETCH_KIT_SUBJECTS,
          payload: {
            data: res.data
          }
        })
        dispatch(actionTypes.dataLoaded())
      })
      .catch((error) => {
        payload.alert.error('Something Went Wrong')
        console.log(error)
        dispatch(actionTypes.dataLoaded())
      })
  }
}
export const fetchStuProfile = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(`${urls.StudentInfo}?erp_code=${payload.erp}&academic_year=${payload.session}`, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: STUDENT_PROFILE,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const updateStudentProfile = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.put(urls.UpdateStudentData, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: UPDATE_STU_DETAIL,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
export const orderPaid = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.OrderPaid + '?academic_year=' + payload.session + '&erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: ORDER_PAID,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchDeliveryDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.DeliveryAddress + '?erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_DELIVERY_DETAILS,
        payload: {
          data: response.data
        }
      })
      // dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.error('Unable To Load delivery details!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const sendDeliveryDetails = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.post(urls.SendDeliveryAddress, payload.data, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      payload.alert.success('Saved!')
      dispatch({
        type: SEND_DELIVERY_DETAILS,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      // payload.alert.error('Unable To save delivery details!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchDeliveryAmount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.DeliveryAmount + '?erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_DELIVERY_AMOUNT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.error('Unable To delivery details!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchShippingTransaction = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.ShippingData + '?erp=' + payload.erp, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_SHIPPING_TRANSACTION,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.error('Unable To delivery details!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}

export const fetchCouponDiscount = (payload) => {
  return (dispatch) => {
    dispatch(actionTypes.dataLoading())
    axios.get(urls.CouponGetDiscount + '?erp=' + payload.erp + '&academic_year=' + payload.session + '&kit=' + payload.kit, {
      headers: {
        Authorization: 'Bearer ' + payload.user
      }
    }).then(response => {
      dispatch({
        type: FETCH_COUPON_DISCOUNT,
        payload: {
          data: response.data
        }
      })
      dispatch(actionTypes.dataLoaded())
    }).catch(err => {
      payload.alert.error('Unable fetch discount details!')
      dispatch(actionTypes.dataLoaded())
      console.log(err)
    })
  }
}
