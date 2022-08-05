import { useSelector } from 'react-redux';

export function IsV2Checker() {
  return useSelector(
    (state) =>
      state.commonFilterReducer.selectedBranch?.isV2 &&
      (state.commonFilterReducer.selectedVersion === null
        ? true
        : state.commonFilterReducer.selectedVersion)
  );
}
