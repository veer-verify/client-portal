import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  error$ = new BehaviorSubject<any>('');
  siteservices$ = new BehaviorSubject<any>('');
  tokenExpired$ = new BehaviorSubject<boolean>(false);
  editProfile$ = new BehaviorSubject<any>('');
  currentProfile = this.editProfile$.asObservable();

  baseurl = "http://usmgmt.iviscloud.net:777/";
  baseurl1 = 'http://smstaging.iviscloud.net:8090/';

  sitelisturl = `${this.baseurl}businessInterface/sites/sitesList_2_0`;
  camlisturl = `${this.baseurl}businessInterface/Cameras/CameraStreamList_1_0`;
  refreshtokenurl = `${this.baseurl}businessInterface/login/refreshtoken`;
  servicesurl = `${this.baseurl}businessInterface/services/SiteServicesList_1_0`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    ) { }

  getVideoUrl(payload: any): Observable<any> {
    return this.http.get(payload?.httpUrl);
  }

  sendResetLink(payload: any) {
    let url = `${environment.authUrl}/sendResetLink_1_0/${payload}`;
    return this.http.post(url, payload)
  }

  getSites() {
    var a = this.storageService.getEncrData('user');
    let payload = {
      userName: a.UserName,
      accessToken: 'abc',
      calling_System_Detail: "portal",
    }
    return this.http.post(this.sitelisturl, payload)
  }

  /* other logins */
  // otherSitesUrl = 'http://rsmgmt.ivisecurity.com:943';

  getSitesListForUserName(payload: any) {
    let url = environment.sitesUrl + '/getSitesListForUserName_1_0/';
    let params = new HttpParams();
    if(payload?.UserName) {
      params = params.set('userName', payload?.UserName)
    }
    return this.http.get(url, { params: params });
  }

  getCamerasForSiteId(payload: any) {
    let url = environment.sitesUrl + `/getCamerasForSiteId_1_0/${payload?.siteId}`;
    return this.http.get(url)
  }

  getCameras(siteId: any) {
    var a = this.storageService.getEncrData('user');
    let payload = {
      userName: a.UserName,
      accessToken: 'abc',
      SiteId: siteId,
      calling_System_Detail: "portal",
    }
    return this.http.post(this.camlisturl, payload);
  }

  error = '';
  refresh() {
    var a = this.storageService.getEncrData('user');
    let payload = {
      userName: a.UserName,
      calling_System_Detail: "portal",
      refreshToken: a.refresh_token
    }
    this.http.post(this.refreshtokenurl, payload).subscribe((res: any) => {
      // console.log("refresh: ",this.refreshtokenurl,payload,res);
      if (res.Status == 'Failed') {
        this.onHTTPerror({ status: "Session Expired" });
        this.router.navigateByUrl("/login");
        this.error = ("Session Expired. Please login again")
      }
      if (res.Status == "Success") {
        this.storageService.storeEncrData('user', res);
      }
    }, (error) => {
      this.tokenExpired$.next(true);
      this.onHTTPerror(error);
    })
  }

  // getServices(siteId: any) {
  //   var Request_type = "Services";
  //   let servicesurl1 = `${this.baseurl}businessInterface/Client/clientServices_1_0?accountId=${siteId}&Request_type=${Request_type}&calling_user_details=IVISUSA`;
  //   this.http.get(servicesurl1).subscribe((res: any) => {
  //     this.storageService.storeEncrData('siteservices', res);
  //     this.siteservices$.next(res);
  //     if (res.Status != "Failed") {
  //       if (res.background != null) {
  //         document.body.style.backgroundImage = `linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%),url(${res.background})`;
  //       } else {
  //         document.body.style.backgroundImage = `linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%), url(assets/icons/background.jpg)) no repeat`;
  //       }
  //     }
  //   }, (error: any) => { console.log(error); })
  // }


  getHelpDeskCategories() {
    let url = `${environment.helpdeskUrl}/categoryList_1_0`;
    return this.http.get(url);
  }

  addHelpDeskRequest(payload: any, file?: any) {
    let url = `${environment.helpdeskUrl}/addService_1_0`;
    var user = this.storageService.getEncrData('user');
    let formData = new FormData();

    formData.append('siteId', payload.siteId);
    formData.append('calling_system', 'portal');
    formData.append('service_cat_id', payload.service_cat_id);
    formData.append('service_subcat_id', payload.service_subcat_id);
    formData.append('createdBy', user?.UserId);
    formData.append('description', payload.description);
    // formData.append('PrefTimeToCall', payload.PrefTimeToCall);
    
    formData.append('priority', payload.priority);
    formData.append('remarks', payload.remarks);

    if(payload.prefTimeToCall) {
      formData.append('prefTimeToCall', payload.prefTimeToCall) ;
    }
    if(file) {
      formData.append('requestName', 'service-requests-test');
      formData.append('assetName', file?.name);
      formData.append('assetFile', file);
    }
    return this.http.post(url, formData);
  }

  updateHelpDeskRequest(payload: any) {
    let url = `${environment.helpdeskUrl}/updateService_1_0/${payload?.serviceReqId}`;
    var user = this.storageService.getEncrData('user');
    let formData = new FormData();

    // if (payload.PrefTimeToCall != null) { formData.append('preferredTimeToCall', payload.PrefTimeToCall); }
    formData.append('siteId', payload.siteId ? payload.siteId : payload.siteId);
    formData.append('calling_system', 'portal');
    formData.append('service_cat_id', payload.service_cat_id);
    formData.append('service_subcat_id', payload.service_subcat_id);
    formData.append('editedBy', user?.UserId);
    formData.append('modifiedBy', user?.UserId);
    formData.append('description', payload.description);
    formData.append('PrefTimeToCall', payload.PrefTimeToCall);
    formData.append('priority', payload.priority);
    formData.append('remarks', payload.remarks);
    formData.append('status', payload.status);
    return this.http.put(url, formData);
  }

  getHelpDeskRequests(payload?: any) {
    let url = `${environment.helpdeskUrl}/ListServiceRequest_1_0`;
    var user = this.storageService.getEncrData('user');

    // let departments: Array<any> = Array.from(user?.roleList, (item: any) => item.department);
    // let categories: Array<any> = Array.from(user?.roleList, (item: any) => item.category);
    // let isAdmin = false;
    // if(departments.includes('Support') && categories.includes('Admin')) {
    //   isAdmin = true;
    // }

    let params = new HttpParams();
    if(user && !this.storageService.isSuperAdmin()) {
      params = params.set('userId', user?.UserId);
    }
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if(payload?.serviceCategory) {
      params = params.set('serviceCategory', payload?.serviceCategory);
    }
    if(payload?.serviceSubCategory) {
      params = params.set('serviceSubCategory', payload?.serviceSubCategory);
    }
    if(payload?.status) {
      params = params.set('status', payload?.status);
    }
    if(payload?.userId) {
      params = params.set('userId', payload?.userId);
    }
    if(payload?.page) {
      params = params.set('page', payload?.page);
    }
    if(payload?.fromDate) {
      params = params.set('fromDate', payload?.fromDate);
    }
    if(payload?.toDate) {
      params = params.set('toDate', payload?.toDate);
    }
    if(payload?.site?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    
    return this.http.get(url, {params: params});
  }

  deleteHelpDeskRequests(payload: any) {
    // var a = this.storageService.getEncrData('user');
    // var b = this.storageService.getEncrData('siteidfromgaurdpage');
    // var payload = {
    //   userName: a.UserName,
    //   accessToken: 'abc',
    //   calling_System_Detail: "portal",
    //   siteId: b.siteId,
    //   serviceId: serviceid
    // }
    let url = `${environment.helpdeskUrl}/deleteServiceRequest_1_0/${payload?.serviceReqId}`;
    return this.http.put(url, null);
  }

  assignServiceRequest(payload: any) {
    let url = `${environment.helpdeskUrl}/assignServiceRequest_1_0`;
    var user = this.storageService.getEncrData('user');
    // payload.modifiedBy = user?.UserId;
    payload.assignedBy = user?.UserId;
    // let obj = {
    //   serviceReqId: payload?.serviceReqId,
    //   assignedTo: payload?.assignedTo,
    //   assignedType: '',
    //   status: payload?.status,
    //   comments: payload?.comments,
    //   modifiedBy: user?.UserId
    // }
    return this.http.put(url, payload);
  }

  

  getNonWorkingDays(siteId: any, year: any) {
    let url = `${environment.insightsUrl}/notWorkingDays_1_0?siteId=${siteId}&year=${year}`;
    return this.http.get(url);
  }

  // clientServices(siteId: any) {
  //   var Request_type = "Services";
  //   let servicesurl1 = `${environment.insightsUrl}/clientServices_1_0?accountId=${siteId}&Request_type=${Request_type}`;
  //   return this.http.get(servicesurl1)
  // }

  getBiAnalyticsReport(siteId: any, startDate: any, endDate: any) {
    // console.log(endDate)
    let biAnalyticsReport = environment.insightsUrl + '/biAnalyticsReport_1_0?';
    const newurl1 = `${biAnalyticsReport}SiteId=${siteId}&fromDate=${startDate}&toDate=${endDate}`;
    // console.log("bireport: ",newurl1);
    return this.http.get(newurl1);
  }

  downloadReport(siteId: any, startdate: any, enddate: any) {
    let url = 'http://smstaging.iviscloud.net:8090/bireports/download/getPdfReport'
    var payload = {
      id: siteId,
      startdate: startdate,
      enddate: enddate
    }
    return this.http.post(url, payload);
  }

  getBiAnalyticsResearch(siteId: any, startDate: any) {
    // console.log("researchTrends"+siteId,startDate)
    let biAnalyticsReport = environment.insightsUrl + '/getAnalyticsListforSite_1_0?';
    const newurl1 = `${biAnalyticsReport}SiteId=${siteId}&date=${startDate}`
    const newurl = environment.insightsUrl + "/getAnalyticsListforSite_1_0?SiteId=1002&date=2022-03-01";
    // console.log("bireport: ",newurl);
    return this.http.get(newurl1);
  }


  getBiTrends1(siteId: any, date: any, typeid: any) {
    // let url1 = `${environment.insightsUrl}/analyticTrends_1_0?SiteId=${siteId}&date=${date}&analyticTypeId=${typeid}`;
    let url = `${environment.insightsUrl}/analyticTrends_2_0?SiteId=${siteId}&date=${date}&analyticTypeId=${typeid}`;
    return this.http.get(url)
  }

  getBiTrends(type: any, date: any) {
    let biTrends = environment.insightsUrl + "biDataReport/BiData?accountId=1001&analyticTypeId=";
    let url = `${biTrends}${type}&cameraDate=${date}`
    // console.log(url);
    return this.http.get(url)
  }
  getsiteid(siteId: any) {
    let url = `${this.baseurl}cpus/sites/getBICustomerSiteId_1_0?accId=${siteId}`;
    return this.http.get(url)
  }

  downloadReport1(id: any, startdate: any, enddate: any) {
    var x = new HttpHeaders({ Accept: 'application/pdf', 'Content-Type': 'application/pdf', responseType: 'blob' });
    let url = `${this.baseurl}bireports/download/getPdfReport?id=${id}&startdate=${startdate}&enddate=${enddate}`;
    return this.http.get(url, { headers: x, responseType: 'blob' })
  }

  listInsightImages(payload: any) {
    let url = `${environment.sitesUrl}/listInsightImages_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId)
    return this.http.get(url, {params: params});
  }

  sessionstatus() {
    var hours = 24; // 0.01 is 35secs
    var now: any = new Date().getTime();
    var setupTime: any = localStorage.getItem('ge%1=wd2a');
    if (setupTime == null) {
      localStorage.setItem('ge%1=wd2a', now)
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.setItem('ge%1=wd2a', now);
        return false;
      }
    }
    return true;
  }

  sendEmail(body: any, subject: string) {
    let localurl = "http://10.0.2.191:8080/emailService";
    let url = `${this.baseurl}keycloakApp/emailService`;
    var a = this.storageService.getEncrData('user');
    let payload = {
      userName: a.UserName,
      accessToken: 'abc',
      subject: subject,
      body: body,
      userEmail: a.email,
      realm: a.Realm,
      calling_System_Detail: "portal",
      roles: '',
    };
    return this.http.post(url, payload)
  }

  getUserForProfile() {
    let url = this.baseurl + 'businessInterface/User/getUser_1_0'
    var a = this.storageService.getEncrData('user');
    var payload = {
      username: a?.UserName,
      email: a?.email,
      callingUsername: a?.UserName,
      accesstoken: 'abc',
      callingSystemDetail: "portal"
    }
    return this.http.post(url, payload);
  }

  getUserInfoForId(payload: any) {
    let url = `${environment.authUrl}/getUserInfoForUserId_1_0/${payload}`;
    return this.http.get(url);
  }

  updateUser(payload: any) {
    let url = `${environment.authUrl}/updateUser_1_0/${payload?.userId}`;
    var a = this.storageService.getEncrData('user');
    // console.log(payload)
    return this.http.put(url, payload);
  }

  updateProfilePic(payload: any) {
    let url = this.baseurl + 'businessInterface/User/UpdateProfilePic_1_0';
    return this.http.post(url, payload);
  }

  updateProfilePicture(payload: any) {
    let url = `${environment.authUrl}/updateProfilePicture_1_0`;
    var a = this.storageService.getEncrData('user');
    var userId = a.UserId;
    var username = a.UserName;
    let body = new FormData();
    // body.append('callingUsername', a.UserName);
    // body.append('accesstoken', 'abc');
    // body.append('callingSystemDetail', 'portal');
    // body.append('image', image);

    body.append('file', payload?.file);
    body.append('user_id', payload?.userId);
    return this.http.post(url, body);
  }

  listUsersByRole() {
    let url = environment.authUrl + '/listUsersByRole_1_0';
    let params = new HttpParams().set('roleId', 44);
    return this.http.get(url, {params: params});
  }

  listUsersByRoles(payload: any): Observable<any> {
    let url = environment.authUrl + '/listSupportAdminUsers_1_0';
    let params = new HttpParams().set('typeName', 'IVIS_Sopport_Roles');

    params = params.set('typeName', 'IVIS_Sopport_Roles')
    if(payload?.department) {
      params = params.set('department', payload?.department)
    }
    return this.http.get(url, {params: params});
  }

  getSitesListForGlobalAccountId(payload: any): Observable<any> {
    // let url = 'http://192.168.0.231:8922/userDetails/getSitesListForGlobalAccountId_1_0/'
    let url = environment.authUrl + '/getSitesListForGlobalAccountId_1_0/';
    // var user = this.storageService.getEncrData('user');
    let params = new HttpParams();
    if(payload?.userId) {
      params = params.set('userId', payload?.userId)
    }
    if(payload?.loginId) {
      params = params.set('loginId', payload?.loginId)
    }
    if(payload?.assigned !== null) {
      params = params.set('assigned', payload?.assigned)
    }
    params = params.set('callingSystemDetail', 'portal')
    return this.http.get(url, {params: params});
  }

  getUserNamesByUserName(): Observable<any> {
    // let url = 'http://192.168.0.231:8922/userDetails/getUserNamesByUserIds_1_0';
    let url = environment.authUrl + '/getUserNamesByUserIds_1_0';
    var user = this.storageService.getEncrData('user');
    let params = new HttpParams().set('user_id', user?.UserId);
    return this.http.get(url, {params: params});
  }

  createUser(payload: any) {
    let url = `${environment.authUrl}/createUser_1_0`;
    // let url = 'http://192.168.0.218:9000/userDetails/createUser_1_0';
    var user = this.storageService.getEncrData('user');
    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  createUserWithShortDetails(payload: any) {
    console.log(payload)
    let url = `${environment.authUrl}/createUserWithShortDetails_1_0`;
    var user = this.storageService.getEncrData('user');

    payload.realm = 'IVISUSA';
    payload.employeeFlag = 'F';
    payload.empId = '';
    payload.safetyEscortFlag = 'F';
    payload.firstTimeFlag = 'T';
    payload.callingSystemDetail = 'portal';
    payload.accountId = user.accountId ?? 0;
    payload.createdBy = user.UserId;
    payload.roleList = [payload.roleList];
    return this.http.post(url, payload);
  }

  applySitesMapping(payload: any){
    var user = this.storageService.getEncrData('user');
    let url =`${environment.authUrl}/applySitesMapping_1_0`;
    return this.http.post(url, payload);
  }

  unassignSiteForUser(payload: any){
    // let url = this.url1 + '/userDetails/unassignSiteForUser_1_0';
    let url =`${environment.authUrl}/unassignSiteForUser_1_0`;
    return this.http.post(url, payload);
  }

  gettnc() {
    let url = this.baseurl + 'businessInterface/User/getTandC_1_0';
    var a = this.storageService.getEncrData('user');
    let body = new FormData();
    body.append('callingUsername', a?.UserName);
    body.append('accesstoken', 'abc');
    body.append('callingSystemDetail', 'admin');
    // body.forEach((value,key) => {
    //     console.log(key+" "+value)
    // });
    return this.http.post(url, body)
  }

  gettncBlob() {
    let url = this.baseurl + 'businessInterface/User/getTermsandCond_1_0';
    var a = this.storageService.getEncrData('user');
    let body = new FormData();
    body.append('callingUsername', a.UserName);
    body.append('accesstoken', 'abc');
    body.append('callingSystemDetail', 'admin');
    // body.forEach((value,key) => {
    //     console.log(key+" "+value)
    // });
    return this.http.post(url, body)
  }

  onHTTPerror(e: any) {
    this.error$.next(e)
    this.router.navigateByUrl('/error');
  }

  // for data treatments //
  toggle(event: any) {
    var element = event.target;
    element.classList.toggle("active");
    // if(this.data[index].isActive) {
    //   this.data[index].isActive = false;
    // } else {
    //   this.data[index].isActive = true;
    // }
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      if(panel.scrollHeight > 400) {
        panel.style.maxHeight = "200px";
        panel.style.overflow = 'scroll'
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  toQR1() {
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("qrcode"));
    y.innerHTML = '';
    const p = (y.parentNode);
    y.insertAdjacentHTML("beforeend", `<a  href='${this.baseurl1}usveclient/' target='_blank'><img src='assets/usclientqr.png' class='qrimg'></a>`);
    y.insertAdjacentHTML("afterBegin", "<div class='qrtxt'>Scan QR code for Safety Escort Service</div>");
    p.style.display = "flex";
  }

  toQR() {
    const y = <any>(document.getElementById("modalcontent"));
    const x = <any>(document.getElementById("qrcode"));
    y.innerHTML = '';
    const p = (y.parentNode);
    // var services = JSON.parse(localStorage.getItem('siteservices')!);
    var services = this.storageService.getEncrData('siteservices');
    // console.log(services)
    if (this.siteservices$.value.Status != "Failed" && this.siteservices$.value?.Services?.safety_escort == "F") {
      y.insertAdjacentHTML("afterBegin",
        "<div class='qrtxt'>Please contact administration to subscribe the escort service</div>");
      p.style.display = "flex";
    }
    else {
      y.insertAdjacentHTML("beforeend", `<a  href='${this.baseurl1}usveclient/' target='_blank'><img src='assets/usclientqr.png' class='qrimg'></a>`);
      y.insertAdjacentHTML("afterBegin",
        "<div class='qrtxt'>Scan QR code for Safety Escort Service</div>");
      p.style.display = "flex";
    }
  }

  showOptions() {
    var x = document.getElementsByClassName('btnvisible');
    var y = document.getElementsByClassName('visibilitybtn');
    if ((x[0]).classList.contains('show')) {
      (x[0]).classList.remove('show');
      (y[0]).classList.remove('rotate');
    } else {
      (x[0]).classList.add('show');
      (y[0]).classList.add('rotate');
    };
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

  closemodal() {
    const y = <any>(document.getElementById("modal"));
    y.style.display = "none";
  }

  makeTitleForTables(str: string) {
    var localheader = str.replace(/[^A-Z0-9]+/ig, " ");
    var splitStr = localheader.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return (splitStr.join(' '))
  }

  extractUniqueValueArray(arr: any, key: any) {
    var abc: any[] = [];
    arr.forEach(function (el: any) {
      abc.push(el[key]);
    });
    var unique = abc.filter((v, i, a) => a.indexOf(v) === i);
    return unique;
  }

}
