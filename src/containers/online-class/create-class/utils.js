export const getFormatedTime = (time) => {
  const date = time;
  const dateStr =
    `${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(-2)}:` + `00`;
  return dateStr;
};

export const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
