const prod_url: string = 'https://prod.ivisecurity.com';
const local_url: string = 'http://192.168.0.225:8234';


export const environment = {
  production: true,

  // authUrl: `${prod_url}:5002/userDetails`,
  // commonDownUrl: `${prod_url}:5001`,
  // metadataUrl: `${prod_url}:3005`,
  // sitesUrl: `${prod_url}:3004`,
  // incidentsUrl: `${prod_url}:8945`,
  // helpdeskUrl: `${prod_url}:3003`,
  // insightsUrl: `${prod_url}:3006`,
  // timelapseUrl: `${prod_url}:3010`,
  // adsUrl: `${prod_url}:8946`,
  // sensorUrl: `${prod_url}:3011`,
  // simsUrl:`${prod_url}:3012`,
  // faqUrl: `${prod_url}:3008`,

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

  authUrl: `${prod_url}/userDetails`,
  sitesUrl: `${prod_url}/vipsites`,
  metadataUrl: `${prod_url}/metadata`,
  commonDownUrl: `${prod_url}/common`,
  adsUrl: `${prod_url}/proximityAdsMain`,
  rulesUrl: `${prod_url}/proximityAdsRules `,
  insightsUrl: `${prod_url}/insights`,
  timelapseUrl: `${prod_url}/timeLapse`,
  sensorUrl: `${prod_url}/sensors`,
  simsUrl: `${prod_url}/simDevices`,
  faqUrl: `${prod_url}/faq`,
  inventoryUrl: `${prod_url}/inventory`,
  helpdeskUrl: `${prod_url}/supportRequests`,
  incidentsUrl: `${prod_url}/guard_monitoring`,
  event_tags_url: `${prod_url}/events_data`,

  theme: {
    logo: 'assets/themes/ivis_logo_white.png',
    headerLogo: 'assets/themes/ivis_logo_black.png',
    accordianLogo: 'assets/icons/eye.svg',
    activeLogo: 'assets/icons/eye-blue.svg',
    inActiveLogo: 'assets/icons/eye-red.svg',

    detail: {
      address: 'IVIS Security, Inc',
      city: '3945 W Cheyenne Ave #204',
      state: 'North Las Vegas, NV 89032',
      country: 'United States',
      phone: '+1 (844) 438-4847',
      email: 'support@ivisecurity.com',
    }
  }
};
