import * as actionTypes from '../../../store/actions'

const initialState = {
  hasSubjectChoosen: true,
  storeList: [],
  itemsList: [],
  isUniformBought: false,
  isStationaryBought: false,
  isNewStudent: false,
  receiptData: null,
  receiptNumbers: [],
  status: false,
  transactionId: null,
  kitItemQuantity: {},
  kitSubjectList: [],
  language: [],
  updatestu: [],
  orderPaid: [],
  deliveryList: [],
  deliveryAmount: [],
  shippingDetails: [],
  couponDiscount: [],
  subCategoryStore: [],
  walletInfo: []
}

const storeAccountant = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_WALLET_INFO: {
      return {
        ...state,
        walletInfo: action.payload.data
      }
    }
    case actionTypes.HAS_SUBJECT_CHOOSEN: {
      return {
        ...state,
        hasSubjectChoosen: false,
        storeList: []
      }
    }
    case actionTypes.LIST_STORE: {
      let quantity = {}
      action.payload.data.forEach(item => {
        item.quantity.flat().forEach(ele => {
          quantity[ele.id] = (+ele.quantity) + (quantity[ele.id] || 0)
        })
      })
      return {
        ...state,
        storeList: action.payload.data,
        hasSubjectChoosen: true,
        isUniformBought: action.payload.isUniformBought,
        isStationaryBought: action.payload.isStationaryBought,
        isNewStudent: action.payload.isNewStudent,
        kitItemQuantity: quantity,
        deliveryAmount: []
      }
    }
    case actionTypes.LIST_STORE_ITEMS: {
      return {
        ...state,
        itemsList: action.payload.data
      }
    }
    case actionTypes.FETCH_SUB_CATEGORY_STORE: {
      return {
        ...state,
        subCategoryStore: action.payload.data
      }
    }
    case actionTypes.STORE_PAYMENT: {
      const newOrderPaid = [...state.orderPaid]
      if (action.payload.data.uniId) {
        newOrderPaid.includes(action.payload.data.uniId) ? console.log('present already') : newOrderPaid.push({ kit_id: +action.payload.data.uniId, status: true })
      }
      if (action.payload.data.statId) {
        newOrderPaid.includes(action.payload.data.statId) ? console.log('present already') : newOrderPaid.push({ kit_id: +action.payload.data.statId, status: true })
      }
      // const newShippingList = { ...state.shippingDetails }
      // if (action.payload.data && action.payload.data.kitId) {
      //   const index = newShippingList.paid_data.findIndex(ele => {
      //     return +ele.kit === +action.payload.data.kitId
      //   })
      //   const changeObj = { ...newShippingList.paid_data[index] }
      //   changeObj.is_delivery_home = true
      //   newShippingList.paid_data[index] = { ...changeObj }
      // }
      return {
        ...state,
        // receiptData: action.payload.data
        transactionId: action.payload.data.transaction_id,
        status: action.payload.status,
        orderPaid: newOrderPaid,
        walletInfo: []
        // shippingDetails: action.payload.data && action.payload.data.kitId ? newShippingList : { ...state.shippingDetails }
      }
    }
    case actionTypes.STORE_RECEIPT_NUMBERS: {
      return {
        ...state,
        receiptNumbers: action.payload.data
      }
    }
    case actionTypes.FETCH_KIT_SUBJECTS: {
      let a = []
      a = action.payload.data
      a.unshift({ id: 'none', subject_name: 'none' })
      return {
        ...state,
        kitSubjectList: a
      }
    }
    case actionTypes.STUDENT_PROFILE: {
      return {
        ...state,
        language: action.payload.data
      }
    }
    case actionTypes.UPDATE_STU_DETAIL: {
      const studata = state.language
      studata[0].second_lang = action.payload.data.second_lang
      studata[0].third_lang = action.payload.data.third_lang
      return {
        ...state,
        updatestu: action.payload.data,
        language: studata
      }
    }
    case actionTypes.ORDER_PAID: {
      return {
        ...state,
        orderPaid: action.payload.data,
        couponDiscount: []
        // status: false
      }
    }
    case actionTypes.FETCH_DELIVERY_DETAILS: {
      return {
        ...state,
        deliveryList: action.payload.data
      }
    }
    case actionTypes.SEND_DELIVERY_DETAILS: {
      return {
        ...state,
        deliveryList: [action.payload.data]
      }
    }
    case actionTypes.FETCH_DELIVERY_AMOUNT: {
      return {
        ...state,
        deliveryAmount: action.payload.data
      }
    }
    case actionTypes.FETCH_SHIPPING_TRANSACTION: {
      return {
        ...state,
        shippingDetails: action.payload.data,
        deliveryAmount: []
      }
    }
    case actionTypes.FETCH_COUPON_DISCOUNT: {
      return {
        ...state,
        couponDiscount: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default storeAccountant
