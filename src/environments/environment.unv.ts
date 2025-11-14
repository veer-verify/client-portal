// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const base_url: string = 'https://usstaging.ivisecurity.com';
export const environment = {

  authUrl: `${base_url}/userDetails`,
  sitesUrl: `${base_url}/vipsites`,
  metadataUrl: `${base_url}/metadata`,
  commonDownUrl: `${base_url}/common`,
  adsUrl: `${base_url}/proximityAdsMain`,
  rulesUrl: `${base_url}/proximityAdsRules `,
  insightsUrl: `${base_url}/insights`,
  timelapseUrl: `${base_url}/timeLapse`,
  sensorUrl: `${base_url}/sensors`,
  simsUrl: `${base_url}/simDevices`,
  faqUrl: `${base_url}/faq`,
  inventoryUrl: `${base_url}/inventory`,
  helpdeskUrl: `${base_url}/supportRequests`,
  incidentsUrl: `${base_url}/guard_monitoring`,



  theme: {
    logo: 'assets/themes/unv_logo_white.png',
    headerLogo: 'assets/themes/unv_logo_blue.png',
    accordianLogo: 'assets/themes/unv_icon_white.png',
    activeLogo: 'assets/themes/unv_logo_blue.png',
    inActiveLogo: 'assets/themes/unv_logo_blue.png',

    detail: {
      address: 'SadguruVilla - 123/128',
      city: 'Gorai, Borivali west',
      state: 'Mumbai MH - 400091',
      country: 'INDIA',
      phone: '(+91)7490009174)',
      email: 'sales@uneeviu.com',
    }
  }
};
