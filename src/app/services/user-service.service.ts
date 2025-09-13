import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  // baseUrl = 'http://192.168.0.126:1111';
  baseUrl = "http://usstaging.ivisecurity.com:1111";

  uploadFile(payload: any, formId: any) {
    let url = `${this.baseUrl}/installationForm/uploadFile_1_0`;
    let formData = new FormData();
    formData.append('assetFile', payload);
    formData.append('requestName', 'incidents');
    formData.append('assetName', payload?.name);
    formData.append('formId', formId)
    return this.http.post(url, formData);
  }

  questionnaireList(type: number) {
    let url = `${this.baseUrl}/installationForm/questionnaireList_1_0`;
    let params = new HttpParams().set('formType', type)
    return this.http.get(url, {params: params});
  }

  addInstallationForm(payload: any): Observable<any> {
    let url = `${this.baseUrl}/installationForm/addInstallationForm`;
    var user = this.storageService.getEncrData('user');

    let obj = {
      formId: payload?.formId,
      formType: payload.formType,
      data: payload.data,
      status: payload?.status,
      createdBy: user?.UserId,
      remarks: ''
    }
    return this.http.post(url, obj);
  }

  getInstallationForm(payload: any) {
    let url = `${this.baseUrl}/installationForm/getInstallationForm_1_0`;
    let params = new HttpParams();
    var user = this.storageService.getEncrData('user');

    if(payload?.formType) {
      params = params.set('formType', payload.formType)
    }
    if(payload?.formId) {
      params = params.set('formId', payload.formId)
    }
    if(user) {
      params = params.set('createdBy', user.UserId)
    }
    return this.http.get(url, {params: params});
  }

  getLatestDraft(payload: any) {
    let url = `${this.baseUrl}/installationForm/getLatestDraft_1_0`;
    var user = this.storageService.getEncrData('user');
    let params = new HttpParams().set('createdBy', user?.UserId).set('formType', payload);
    return this.http.get(url, {params: params});
  }

  listRoles() {
    let url = `${environment.authUrl}/listRoles_1_0`;
    var user = this.storageService.getEncrData('user');
    let params = new HttpParams().set('createdBy', user?.UserId).set('department', user?.roleList[0].department);
    return this.http.get(url, {params: params});
  }


deactivateUser(payload:any){
    let url = `${environment.authUrl}/deactivateUser_1_0/${payload?.userId}`;
    return this.http.post(url,null);
}
  
}
