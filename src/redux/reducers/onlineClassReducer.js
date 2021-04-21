//import { types } from '../actions';
import { types } from "../actions/onlineClassActions";

const initialState = {
  attendance: '',
  date: '2021-04-07T11:41:00',
};

const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ATTENDANCE_LIST:
      return { attendance: action.payload };
    
    default:
      return state;
  }
};

export default attendanceReducer;
