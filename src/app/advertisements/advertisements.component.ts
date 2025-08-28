import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AlertService } from '../services/alertservice/alert-service.service';
import { AuthService } from '../services/auth/authservice.service';
import { DatePipe } from '@angular/common';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private apiservice : ApiService,
    private router:Router,
    private alertService: AlertService,
    private authservice: AuthService,
    private storageService: StorageService,
    public datepipe: DatePipe,
    private proxSer: ProximityService,
    private siteSer: SiteService,
  ) { }

  userData: any;
  currentInfo: any
  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.currentInfo = this.storageService.getEncrData('navItem');
    this.getSites();
  }

  serviceData: any;
  getsiteservices1(site: any){
    this.siteSer.listSiteServices(site).subscribe((res: any) => {
      this.serviceData = res.siteServicesList;
    })
  }

  toggleAccordian(event:any) {return this.apiservice.toggle(event);}
  showOptions(){return this.apiservice.showOptions()}
  showOptions1(){return this.apiservice.showOptions1()}
  closemodal(){return this.apiservice.closemodal();}
  toQRmodal(){return this.apiservice.toQR()}


  showLoader: boolean = false;
  sites: boolean = true;
  devices: boolean = false;
  device: any = ''

  @ViewChild('panel') panel: ElementRef;
  openSites(){
    this.sites = true;
    this.devices = false;
    this.closemodal();
  }

  openDevices(){
    this.sites = false;
    this.devices = true;
    this.closemodal();
  }

  siteData: any = [];
  getSites() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.userData).subscribe((res: any) => {
      this.showLoader = false;
      this.getMetadata();
      // console.log(res);
      if(res.Status == "Success") {
        this.siteData = res.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
        if(!this.currentInfo) {
          this.storageService.site_sub.next({site: this.siteData[0], index: 0});
        }
        var user = this.storageService.getEncrData("user");
        if (user.UserName == 'sales@ivisecurity.com') {
          this.siteData.forEach((item: any) => {
            if(item.siteId == 36349) {
              item.siteName = "Your Shopping Center";
              item.siteShortName = "Machinery Service";
            }
            if(item.siteId == 36347) {
              item.siteName = "Your Pharmacy";
              item.siteShortName = "Machinery Service";
            }
            if(item.siteId == 36331) {
              item.siteName = "Your Machinery Service";
              item.siteShortName = "Machinery Service";
            }
          });
        }
        this.listAdsBySite(this.currentInfo.site, this.currentInfo.index)
        // this.getDevices(this.currentInfo.site, this.currentInfo.index);
        this.getsiteservices1(this.currentInfo?.site)
      }
      if(res.Status == "Failed") {
        this.siteData = []
        // this.authservice.logout();
        // this.router.navigateByUrl('/gaurd');
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  deviceData: any = [];
  currentSite: any;
  currentNav: any
  getDevices(data: any) {
    this.currentSite = data;
    this.getsiteservices1(data)
    // this.currentDevDesc = 'All';
    this.showLoader = true;
    this.proxSer.listDevicesBySite(data?.siteId).subscribe((res: any) => {
      this.showLoader = false;
      this.deviceData = res[0]?.adsDevices;
    });
  }

  listAdsBySite(data: any, index: any) {
    // this.storageService.storeEncrData('navItem', {site: data, index: this.siteData.indexOf(data)});
    this.storageService.site_sub.next({site: data, index: this.siteData.indexOf(data)});
    this.currentSite = data;
    this.currentNav = index;
    this.showLoader = true;
    this.getDevices(data);
    this.proxSer.listAdsBySite(data).subscribe((res: any) => {
      this.showLoader = false;
      this.assetData = res[0]?.assets?.sort((a: any, b: any) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
    });
  }

  searchText: any;
  onInput(e: any) {
    var x = e.target.value;
  }

  assetData: any = [];
  currentDev: any;
  currentDevDesc: any;
  listAdsByDevice(data: any) {
    this.showLoader = true;
    this.currentDev = data;
    // this.currentDevDesc = deviceId?.deviceDescription;
    this.proxSer.listAdsByDevice({device: data, site: this.currentSite?.siteId}).subscribe((res: any) => {
      this.showLoader = false;
      this.assetData = res[0]?.assets?.sort((a: any, b: any) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  showCreateAdd: boolean = false;
  open(site: any) {
    localStorage.setItem('site_temp', JSON.stringify(site));
    // console.log(site);
    this.showCreateAdd = true;
  }

  closeCreateAdd() {
    this.showCreateAdd = false;
  }

  deviceType: any;
  deviceMode: any;
  addStatus: any;
  getMetadata() {
    let data = this.storageService.getEncrData('metaData');
    for(let item of data) {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 8) {
        this.addStatus = item.metadata;
      }
    }
  }

  originalObject: any
  changedKeys: any[] = [];
  currentItem: any;
  myFun(e: any) {
    let x = e?.target?.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;
  currentStatusId: any
  openEditAdd(data: any) {
    this.changedKeys = [];
    this.currentItem = data;
    this.currentStatusId = data;
    var x = <HTMLElement>document.getElementById('editAddDialog')
    x.style.display = "block";
  }

  modifyAssetForDevice() {
    this.originalObject = {
      id: this.currentItem.id,
      deviceModeId: this.currentItem.deviceModeId,
      playOrder: this.currentItem.playOrder,
      modifiedBy: 1,
      fromDate: this.currentItem.fromDate,
      toDate: this.currentItem.toDate,
      active: this.currentItem.active,
      status: this.currentItem.status
    };
    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');
    this.originalObject.modifiedBy = this.userData?.UserId;
    this.closeviewModal();
    this.showLoader = true;
    this.proxSer.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      this.alertService.success('success', res?.message);
    }, (err: any) => {
      this.showLoader = false;
      this.alertService.success('error', err?.error?.message);
    })
  }


  statusObj = {
    status: '',
    modifiedBy: null
  }
  changeAssetStatus() {
    this.closeviewModal();
    if(this.statusObj.status != '') {
      this.statusObj.modifiedBy = this.userData?.UserId;
      this.proxSer.updateAssetStatus(this.currentStatusId?.id, this.statusObj).subscribe((res: any) => {
        // console.log(res);
        this.alertService.success('Alert', res?.message);
        this.proxSer.listAdsBySite(this.currentSite).subscribe((res: any) => {
          this.assetData = res[0]?.assets?.sort((a: any, b: any) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
        });
      }, (err: any) => {
        if(err) {
          this.alertService.error('error', err?.error?.message);
        };
      });
    }
  }

  closeviewModal(){
    var x = <HTMLElement>document.getElementById('editAddDialog')
    x.style.display = "none";
  }

  currentDevice: any;
  openDeviceModel(data: any){
    this.changedKeys = [];
    this.deviceBody.deviceModeId = '';
    this.currentDevice = data;
    var x = <HTMLElement>document.getElementById('deviceModel')
    x.style.display = "block";
  }

  deviceBody = {
    deviceId: null,
    deviceModeId: '',
    modifiedBy: null
  }

  changeDeviceMode() {
    this.originalObject = {
      deviceId: this.currentDevice?.deviceId,
      deviceModeId: this.deviceBody.deviceModeId,
      modifiedBy: this.userData?.UserId,
      // "deviceCallFreq": this.currentDevice.deviceCallFreq,
      // "deviceDescription": this.currentDevice.deviceDescription,
      // "remarks": this.currentDevice.remarks,
      // "weatherInterval": this.currentDevice.weatherInterval,
      // "loggerFreq": this.currentDevice.loggerFreq,
      // "modelWidth": this.currentDevice.modelWidth,
      // "modelHeight": this.currentDevice.modelHeight,
      // "adsHours": this.currentDevice.adsHours,
      // "workingDays": this.currentDevice.workingDays,
      // "status": this.currentDevice.status,
      // "modelName": this.currentDevice.modelName,
      // "modelObjectTypeId": this.currentDevice.modelObjectTypeId,
      // "debugOn": this.currentDevice.debugOn,
      // "debugLogs": this.currentDevice.debugLogs,
      // "refreshRules": this.currentDevice.refreshRules,
    };

    this.closeDeviceModel();
    if(this.deviceBody.deviceModeId != '') {
      this.deviceBody.modifiedBy = this.userData?.UserId;
      this.deviceBody.deviceId = this.currentDevice?.deviceId;
      this.proxSer.updateDeviceMode({adsDevice: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
        // console.log(res);
        this.proxSer.listDevicesBySite(this.currentSite?.siteId).subscribe((res: any) => {
          // console.log(res);
          this.deviceData = res[0]?.adsDevices;
        });
        this.alertService.success('Alert', res?.message);
      }, (err: any) => {
        if(err) {
          this.alertService.error('error', err?.error?.message);
        };
      });
    }
  }

  closeDeviceModel(){
    var x = <HTMLElement>document.getElementById('deviceModel')
    x.style.display = "none";
    // this.savedevent.target.src = 'assets/icons/viewWhite.svg';
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.assetData;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
