import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //ivis
  logo = 'assets/icons/logo_white.png';
  headerLogo = 'assets/themes/IVISsecurity_logo.png';
  accordianLogo = 'assets/icons/eye.svg';
  activeLogo = 'assets/icons/eye-blue.svg';
  inActiveLogo = 'assets/icons/eye-red.svg';

  //unv
  // logo = 'assets/themes/UneeviuLogowhite (1).png';
  // headerLogo = 'assets/themes/Uneeviu Logo Blue png.png';
  // accordianLogo = 'assets/themes/CameraLogowhite.png';
  // activeLogo = 'assets/themes/Uneeviu Logo Blue png.png';
  // inActiveLogo = 'assets/themes/Uneeviu Logo Blue png.png';

  loader_sub: BehaviorSubject<any> = new BehaviorSubject(false);
  site_sub: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  commonsUrl = "https://commonssl-rsmgmt.ivisecurity.com/"
  storeEncrData(storageKey: string, value: any) {
    var x: string;
    const y = btoa(escape(JSON.stringify(value)));
    if (storageKey == 'refreshToken') { x = 'rft'; this.forStoring(x, y) }
    else if (storageKey == 'selectedsite') { x = 'cs'; this.forStoring(x, y) }
    else if (storageKey == 'savedcams') { x = 'scams'; this.forStoring(x, y) }
    else if (storageKey == 'siteidfromgaurdpage') { x = 'sidfrmgp'; this.forStoring(x, y) }
    else if (storageKey == 'user' && !value.Failed) { x = 'uuss'; this.forStoring(x, y); }
    else if (storageKey == 'siteservices') { x = 'ss'; this.forStoring(x, y); }
    else if (storageKey == 'userinfo') { x = 'ui'; this.forStoring(x, y); }
    else if (storageKey == 'navItem') { x = 'nvIt'; this.forStoring(x, y); }
    else if (storageKey == 'serviceData') { x = 'serDta'; this.forStoring(x, y); }
    else { x = storageKey; this.forStoring(x, y) };
  }

  storeEncrData1(key: string, value: any) {
    const data: any = btoa(encodeURIComponent(JSON.stringify(value)));
    localStorage.setItem(key, data);
  }

  forStoring(x: string, encryptedValue: string) {
    var a = ({ key: x, value: encryptedValue });
    localStorage.setItem(`${x}`, JSON.stringify(a));
  }


  getEncrData(key: string) {
    var x: string;
    if (key == 'refreshToken') { x = 'rft'; return this.forGetting(x) }
    else if (key == 'selectedsite') { x = 'cs'; return this.forGetting(x) }
    else if (key == 'savedcams') { x = 'scams'; return this.forGetting(x) }
    else if (key == 'siteidfromgaurdpage') { x = 'sidfrmgp'; return this.forGetting(x) }
    else if (key == 'user') { x = 'uuss'; return this.forGetting(x) }
    else if (key == 'siteservices') { x = 'ss'; return this.forGetting(x) }
    else if (key == 'userinfo') { x = 'ui'; return this.forGetting(x) }
    else if (key == 'navItem') { x = 'nvIt'; return this.forGetting(x) }
    else if (key == 'serviceData') { x = 'serDta'; return this.forGetting(x) }
    else { x = key; return this.forGetting(x) }
  }

  getEncrData1(key: string) {
    const data: any = localStorage.getItem(key);
    return JSON.parse(decodeURIComponent(atob(data)));
  }

  forGetting(key: any) {
    const res = JSON.parse(localStorage.getItem(key)!);
    if (res) {
      if (res.value) {
        JSON.parse(unescape(atob(res.value)))
        return JSON.parse(unescape(atob(res.value)));
      } else {
        return false;
      }
    } else {
      return null;
    }
  }


  async deleteStoredEncrData(storageKey: string) {
    var x;
    if (storageKey == 'refreshToken') { x = 'gfA5tka_r'; localStorage.removeItem(x) }
    else if (storageKey == 'selectedsite') { x = 'Xb9^gsY2f'; localStorage.removeItem(x) }
    else if (storageKey == 'savedcams') { x = 'hh#dkbO9'; localStorage.removeItem(x) }
    else if (storageKey == 'siteidfromgaurdpage') { x = '=Dah4&g*g'; localStorage.removeItem(x) }
    else if (storageKey == 'user') { x = 'NdxI0F1J'; localStorage.removeItem(x) }
    else if (storageKey == 'siteservices') { x = 'xXyzv$b7'; localStorage.removeItem(x) }
    else if (storageKey == 'userinfo') { x = 'krG#m$b7'; localStorage.removeItem(x) }
  }

  // ss$ = new BehaviorSubject<any>('');
  // rt$ = new BehaviorSubject<any>('');
  // sc$ = new BehaviorSubject<any>('');
  // sgp$ = new BehaviorSubject<any>('');

  // getdata(key:any){
  //   if(key == 'savedcams'){this.getEncrData(key).then((res:any) =>{this.sc$.next(res);})}
  //   if(key == 'refreshToken'){this.getEncrData(key).then((res:any) =>{this.rt$.next(res);})}
  //   if(key == 'selectedsite'){this.getEncrData(key).then((res:any) =>{this.ss$.next(res);})}
  //   if(key == 'siteidfromgaurdpage'){this.getEncrData(key).then((res:any) =>{this.sgp$.next(res);})}
  //   if(key == 'user'){this.getEncrData(key).then((res:any) =>{this.sgp$.next(res);})}
  // }

  public isSuperAdmin(): boolean {
    const user = this.getEncrData('user');
    let a: Array<any> = Array.from(user.roleList, (item: any) => item.category);
    return a.includes('SuperAdmin') ? true : false;
  }

  public isAdmin(): boolean {
    const user = this.getEncrData('user');
    let a: Array<any> = Array.from(user.roleList, (item: any) => item.category);
    return a.includes('Admin') ? true : false;
  }

  public isUser(): boolean {
    const user = this.getEncrData('user');
    let a: Array<any> = Array.from(user.roleList, (item: any) => item.department);
    return (a.includes('Client') || a.includes('Site')) ? true : false;
  }

}



