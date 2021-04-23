import { combineReducers } from 'redux';
import auth from './authReducer';
import roleManagement from './roleManagementReducer';
import userManagement from './userManagementReducer';
import academicMappingReducer from './academic-mapping-reducer';
import teacherHomework from './teacherHomeworkReducer';
import discussionReducer from './discussionForumReducer';
import attendanceReducer from './onlineClassReducer';
// /home/rana/ErpRevamp/erp-revamp-frontend/src/containers/Finance/src/_reducers/academicSession.reducer.js
import commonReducer from '../../../src/containers/Finance/src/components/Finance/store/reducer/common.reducer'
import { academicSession } from '../../../src/containers/Finance/src/_reducers/academicSession.reducer'
// /home/rana/ErpRevamp/erp-revamp-frontend/src/containers/Finance/src/components/Finance/store/reducer/common.reducer.js
import { authentication } from '../../../src/containers/Finance/src/_reducers/authentication.reducer'
// /home/rana/ErpRevamp/erp-revamp-frontend/src/containers/Finance/src/_reducers/authentication.reducer.js
import normalFeeListReducer from '../../../src/containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/store/reducers/normalFeeList.reducer.js'
// /home/rana/ErpRevamp/erp-revamp-frontend/src/containers/Finance/src/components/Finance/CreateFeeType/NormalFeeType/store/reducers/normalFeeList.reducer.js
import finance from '../../../src/containers/Finance/src/components/Finance/store/reducer'
import { alert } from '../../../src/containers/Finance/src/_reducers/alert.reducer'
import { branches } from '../../../src/containers/Finance/src/_reducers/branches.reducer.js'
import expenseMngmtReducer from '../../../src/containers/Finance/src/components/Finance/ExpenseManagement/store/reducer/expenseMngmt.reducer.js'
import inventory from '../../../src/containers/Finance/src/components/Inventory/store/reducer/inventory.reducer.js'
import { gradeMap } from '../../../src/containers/Finance/src/_reducers/gradeMap.reducer.js'
import { sectionMap } from '../../../src/containers/Finance/src/_reducers/sectionMap.reducer.js'
import { subjects } from '../../../src/containers/Finance/src/_reducers/subject.reducer.js'
import createQuestionPaper from './create-question-paper-reducer';
import createAssesment from './create-assesment-reducer';
import assessmentReportReducer from '../reducers/assessmentReportReducer';

export default combineReducers({
  auth,
  roleManagement,
  userManagement,
  academic: academicMappingReducer,
  teacherHomework,
  discussionReducers: discussionReducer,
  attendanceReducers: attendanceReducer,
  common: commonReducer,
  academicSession,
  authentication,
  normalFee: normalFeeListReducer,
  finance,
  alert, 
  branches,
  expenseMngmt: expenseMngmtReducer,
  inventory,
  gradeMap,
  sectionMap,
  subjects,
  createQuestionPaper,
  createAssesment,
  assessmentReportReducer,
});
