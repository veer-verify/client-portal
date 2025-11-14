import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, first, last, Observable, shareReplay, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  environment = environment;
  private readonly key = "verifai";


  loading_text: any;
  loader_sub: BehaviorSubject<any> = new BehaviorSubject(false);
  site_sub: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  commonsUrl = "https://commonssl-rsmgmt.ivisecurity.com/"
  storeEncrData1(storageKey: string, value: any) {
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

  storeEncrData(key: string, value: any) {
    // const data: any = btoa(encodeURIComponent(JSON.stringify(value)));
    localStorage.setItem(key, JSON.stringify(value));
  }

  forStoring(x: string, encryptedValue: string) {
    var a = ({ key: x, value: encryptedValue });
    localStorage.setItem(`${x}`, JSON.stringify(a));
  }


  getEncrData1(key: string) {
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

  getEncrData(key: string) {
    // const data: any = localStorage.getItem(key);
    // return JSON.parse(decodeURIComponent(atob(data)));
    return JSON.parse(localStorage.getItem(key)!)
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

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  public decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

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



