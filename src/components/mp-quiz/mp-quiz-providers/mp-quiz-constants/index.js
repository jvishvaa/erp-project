import urls from './urls';
import * as socketContants from './socket-event-contants';

let params = {
  online_class_id: 70,
  question_paper: 80,
  lobby_identifier: 907,
  // user_auth_token: userAuthToken,
};
function setParamConstants(paramObj) {
  params = { ...(params || {}), paramObj };
}
const constants = {
  socketContants,
  urls,
  params,
  setParamConstants,
};
export default constants;
