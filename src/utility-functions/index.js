/* eslint-disable import/prefer-default-export */
export const isVideo = (filename) => {
  const inputExt = filename.split('.').pop();

  const videoFileExts = ['mp4', '3gp', 'avi'];

  return videoFileExts.some((ext) => ext.toUpperCase() === inputExt.toUpperCase());
};
export const isAudio = (filename) => {
  const inputExt = filename.split('.').pop();

  const audioFileExts = ['mp3', 'wav', 'aac'];

  return audioFileExts.some((ext) => ext.toUpperCase() === inputExt.toUpperCase());
};
export const generateQueryParamSting = (queryParamObj = {}) => {
  const paramsObj = { ...queryParamObj };
  const createQuery = (params) =>
    params
      .filter((param) => param[1] !== undefined)
      .map((param) => `${param[0]}=${param[1]}`)
      .join('&');
  const query = createQuery(Object.entries(paramsObj));
  return query;
};

export function setValueAndLabel(data = [], labelKey, valueKey) {
  return data.map((item) => {
    const { [labelKey]: labelKeyValue, [valueKey]: valueKeyValue } = item || {};
    return { ...item, label: labelKeyValue, value: valueKeyValue };
  });
}
