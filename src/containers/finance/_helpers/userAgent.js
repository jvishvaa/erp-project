// everything related to browser goes here

export const getOS = () => {
  let OSName = 'Unknown OS'
  if (navigator.userAgent.indexOf('Win') !== -1) OSName = 'Windows'
  if (navigator.userAgent.indexOf('Mac') !== -1) OSName = 'Macintosh'
  if (navigator.userAgent.indexOf('Linux') !== -1) OSName = 'Linux'
  if (navigator.userAgent.indexOf('Android') !== -1) OSName = 'Android'
  if (navigator.userAgent.indexOf('like Mac') !== -1) OSName = 'iOS'
  return OSName
}

export const browserCheck = () => {
  let appName = navigator.appName
  let userAgent = navigator.userAgent
  let temp
  let browserInfo = userAgent.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i)
  // eslint-disable-next-line no-useless-escape
  if (browserInfo && (temp = userAgent.match(/version\/([\.\d]+)/i)) != null) { browserInfo[2] = temp[1] }
  browserInfo = browserInfo ? [browserInfo[1], browserInfo[2]] : [appName, navigator.appVersion, '-?']
  return browserInfo
}
