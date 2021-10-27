import { HIDE_ALERT, SHOW_ALERT } from './alert-types';

const alertReducer = (state, action) => {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
        isShown: true,
        showCloseIcon: action.payload.showCloseIcon,
      };

    case HIDE_ALERT:
      return {
        ...state,
        message: '',
        type: 'success',
        isShown: false,
        showCloseIcon: false,
      };

    default:
      return { ...state };
  }
};

export default alertReducer;
