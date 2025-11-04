// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const dev_url: string = 'https://usstaging.ivisecurity.com';
const local_url: string = 'http://192.168.0.151:3006';
export const environment = {
  // production: false,
  // authUrl: `${dev_url}:8922/userDetails`,
  // commonUrl: `${dev_url}:8844/metadata`,
  // commonDownUrl: `${dev_url}:8001/common`,
  // metadataUrl: `${dev_url}:8844/metadata`,
  // sitesUrl: `${local_url}:3004/vipsites`,
  // incidentsUrl: `${dev_url}:8945/incidents`,
  // helpdeskUrl: `${dev_url}:8925/supportRequests`,
  // insightsUrl: `${dev_url}:8951/insights`,
  // timelapseUrl: `${dev_url}:8948/timelapse`,
  // adsUrl: `${dev_url}:8946/proximityAdsMain`,
  // sensorUrl: `${dev_url}:8947/sensors`,
  // simsUrl:`${dev_url}/simDevices`,

  authUrl: `${dev_url}/userDetails`,
  sitesUrl: `${dev_url}/vipsites`,
  metadataUrl: `${dev_url}/metadata`,
  commonDownUrl: `${dev_url}/common`,
  adsUrl: `${dev_url}/proximityAdsMain`,
  rulesUrl: `${dev_url}/proximityAdsRules `,
  insightsUrl: `${dev_url}/insights`,
  timelapseUrl: `${dev_url}/timeLapse`,
  sensorUrl: `${dev_url}/sensors`,
  simsUrl: `${dev_url}/simDevices`,
  faqUrl: `${dev_url}/faq`,
  inventoryUrl: `${dev_url}/inventory`,
  helpdeskUrl: `${dev_url}/supportRequests`,
  incidentsUrl: `${dev_url}/guard_monitoring`,

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
