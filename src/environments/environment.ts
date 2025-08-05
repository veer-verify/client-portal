// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const dev_url: string = 'http://usstaging.ivisecurity.com';
// const local_url: string = 'http://192.168.0.180';
export const environment = {
  production: false,

  // authUrl: `${dev_url}:8922/userDetails`,
  // commonUrl: `${dev_url}:8844/metadata`,
  // commonDownUrl: `${dev_url}:8001/common`,
  // metadataUrl: `${dev_url}:8844/metadata`,
  // sitesUrl: `${dev_url}:8943/vipsites`,
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
  sensorUrl:`${dev_url}/sensors`,
  simsUrl:`${dev_url}/simDevices`,
  faqUrl: `${dev_url}/faq`,
  inventoryUrl: `${dev_url}/inventory`,
  helpdeskUrl: `${dev_url}/supportRequests`,
  incidentsUrl: `${dev_url}/guard_monitoring`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
