import * as actionTypes from '../../../../store/actions'
// import { VideoLabel } from '@material-ui/icons'

const initialState = {
  domainNames: [],
  domainDetails: [],
  domainAmountDetails: [],
  dailyDetails: [],
  todayDetails: [],
  customerDetails: [],
  listCustomerDetails: [],
  createOrderrDetails: [],
  custDetails: [],
  getOrderDetails: [],
  getSubsequentPayment: [],
  updatedCusData: [],
  // payment: [],
  getDomainNameWithCusId: [],
  totalBillingDetails: [],
  updatedDomainName: [],
  createLinkStatus: null,
  domainDailyBillStatus: []
}

const eMandateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST_DOMAIN_NAME: {
      return {
        ...state,
        domainNames: action.payload.data
      }
    }
    case actionTypes.CREATE_DOMAIN_NAME: {
      let data = state.domainNames
      data.unshift(action.payload.data)
      return {
        ...state,
        domainDetails: action.payload.data,
        domainNames: data
      }
    }
    case actionTypes.SET_DOMAIN_DETAILS: {
      let data = state.todayDetails
      // let index = data.map((val) => val.id).findIndex((res) => res === action.payload.id)
      // console.log('index', index)
      // data[index] = [...action.payload.data]
      let index = data.findIndex((val) => +val.id === +action.payload.data.id)
      console.log('payData', data)
      if (index !== -1) {
        data[index] = { ...action.payload.data }
      } else {
        data.unshift(action.payload.data)
      }
      return {
        ...state,
        domainAmountDetails: action.payload.data,
        todayDetails: data
      }
    }
    case actionTypes.TODAY_DETAILS: {
      return {
        ...state,
        todayDetails: action.payload.data
      }
    }
    case actionTypes.DAILY_DETAILS: {
      return {
        ...state,
        dailyDetails: action.payload.data
      }
    }
    case actionTypes.SET_CUSTOMER_DETAILS: {
      let data = state.custDetails
      console.log('saf', action.payload.data)
      console.log('data', data)
      data.unshift(action.payload.data)
      console.log('data1', data)
      return {
        ...state,
        customerDetails: action.payload.data,
        custDetails: data
      }
    }
    case actionTypes.LIST_CUSTOMER_DETAILS: {
      return {
        ...state,
        listCustomerDetails: action.payload.data
      }
    }
    case actionTypes.CREATE_ORDER_DETAILS: {
      let data = state.getOrderDetails
      console.log('zzz', data)
      console.log('ppp', action.payload.data)
      data.unshift(action.payload.data)
      console.log('zzz', data)
      console.log()
      return {
        ...state,
        createOrderrDetails: action.payload.data,
        getOrderDetails: data
      }
    }
    case actionTypes.GET_CUSTOMER_DETAILS: {
      return {
        ...state,
        custDetails: action.payload.data
      }
    }
    case actionTypes.GET_ORDER_DETAILS: {
      return {
        ...state,
        getOrderDetails: action.payload.data
      }
    }
    case actionTypes.GET_SUBSEQUENT_PAYMENT: {
      // console.log(action.payload.data)
      return {
        ...state,
        getSubsequentPayment: action.payload.data
      }
    }
    case actionTypes.UPDATE_CUSTOMER_DETAILS: {
      let data = state.custDetails
      let index = data.findIndex((val) => +val.id === +action.payload.data.id)
      if (index !== -1) {
        data[index] = { ...action.payload.data }
      }
      return {
        ...state,
        updatedCusData: action.payload.data,
        custDetails: data
      }
    }
    // case actionTypes.ORDER_PAYMENT: {
    //   console.log('url', action.payload.data)
    //   return {
    //     ...state,
    //     payment: action.payload.data
    //   }
    // }
    case actionTypes.GET_DOMAIN_NAME_BY_ID: {
      return {
        ...state,
        getDomainNameWithCusId: action.payload.data
      }
    }
    case actionTypes.TOTAL_BILLING_DETAILS: {
      console.log('url', action.payload.data)
      let data = null
      if (+action.payload.status === 200) {
        data = action.payload.data
      } else {
        data = []
      }
      return {
        ...state,
        totalBillingDetails: data
      }
    }
    case actionTypes.UPDATE_DOMAIN_NAME: {
      let data = state.domainNames
      let index = data.findIndex((val) => +val.id === +action.payload.data.id)
      console.log('payData', data)
      if (index !== -1) {
        data[index] = { ...action.payload.data }
      }
      console.log('url', action.payload.data)
      return {
        ...state,
        updatedDomainName: action.payload.data,
        domainNames: data
      }
    }
    case actionTypes.CREATE_LINK: {
      return {
        ...state,
        createLinkStatus: action.payload.data1
      }
    }
    case actionTypes.DOMAIN_DAILY_BILL_STATUS: {
      return {
        ...state,
        domainDailyBillStatus: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default eMandateReducer
