import * as actionTypes from '../../../store/actions'

const initialState = {
  subCategory: []
}

const subCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SUB_CATEGORY: {
      return {
        ...state,
        subCategory: action.payload.data
      }
    }
    case actionTypes.CREATE_SUB_CATEGORY: {
      let data = [...state.subCategory]
      // let datas = [...state.subCategory]
      if (action.payload.data) {
        data.unshift(action.payload.data)
      }
      console.log('data', action.payload.data)
      console.log('data1', action.payload.data1)
      if (action.payload.data1) {
        const index = data.findIndex((val) => (+val.id === +action.payload.data1.id))
        data[index] = action.payload.data1
        console.log('index', index)
      }
      // let updatedData = null
      // action.payload.data ? updatedData = datas : updatedData = data
      return {
        ...state,
        subCategory: data

      }
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default subCategoryReducer
