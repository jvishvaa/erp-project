export const getFormatedTime = (time) => {
  const date = time;
  const dateStr =
    `${`00${date.getHours()}`.slice(-2)}:${`00${date.getMinutes()}`.slice(-2)}:` + `00`;
  return dateStr;
};
