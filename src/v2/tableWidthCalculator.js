export function tableWidthCalculator(width) {
  if (window.innerWidth < 768) {
    return width - 10;
  }
  return width;
}
