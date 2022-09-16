import { useSelector } from 'react-redux';

export function IsV2Checker() {
  return useSelector((state) => state.commonFilterReducer.selectedVersion);
}
