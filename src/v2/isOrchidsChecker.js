const orchidsLsit = [
  'orchids.letseduvate.com',
  'localhost:3000',
  'dev.olvorchidnaigaon.letseduvate.com',
  'qa.olvorchidnaigaon.letseduvate.com',
];

export function IsOrchidsChecker() {
  return orchidsLsit.includes(window.location.host);
}
