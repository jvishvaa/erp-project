import moment from 'moment'

export function secondsToTime (givenSeconds, includeHour = false) {
  const dateObj = new Date(givenSeconds * 1000)
  const hours = dateObj.getUTCHours()
  const minutes = dateObj.getUTCMinutes()
  const seconds = dateObj.getSeconds()

  let timeString
  if (+hours === 0 && !includeHour) {
    timeString = minutes.toString().padStart(2, '0') +
                ':' + seconds.toString().padStart(2, '0')
  } else {
    timeString = hours.toString().padStart(2, '0') +
                ':' + minutes.toString().padStart(2, '0') +
                ':' + seconds.toString().padStart(2, '0')
  }
  return timeString
}

function convertTo24Hour (time) {
  var hours = parseInt(time.substr(0, 2))
  if (time.indexOf('am') !== -1 && hours === 12) {
    time = time.replace('12', '0')
  }
  if (time.indexOf('pm') !== -1 && hours < 12) {
    time = time.replace(hours, (hours + 12))
  }
  return time.replace(/(am|pm)/, '')
}

const getHoursAndMinutes = (date) => {
  const hourAndMinute = convertTo24Hour(moment(date).format('hh:mm:ss a')).split(':')
  return [hourAndMinute[0], hourAndMinute[1]]
}

export const getSparseDate = (inputDate = new Date()) => {
  const selectedDay = new Date(inputDate)
  return [
    selectedDay.getFullYear(),
    selectedDay.getMonth() + 1,
    selectedDay.getDate(),
    getHoursAndMinutes(inputDate)[0] * 1,
    getHoursAndMinutes(inputDate)[1] * 1,
    selectedDay.getSeconds()
  ]
}

export const getParsedDate = (inputDate = new Date()) => {
  const selectedDay = new Date(inputDate)
  return [
    selectedDay.getFullYear(),
    selectedDay.getMonth() + 1,
    selectedDay.getDate(),
    selectedDay.getHours(),
    selectedDay.getMinutes(),
    selectedDay.getSeconds()
  ]
}

export const getFormattedDate = (year, month, date) => {
  const monthStr = month.toString().padStart(2, 0)
  const dateStr = date.toString().padStart(2, 0)
  return `${year}-${monthStr}-${dateStr}`
}

export const getFormattedHrsMnts = (hours, minutes) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
