const dev_url: string = 'http://rsmgmt.ivisecurity.com';
const prod_url: string = 'https://prod.ivisecurity.com';

export const environment = {
  production: true,

  // authUrl: `http://rsmgmt.ivisecurity.com:8543/userDetails`,
  // metadataUrl: `http://rsmgmt.ivisecurity.com:8844/metadata`,
  // commonDownUrl: `http://rsmgmt.ivisecurity.com:8001/common`,
  // sitesUrl: `http://rsmgmt.ivisecurity.com:8943`,
  // incidentsUrl: `http://rsmgmt.ivisecurity.com:8945`,
  // timelapseUrl: `http://rsmgmt.ivisecurity.com:8948`,
  // helpdeskUrl: `http://rsmgmt.ivisecurity.com:8925`,
  // insightsUrl: `http://rsmgmt.ivisecurity.com:8951`,
  // supportUrl: `http://rsmgmt.ivisecurity.com:8927`,
  // sensorUrl: `http://rsmgmt.ivisecurity.com:8946`,
  // adsUrl: `http://rsmgmt.ivisecurity.com:8947`,

    authUrl: `${prod_url}/userDetails`,
  sitesUrl: `${prod_url}/vipsites`,
  metadataUrl: `${prod_url}/metadata`,
  commonDownUrl: `${prod_url}/common`,
  adsUrl: `${prod_url}/proximityAdsMain`,
  rulesUrl: `${prod_url}/proximityAdsRules `,
  insightsUrl: `${prod_url}/insights`,
  timelapseUrl: `${prod_url}/timeLapse`,
  sensorUrl:`${prod_url}/sensors`,
  simsUrl:`${prod_url}/simDevices`,
  faqUrl: `${prod_url}/faq`,
  inventoryUrl: `${prod_url}/inventory`,
  helpdeskUrl: `${prod_url}/supportRequests`,
  genericUrl: `${prod_url}/generic`,
  incidentsUrl: `${prod_url}/guard_monitoring`,


  // authUrl: `https://authivis-rsmgmt.ivisecurity.com/userDetails`,
  // metadataUrl: `https://metadata-rsmgmt.ivisecurity.com/metadata`,
  // commonDownUrl: `https://common-s3-rsmgmt.ivisecurity.com/common`,
  // sitesUrl: `https://vipsites-rsmgmt.ivisecurity.com`,
  // incidentsUrl: `https://alerts-rsmgmt.ivisecurity.com/incidents`,
  // sensorUrl: `https://iot-rsmgmt.ivisecurity.com`,
  // simsUrl:`https://sim-rsmgmt.ivisecurity.com/simDevices`,
  // helpdeskUrl: `https://sup-rsmgmt.ivisecurity.com/supportRequests`,
  // genericUrl: `https://sup-rsmgmt.ivisecurity.com/generic`,
  // insightsUrl: `https://bi-rsmgmt.ivisecurity.com/insights`,
  // adsUrl: `https://prox-rsmgmt.ivisecurity.com`,
  // timelapseUrl: `https://timelapse-rsmgmt.ivisecurity.com`,
};
