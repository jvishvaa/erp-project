import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import store from './redux/store';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { registerServiceWorker } from './components/Firebase/register-sw'

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// Conversion of number to its subsequent string
function numericToWordConversion (num, optionalString = '') {
  let a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
  let b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  if ((num = num.toString()).length > 9) return 'overflow'
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
  if (!n) return 
  let str = ''
  str += (+n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : ''
  str += (+n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : ''
  str += (+n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : ''
  str += (+n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : ''
  str += (n[5] !== 0) ? ((str !== '') ? ' ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + optionalString : ''
  return str
}

// Number.toNumericString(12, 'only') ==> twelve only
Number.toNumericString = numericToWordConversion

// Returns String eg 12/Apr/2019
// eslint-disable-next-line no-extend-native
Date.prototype.withMonthName = function (spliter = '/') {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const date = this
  const newDate = '' + date.getDate() + spliter + monthNames[date.getMonth()] + spliter + date.getFullYear()
  return newDate
}
function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}
// eslint-disable-next-line no-extend-native
Date.prototype.toDateStringWithAMPM = function () {
  const date = this
  const newDate = formatAMPM(date) + ' ' + date.toDateString()
  return newDate
}

registerServiceWorker()
