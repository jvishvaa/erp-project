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
