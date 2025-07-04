import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoConfigService {

  // baseUrl = 'http://192.168.0.218:4455'
  // baseUrl = 'http://rsmgmt.ivisecurity.com:953';

  constructor(private http: HttpClient) { }

  move(payload: any) {
    let url = `${payload?.url}/v1/move/${payload?.cam}/x/${payload?.x}/y/${payload?.y}/steps/${payload?.steps}`;
    return this.http.put(url, null)
  }

  zoom(payload: any) {
    let url = `${payload?.url}/v1/zoom/${payload?.cam}/x/${payload?.x}/steps/${payload?.steps}`;
    return this.http.put(url, null)
  }

  focus(payload: any) {
    let url = `${payload?.url}/v1/focus/${payload?.cam}/x/${payload?.x}/steps/${payload?.steps}`;
    return this.http.put(url, null)
  }

  home(payload: any) {
    let url = `${payload?.url}/v1/home/for/${payload?.cam}`;
    return this.http.put(url, null)
  }

  createCameraControls(payload: any) {
    // console.log(payload)
    let url = `${environment.sitesUrl}/manageCameraControls/createCameraControls_1_0`;
    let obj = {
      siteId: payload?.siteId,
      deviceId: payload?.unitId,
      cameraId: payload?.cameraId,
      createdBy: 0,
      remarks: "",
      operationName: payload?.operationName,
      callingSystem: 1
    }
    return this.http.post(url, obj)
  }

}
