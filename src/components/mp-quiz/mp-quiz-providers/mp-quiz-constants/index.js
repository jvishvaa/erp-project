import urls from './urls';
import * as socketContants from './socket-event-contants';

let params = null;
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
