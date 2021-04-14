import * as actionTypes from '../../../../store/actions/index'

const initialState = {
  feeCollectionList: [],
  status: true,
  transactionId: null,
  ReceiptNo: '',
  studentId: null,
  studentDet: null,
  miscReports: [],
  schoolData: null
}

export const feeCollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MISC_REPORT: {
      console.log('p1+', action.payload.data)
      return {
        ...state,
        miscReports: action.payload.data ? action.payload.data : []
      }
    }
    case actionTypes.FEE_COLLECTION_LIST: {
      return {
        ...state,
        feeCollectionList: action.payload.data
      }
    }
    case actionTypes.PAY_NON_ORCHIDS: {
      return {
        ...state,
        transactionId: action.payload.data.transaction_id,
        status: action.payload.status,
        ReceiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
        // feeCollectionList: []
      }
    }
    case actionTypes.ORCHIDS_STUDNET_PAY: {
      return {
        ...state,
        transactionId: action.payload.data.transaction_id,
        status: action.payload.status,
        ReceiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
        // feeCollectionList: []
      }
    }
    case actionTypes.SAVE_OUTSIDERS: {
      return {
        ...state,
        studentId: action.payload.data && action.payload.data.student ? action.payload.data.student : null
      }
    }
    // case actionTypes.SEND_ALL_PAYMENTS: {
    //   return {
    //     ...state,
    //     transactionId: action.payload.data.transaction_id,
    //     status: action.payload.status,
    //     ReceiptNo: action.payload.data.receipt_number_online ? action.payload.data.receipt_number_online : ''
    //   }
    // }
    case actionTypes.STUDENT_DETAILS: {
      console.log('q+', action.payload.data)
      return {
        ...state,
        studentDet: action.payload.data
      }
    }
    case actionTypes.CANCEL_TRANS: {
      console.log('aa+', action.payload.data)
      let data = [...state.miscReports]
      console.log('data++', data)
      let index = data.findIndex(val => +val.OMSTransaction_ID === +action.payload.data)
      console.log('i', +action.payload.data)
      console.log('index', index)
      data.splice(index, 1)
      return {
        ...state,
        miscReports: data
      }
    }
    case actionTypes.SCHOOL_DETAILS: {
      return {
        ...state,
        schoolData: action.payload.data
      }
    }
    default : {
      return {
        ...state
      }
    }
  }
}

export default feeCollectionReducer
