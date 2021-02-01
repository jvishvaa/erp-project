import * as actionTypes from '../../../../store/actions'

const initialState = {
  feeAccToStoreMapping: [],
  fetchActiveInactiveData: null
}

const accToStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STORE_ACC_BRANCH_MAPPING: {
      return {
        ...state,
        feeAccToStoreMapping: action.payload.data
      }
    }
    case actionTypes.ACTIVE_INACTIVE_FEE_ACCOUNTS: {
      console.log('z++++', action.payload.data)
      const accTostore = [...state.feeAccToStoreMapping]
      console.log('AcctoStore: ', accTostore)
      const index = accTostore.findIndex((n) => {
        return n.branch.id === action.payload.data.branch
      })
      console.log('index : ', index)
      const index2 = accTostore[index].store_fee_account.findIndex((n) => {
        return n.id === action.payload.data.fee_account_store
      })
      console.log('index2 : ', index2)
      accTostore[index].store_fee_account[index2].is_active = action.payload.data.is_active
      console.log('AcctoStore after: ', accTostore)
      return {
        ...state,
        feeAccToStoreMapping: accTostore
      }
    }
    case actionTypes.UPDATE_STORE_FEE_ACC_MAP: {
      // const storeAcc = [...state.feeAccToStoreMapping]
      // const index = storeAcc.findIndex(ele => {
      //   return ele.id === action.payload.data.id
      // })
      // storeAcc[index] = { ...action.payload.data }
      // const index = storeAcc.findIndex((n) => {
      //   return n.branch.id === action.payload.data.branch.id
      // })
      // const index2 = storeAcc[index].store_fee_account.findIndex((n) => {
      //   return n.id === action.payload.data.old_fee_account_store
      // })
      // console.log('1st index', index, '2 index', index2)
      // storeAcc[index].store_fee_account[index2].fee_account_name = action.payload.data.store_fee_account.fee_account_name
      return {
        ...state,
        feeAccToStoreMapping: action.payload.data
      }
    }
    case actionTypes.ADD_STORE_FEE_ACCOUNTS: {
      // const addStoreAcc = [...state.feeAccToStoreMapping]
      // if (action.payload.data.id) {
      //   addStoreAcc.unshift(action.payload.data)
      // }
      // const index = addStoreAcc.findIndex((n) => {
      //   return n.branch.id === action.payload.data.branch.id
      // })
      // console.log('index+++', index)
      // if (addStoreAcc[index].branch.id === action.payload.data.branch.id) {
      //   addStoreAcc[index].store_fee_account.unshift(action.payload.data)
      // } else {
      //   addStoreAcc.unshift(action.payload.data)
      // }
      return {
        ...state,
        feeAccToStoreMapping: action.payload.data
      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default accToStoreReducer
