const env = window.location.host;
const domainSplit = window.location.host.split('.');
let domain_name =
  env.includes('qa') || env.includes('localhost') || env.includes('orchids-stage')
    ? 'olvorchidnaigaon'
    : env.includes('test') || env.includes('orchids-prod')
    ? 'orchids'
    : domainSplit[0];

export { domain_name };
