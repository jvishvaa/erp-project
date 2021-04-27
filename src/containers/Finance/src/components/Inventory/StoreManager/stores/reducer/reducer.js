import { combineReducers } from 'redux'
import studentUniformReducer from '../../store/reducer/uniform.reducer'
import bulkUniformReducer from '../../BulkUniform/store/reducer/bulkUniform.reducer'
import uniformVedioReducer from '../../UniformVedio/store/reducer/uniformVedio.reducer'
// import uniformChartReducer from '../../UniformChart/store/reducer/uniformChart.reducer'

const storeManager = combineReducers({
  studentUniformReducer: studentUniformReducer,
  bulkUniform: bulkUniformReducer,
  uniformVedio: uniformVedioReducer
  // uniformReducer: uniformChartReducer
})

export default storeManager
