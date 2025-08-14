import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  error$ = new BehaviorSubject<any>('');
  siren_sub = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  closemodal() {
    const y = <any>(document.getElementById("modal"));
    y.style.display = "none";
  }

  showOptions1() {
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("topple"));
    (<any>y).appendChild(x);
    const z = (y.children[0]);
    z.style.display = "block";
    z.style.margin = 20 + "px";
    z.style.width = 100 + "%";
    const p = (y.parentNode);
    p.style.display = "flex";
  }


  getSitesListForUserName(payload: any): Observable<any> {
    let url = environment.sitesUrl + '/getSitesListForUserName_1_0/';
    // If you want to get the current route name, you can use ActivatedRoute or filter for NavigationEnd events
    // Example: Get the current route's first child's data['routeName']
    let routeName = this.activatedRoute.snapshot.firstChild?.data['routeName'];
    let params = new HttpParams();
    if(payload?.UserName) {
      params = params.set('userName', payload?.UserName);
    }
    params = params.set('service', routeName);
    params = params.set('siteStatus','Active');
    
    return this.http.get(url, { params: params });
  }

  getCamerasForSiteId(payload: any) {
    let url = environment.sitesUrl + `/getCamerasForSiteIdForPortal_1_0/${payload?.siteId}`;
    return this.http.get(url);
  }

  getCameras(payload: any) {return payload}

  updateCameraName(payload: any) {
    let url = environment.sitesUrl + '/updateCameraName_1_0';
    return this.http.post(url, payload)
  }

  addHelpDeskRequest(payload: any) {
    let url = `${environment.helpdeskUrl}/addService_1_0`;
    var user = this.storageService.getEncrData('user');
    let formData = new FormData();
    formData.append('siteId', payload.siteId ? payload.siteId : payload.siteId);
    formData.append('calling_system', 'portal');
    formData.append('service_cat_id', payload.service_cat_id);
    formData.append('service_subcat_id', payload.service_subcat_id);
    formData.append('createdBy', user?.UserName);
    formData.append('description', payload.description);
    formData.append('PrefTimeToCall', payload.PrefTimeToCall);
    formData.append('priority', payload.priority);
    formData.append('remarks', payload.remarks);
    return this.http.post(url, formData);
  }

  updateHelpDeskRequest(payload: any) {
    let url = `${environment.helpdeskUrl}/updateService_1_0/${payload?.serviceReqId}`;
    var user = this.storageService.getEncrData('user');
    let formData = new FormData();
    formData.append('siteId', payload.siteId ? payload.siteId : payload.siteId);
    formData.append('calling_system', 'portal');
    formData.append('service_cat_id', payload.service_cat_id);
    formData.append('service_subcat_id', payload.service_subcat_id);
    formData.append('editedBy', user?.UserId);
    formData.append('description', payload.description);
    formData.append('PrefTimeToCall', payload.PrefTimeToCall);
    formData.append('priority', payload.priority);
    formData.append('remarks', payload.remarks);
    return this.http.put(url, formData);
  }

  getHelpDeskRequests(payload: any) {
    let url = `${environment.helpdeskUrl}/ListServiceHelpDesk_1_0`;
    let params = new HttpParams();
    if (payload?.site?.siteId) {
      params = params.set('siteId', payload?.site?.siteId);
    }
    return this.http.get(url, { params: params });
  }

  deleteHelpDeskRequests(payload: any) {
    let url = `${environment.helpdeskUrl}/deleteServiceHelpDesk_1_0/${payload?.serviceReqId}`;
    return this.http.put(url, null);
  }

  listSiteServices(payload: any): Observable<any> {
    let url = `${environment.sitesUrl}/listSiteServices_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, {params: params});
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error');
  }
}
