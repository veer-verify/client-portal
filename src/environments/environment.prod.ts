const dev_url: string = 'http://rsmgmt.ivisecurity.com';

export const environment = {
  production: true,

  authUrl: `${dev_url}/userDetails`,
  sitesUrl: `${dev_url}/vipsites`,
  metadataUrl: `${dev_url}/metadata`,
  commonDownUrl: `${dev_url}/common`,
  adsUrl: `${dev_url}/proximityAdsMain`,
  rulesUrl: `${dev_url}/proximityAdsRules `,
  insightsUrl: `${dev_url}/insights`,
  timelapseUrl: `${dev_url}/timeLapse`,
  sensorUrl:`${dev_url}/sensors`,
  simsUrl:`${dev_url}/simDevices`,
  faqUrl: `${dev_url}/faq`,
  inventoryUrl: `${dev_url}/inventory`,
  helpdeskUrl: `${dev_url}/supportRequests`,
  incidentsUrl: `${dev_url}/guard_monitoring`,


  // authUrl: `https://authivis-rsmgmt.ivisecurity.com/userDetails`,
  // metadataUrl: `https://metadata-rsmgmt.ivisecurity.com/metadata`,
  // commonDownUrl: `https://common-s3-rsmgmt.ivisecurity.com/common`,
  // sitesUrl: `https://vipsites-rsmgmt.ivisecurity.com/vipsites`,
  // incidentsUrl: `https://alerts-rsmgmt.ivisecurity.com/incidents`,
  // sensorUrl: `https://iot-rsmgmt.ivisecurity.com/sensors`,
  // simsUrl:`https://sim-rsmgmt.ivisecurity.com/simDevices/simDevices`,
  // helpdeskUrl: `https://sup-rsmgmt.ivisecurity.com/supportRequests`,
  // insightsUrl: `https://bi-rsmgmt.ivisecurity.com/insights`,
  // adsUrl: `https://prox-rsmgmt.ivisecurity.com/proximityAdsMain`,
  // timelapseUrl: `https://timelapse-rsmgmt.ivisecurity.com/timeLapse`,
};
