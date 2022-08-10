if (
  window.location.href.includes('localhost') ||
  window.location.href.includes('ui-revamp1')
) {
  var X_DTS_HOST = 'dev.olvorchidnaigaon.letseduvate.com';
} else {
  var X_DTS_HOST = window.location.host;
}

export { X_DTS_HOST };
