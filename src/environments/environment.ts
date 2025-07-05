// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const dev_url: string = 'https://usstaging.ivisecurity.com';
export const environment = {
  production: false,

  // authUrl: `${dev_url}:8922/userDetails`,
  // commonUrl: `${dev_url}:8844/metadata`,
  // commonDownUrl: `${dev_url}:8001/common`,
  // sitesUrl: `${dev_url}:8943`,
  // incidentsUrl: `${dev_url}:8945`,
  // helpdeskUrl: `${dev_url}:8925`,
  // insightsUrl: `${dev_url}:8951`,
  // timelapseUrl: `${dev_url}:8948`,
  // adsUrl: `${dev_url}:8946`,
  // sensorUrl: `${dev_url}:8947`,

  authUrl: `${dev_url}/userDetails`,
  sitesUrl: `${dev_url}/vipsites`,
  metadataUrl: `${dev_url}/metadata`,
  adsUrl: `${dev_url}/proximityAdsMain`,
  rulesUrl: `${dev_url}/proximityAdsRules `,
  insightsUrl: `${dev_url}/insights`,
  timelapseUrl: `${dev_url}/timelapse`,
  sensorUrl:`${dev_url}/sensors`,
  faqUrl: `${dev_url}/faq`,
  inventoryUrl: `${dev_url}/inventory`,
  // genericUrl: `${dev_url}/generic`,
  helpdeskUrl: `${dev_url}/supportRequests`,
  commonDownUrl: `${dev_url}/common`,
  incidentsUrl: `${dev_url}/incidents`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
