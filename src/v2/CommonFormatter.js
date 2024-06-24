export const NumberFormatter = (number) => {
  return Intl.NumberFormat('en-IN').format(Math.round(number));
};
