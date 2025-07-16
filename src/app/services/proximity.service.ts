import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProximityService {

  // baseUrl = 'http://usmgmt.iviscloud.net:777/common';
  // commonUrl = 'http://usstaging.ivisecurity.com:8080/common';
  // commonUrl = 'https://common-rsmgmt.ivisecurity.com';

  // addUrl = 'http://usmgmt.iviscloud.net:777/proximityads';
  // addUrl = 'http://usstaging.ivisecurity.com:8080/proximityads';

  constructor(private http: HttpClient) { }

  getMetadata() {
    let url = `${environment.metadataUrl}/getValuesListByType_1_0`;
    return this.http.get(url);
  }

  getMetadataByType(payload: any) {
    let url = `${environment.metadataUrl}/getValuesListByType_1_0`;
    let params = new HttpParams().set('type', payload);
    return this.http.get(url, {params: params});
  }

  modifyAssetForDevice(payload: any) {
    let url = environment.adsUrl + '/modifyAssetForDevice_1_0';
    return this.http.put(url, payload);
  }

  listDevicesBySite(siteId: any) {
    let params = new HttpParams().set('siteId', siteId);
    return this.http.get(environment.adsUrl + '/listDeviceAdsInfo_1_0', {params: params})
  }

  listAdsBySite(payload: any) {
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    return this.http.get(environment.adsUrl + '/listAssets_1_0', {params: params})
  }

  listAdsByDevice(payload: any) {
    let params = new HttpParams();
    if(payload?.site) {
      params = params.set('siteId', payload?.site);
    }
    if(payload?.device) {
      params = params.set('deviceId', payload?.device);
    }
    return this.http.get(environment.adsUrl + '/listAssets_1_0', {params: params})
  }

  createAssetforDevice(payload: any, file: any) {
    let formData: any = new FormData();

    formData.append('file', file);

    let assetData = {
      'deviceId': payload?.asset.deviceId,
      'deviceModeId': payload?.asset.deviceModeId,
      'playOrder': payload?.asset.playOrder,
      'createdBy': payload?.asset.createdBy,
      'name': payload?.asset.name,
      'splRuleId': payload?.asset.splRuleId,
      'fromDate': payload?.asset?.fromDate ? formatDate(payload?.asset?.fromDate, 'yyyy-MM-dd', 'en-us') : formatDate(new Date(), 'yyyy-MM-dd', 'en-us'),
      'toDate': payload?.asset?.toDate ? formatDate(payload?.asset?.toDate, 'yyyy-MM-dd', 'en-us') : '2999-12-31'
    }

    const asset = new Blob([JSON.stringify(assetData)], {
      type: 'application/json',
    });

    formData.append('asset', asset);

    let otherParams = {
      'timeId': payload.nameParams.timeId,
      'tempId': payload.nameParams.tempId,
      'maleKids': payload.nameParams.maleKids,
      'femaleKids': payload.nameParams.femaleKids,
      'maleYouth': payload.nameParams.maleYouth,
      'femaleYouth': payload.nameParams.femaleYouth,
      'maleAdults': payload.nameParams.maleAdults,
      'femaleAdults': payload.nameParams.femaleAdults,
      'vehicles': payload.nameParams.vehicles ? payload.nameParams.vehicles : 0,
      'persons': payload.nameParams.persons ? payload.nameParams.persons : 0
    }

    const nameParams = new Blob([JSON.stringify(otherParams)], {
      type: 'application/json',
    });

    formData.append('nameParams', nameParams);

    return this.http.post(environment.adsUrl + '/createAssetforDevice_1_0', formData);
  }

  updateAssetStatus(id: any, payload: any) {
    let myObj = {
      'id': id,
      'status': payload.status,
      'modifiedBy': payload.modifiedBy
    }

    return this.http.put(environment.adsUrl + '/updateAssetStatus_1_0', myObj);
  }

  updateDeviceMode(payload: any) {
    return this.http.put(environment.adsUrl + '/updateDeviceAdsInfo_1_0', payload);
  }


  // simCardsAPIS
  // baseUrl1 = 'http://usstaging.ivisecurity.com:950';

  addSimCardDetails(payload:any) {
    let url = environment.simsUrl + '/addSimCardDetails_1_0'
    return this.http.post(url,payload);
  }

  getSimDetailsForSiteId(payload?:any) {
    let url = environment.simsUrl + '/getSimDetailsForSiteId_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    return this.http.get(url,{params:params});
  }

  deviceSimStats(payload:any) {
    let url = environment.simsUrl + '/getSpeedDetailsForSim_1_0'
    let params = new HttpParams();
    if(payload?.simId) {
      params = params.set('simId', payload?.simId);
    }
    return this.http.get(url,{params:params});
  }

  updateSimDetailsForSim(payload:any) {
     let url = environment.simsUrl + '/updateSimDetailsForSim_1_0';
    return this.http.put(url, payload);
  }

  getCentralBox(payload:any) {
    let url = `${environment.sitesUrl}/${payload.siteId}`
    return this.http.get(url);
  }


}
