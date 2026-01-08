import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  downloadFile(payload: any) {
    let url = 'http://usstaging.ivisecurity.com:8080/common/downloadFile_1_0';
    let params = new HttpParams();
    params = params.set('assetName', 'BarbeePharmacySuspiciousIncident.mp4');
    params = params.set('requestName', 'incidents');
    return this.http.get(url, {params: params});
  }

  public getSites(): any {
    // let url = `http://54.92.215.87:945/incidentSitesList_1_0`;
    let url = `${environment.sitesUrl}/listSites_1_0`;
    return this.http.get(url);
  }

  camerasListForSites(payload: any) {
    let url = `${environment.sitesUrl}/getCamerasForSiteId_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }


  getTags() {
    let url = `${environment.incidentsUrl}/List_1_0/actionTag`;
    return this.http.get(url);
  }

  incidentList(payload?: any) {
    // let url = `${environment.incidentsUrl}/incidentList_1_0`;

    let url = `${environment.event_tags_url}/getEventList_1_0`;

    

    let params = new HttpParams();

    var user = this.storageService.getEncrData('user');
    if(user) {
      params = params.set('userId', user.UserId);
    }
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.objectName) {
      params = params.set('objectName', payload?.objectName);
    }
    if(payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId);
    }
    if(payload?.actionTag) {
      params = params.set('actionTag', payload?.actionTag);
    }
    if(payload?.fromDate) {
      let x = payload?.fromDate;
      params = params.set('fromDate', `${x.year}-${x.month}-${x.day}`);
    }
    if(payload?.toDate) {
      let x = payload?.toDate;
      params = params.set('toDate', `${x.year}-${x.month}-${x.day}`);
    }

     if(payload?.pageSize) {
      params = params.set('pageSize', payload.pageSize);
    }else {
      params = params.set('pageSize', 10);
    }
    if(payload?.page) {
      params = params.set('page', payload.page);
    } else {
      params = params.set('page', 1);
    }

    params = params.set('callingSystemDetail','portal');

    return this.http.get(url, {params: params});
  }



  createIncident(payload: any, file: any) {
    let url = `${environment.incidentsUrl}/createIncident_1_0`;
    let formData = new FormData();
    let x = payload.eventFromTime;
    let y = payload.eventToTime;
    let frmTime = `${x.month}-${x.day}-${x.year}`;
    let tTime = `${y.month}-${y.day}-${y.year}`;

    formData.append('requestName', 'incidents');
    formData.append('assetName', file?.name);
    formData.append("assetFile",  file);
    formData.append("siteId",  payload?.siteId);
    formData.append("objectName",  payload?.objectName);
    formData.append("cameraId",  payload?.cameraId);
    formData.append("eventTag",  payload?.eventTag);
    formData.append("eventFromTime",  `${frmTime}-${payload?.fromTime}`);
    formData.append("eventToTime",  `${tTime}-${payload?.toTime}`);
    formData.append("actionTag",  payload?.actionTag);
    formData.append("createdBy",  payload?.createdBy);
    formData.append("remarks",  payload?.remarks);
    return this.http.post(url, formData);
  }

  incidentsDataToExcel(payload: any) {
    let url = `http://192.168.0.237:8005/incidentsDataToExcel`;
    let params = new HttpParams();

    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.fromDate) {
      let x = payload?.fromDate;
      params = params.set('fromDate', `${x.year}-${x.month}-${x.day}`);
    }
    if(payload?.toDate) {
      let x = payload?.toDate;
      params = params.set('toDate', `${x.year}-${x.month}-${x.day}`);
    }
    return this.http.get(url, {params: params});
  }



  //incidents
  listTimeLapseVideos(payload?: any) {
    let url = `${environment.timelapseUrl}/listTimeLapseVideos_1_0`;
    let params = new HttpParams();
    if(payload?.siteId || payload?.siteId) {
      params = params.set('siteId', payload?.siteId ? payload?.siteId : payload?.siteId)
    }
    if(payload?.active) {
      params = params.set('active', payload?.active)
    }
    if(payload?.cameraId) {
      params = params.set('cameraId', payload?.cameraId)
    }
    if(payload?.fromDate) {
      let x = payload?.fromDate;
      params = params.set('fromDate', `${x.year}-${x.month}-${x.day}`);
    }
    if(payload?.toDate) {
      let x = payload?.toDate;
      params = params.set('toDate', `${x.year}-${x.month}-${x.day}`);
    }
    return this.http.get(url, {params: params});
  }


  // sensorUrl: any = 'http://192.168.0.169:1234';
  // sensorUrl: any = 'http://usstaging.ivisecurity.com:947';

  listSensorDevices(payload?:any) {
     let url = environment.sensorUrl + '/ListSensorDevices_1_0'
     let params = new HttpParams();
     // if(payload?.siteId) {
       params = params.set('siteId', payload?.siteId)
     // }
     return this.http.get(url, {params: params});
  }

  listSensorData(payload?: any) {
    let url = environment.sensorUrl + '/listSensorDataForSiteId_1_0'
    // let url = `${environment.sensorUrl}/listSensorData_1_0`;
    let params = new HttpParams();
    // if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    // }
    if(payload?.zoneId) {
      params = params.set('zoneId', payload?.zoneId)
    }
    if(payload?.sensorDeviceId) {
      params = params.set('sensorDeviceId', payload?.sensorDeviceId)
    }
    if(payload?.sensortype) {
      params = params.set('sensortype', payload?.sensortype)
    }
    return this.http.get(url, {params: params});
  }

  listZonesForSiteId(payload?: any) {
    let url = `${environment.sensorUrl}/listZonesForSiteId_1_0`;
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload.siteId)
    }
    return this.http.get(url, {params: params});
  }

  listSensorTypesForSiteId(payload?: any) {
    let url = `${environment.sensorUrl}/listSensorTypesForSiteId_1_0`;
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload.siteId)
    }
    return this.http.get(url, {params: params});
  }

  getHealth(payload?: any): Observable<any> {
    let url = environment.sitesUrl + '/generateDeviceHealthstats_2_0';
    let user = this.storageService.getEncrData('user');
    let params = new HttpParams();
    if(user) {
      params = params.set('user_name', user.UserName);
    }
    if(payload?.siteId) {
      params = params.set('site_id', payload.siteId);
    }
    if(payload?.time) {
      params = params.set('time', payload.time);
    }
    if(payload?.status) {
      params = params.set('status', payload.status);
    }
    return this.http.get(url, {params: params});
  }

  downtimesForDeviceId(payload?: any): Observable<any> {
    let url = environment.sitesUrl + '/downtimesForDeviceIdandDuration';
    let params = new HttpParams();
    // if(payload?.siteId) {
    //   params = params.set('site_id', payload.siteId);
    // }
    if(payload?.deviceId) {
      params = params.set('device_id', payload.deviceId);
    }
    if(payload?.days && payload?.days != 'All') {
      params = params.set('days', payload.days);
    }
    return this.http.get(url, {params: params});
  }

  nvrList(payload: any) {
    let url = `${environment.incidentsUrl}/NVRList_1_0`;
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    return this.http.get(url, {params: params});
  }

  updateNVRDetails(payload: any) {
    let url = `${environment.incidentsUrl}/updateNVRDetails_1_0/${payload?.id}`;
    return this.http.put(url, payload);
  }



  getDetailsForVideoOrUrl(payload: any) {
    let url = environment.sitesUrl + "/getDetailsForVideoOrUrl_1_0";
    let formData = new FormData();
    if(payload.rtspUrl) {
      formData.append("rtspUrl", payload.rtspUrl);
    }
    if(payload.file) {
      formData.append("file", payload.file);
    }
    return this.http.post(url, formData);
  }

  getImageToDrawPolygon_1_0(payload: any) {
    let url = environment.sitesUrl + `/getImageToDrawPolygon_1_0/${payload}`;
    return this.http.get(url);
  }

}
