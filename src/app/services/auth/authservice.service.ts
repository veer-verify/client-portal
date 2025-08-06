import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../alertservice/alert-service.service';
import { environment } from 'src/environments/environment';
import { DatePipe, formatDate } from '@angular/common';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedin = new BehaviorSubject<Boolean>(false);

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private alertSer: AlertService,
    private datePipe: DatePipe,
  ) {
    this.restartTimer();
  }

  data: any;
  // refreshtokenurl = `${this.baseurl}businessInterface/login/refreshtoken`;
  // baseUrl="http://usmgmt.iviscloud.net:777/";
  // baseUrl = 'http://34.206.37.237/userDetails';

  loginWithKeycloak(username: any, password: any) {
    let finalurl = `${environment.authUrl}/login_2_0`;
    let payload = {
      userName: username,
      password: password,
      calling_System_Detail: 'portal',
    };
    return this.http.post(finalurl, payload);
  }

  loginNew(username: any, password: any) {
    let url = environment.authUrl + `/user_login_1_0`;
    let payload = {
      userName: username,
      password: this.storageService.encrypt(password),
      // password: btoa(JSON.stringify(password)),
      // password: password,
      callingSystemDetail: 'portal',
    };
    return this.http.post(url, payload);
  }

  signup(payload: any): Observable<any> {
    let url = environment.authUrl + `/signup_1_0`;
    // let url = 'http://192.168.0.126:2000/signup_1_0';
    return this.http.post(url, payload);
  }

  manageUserSession(type: string) {
    let url = environment.authUrl + `/manageUserSession_1_0`;
    var user = this.storageService.getEncrData('user');
    let sessionId = JSON.parse(localStorage.getItem('sId')!);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let obj = new Map();
    obj.set('userName', user?.UserName);
    obj.set('UidToken', user?.UidToken);
    obj.set('type', type);
    obj.set('time', this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss', timezone));
    obj.set('timeZone', timezone);
    obj.set('createdBy', user?.UserId);
    obj.set('callingSystemDetail', 'portal');
    if(type === 'logOut') {
      obj.set('sessionId', sessionId);
    };

    let payload = Object.fromEntries(obj);
    return this.http.post(url, payload);
  }

  getAccessforRefreshToken(payload: any): Observable<any> {
    let url = environment.authUrl + '/getAccessforRefreshToken';
    let params = new HttpParams()
      .set('refresh_token', payload?.RefreshToken)
      .set('modifiedBy', payload?.UserId);
    return this.http.post(url, null, { params: params });
  }

  verifyEmail(email: any, UidToken: any): Observable<any> {
    let url = environment.authUrl + '/verifyEmail_1_0';
    // let params = new HttpParams().set('email', email).set('UidToken', uId);
    let obj = {
      email: email,
      UidToken: UidToken,
    };
    return this.http.post(url, obj);
  }

  updatePassword(payload: any) {
    let url = environment.authUrl + `/updatePassword_1_0`;
    let obj = {
      userName: payload.userName,
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
      firstTime: 'F',
    };
    return this.http.put(url, obj);
  }

  getSites(userName: any) {
    let url =
      'http://usmgmt.iviscloud.net:777/businessInterface/sites/sitesList_2_0';
    // var a = this.storageService.getEncrData('user');
    let payload = {
      userName: userName,
      accessToken: 'abc',
      calling_System_Detail: 'portal',
    };
    return this.http.post(url, payload);
  }

  // logout() {
  //   let signouturl = `${environment.authUrl}/logout`;
  //   let payload = { UserName: '', AccessToken: '' };
  //   var a = this.storageService.getEncrData('user');
  //   if (a) {
  //     payload = {
  //       UserName: a.UserName,
  //       AccessToken: 'abc',
  //     };
  //   }
  //   localStorage.clear();
  //   this.storageService.deleteStoredEncrData('user');
  //   return this.http.post(signouturl, payload);
  // }

  getAuthStatus() {
    var a = this.storageService.getEncrData('user');
    if (a == null) {
      return false;
    } else {
      return true;
    }
  }

  forgotPassword(username: string) {
    let url = `${environment.authUrl}/resetPassword_1_0`;
    let payload = {
      userName: username,
      calling_System_Detail: 'Mobile_App',
    };
    return this.http.post(url, payload);
  }

  private idleTimer: Observable<number>;
  private destroy_sub = new Subject<void>();
  restartTimer(): void {
    const timeoutPeriod = 10 * 60 * 1000;
    this.idleTimer = timer(timeoutPeriod).pipe(takeUntil(this.destroy_sub));
    this.idleTimer.subscribe((res: any) => {
      localStorage.clear();
      this.storageService.site_sub1.next(null);
      this.isLoggedin.next(false);
      this.router.navigate(['/login']);
    });
  }

  userActivity(): void {
    this.destroy_sub.next();
    this.destroy_sub.complete();
    this.destroy_sub = new Subject<void>();
    this.restartTimer();
  }
}
