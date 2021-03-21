// pass only arrow function
export default (func, delay) => {
  let inDebounce
  return function () {
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(this, args), delay)
  }
}
