import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css']
})
export class SensorsComponent implements OnInit {

  model: NgbDateStruct;

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private alertService: AlertService,
    private authservice: AuthService,
    private storageService: StorageService,
    public datepipe: DatePipe,
    private proxSer: ProximityService,
    private eventSer: EventService,
    private siteSer: SiteService
    ) { }

    userData: any;
    currentTime: any;
    currentInfo: any
    ngOnInit(): void {
      this.userData = this.storageService.getEncrData('user');
      // this.currentInfo = this.storageService.getEncrData('navItem');
      this.storageService.site_sub.subscribe((res) => {
        this.currentInfo = res;
      })
      // console.log(this.currentInfo)
      let d1 = new Date();
      let d2 = new Date(d1);
      d2.setMinutes (d1.getMinutes() - 360);
      this.currentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us');

      this.getSitesListForUserName();

    
  }

  // serviceData: any;
  // getsiteservices1(site: any){
  //   this.siteSer.listSiteServices(site).subscribe((res: any) => {
  //     this.serviceData = res.siteServicesList;
  //   })
  // }


  getTimeDifference(date1: Date, date2: Date): string {
    let first: any = new Date(date1);
    let second: any = new Date(date2);
    const diffInMs: number = Math.abs(first.getTime() - second.getTime());
    const hours: number = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes: number = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds: number = Math.floor((diffInMs % (1000 * 60)) / 1000);
    return `${hours} hours, ${minutes} min`;
  }

  toggleAccordian(event: any) { return this.apiservice.toggle(event); }
  showOptions() { return this.apiservice.showOptions() }
  showOptions1() { return this.apiservice.showOptions1() }


  showLoader: boolean = false;
  sites: boolean = true;
  devices: boolean = false;

  removeDuplicates() {
    this.siteData = this.siteData.reduce((acc: any, current: any) => {
      const x = acc.find((item: any) => item.siteId == current.siteId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }
  
  siteData: any = [];
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.userData).subscribe((sites: any) => {
      this.showLoader = false;
      this.siteData = sites?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
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
      if(!this.currentInfo) {
        this.storageService.site_sub.next({site: this.siteData[0], index: 0});
      }
      // this.getsiteservices1(this.currentInfo?.site);
      this.footageList(this.currentInfo?.site, this.currentInfo?.index);
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  calculateRowspan(devices: any[]): number {
    return devices.reduce((total, device) => total + device.data.length, 0);
  }
  
  

  camData: any = [];
  camerasListForSites(siteId: any) {
    this.eventSer.camerasListForSites(siteId).subscribe((res: any) => {
      this.camData = res;
    });
  }

  zones: any = [];
  listZonesForSiteId(data: any) {
    this.eventSer.listZonesForSiteId(data).subscribe((res: any) => {
      this.zones = res.zonesList;
    })
  }

  types: any = [];
  listSensorTypesForSiteId(data: any) {
    this.eventSer.listSensorTypesForSiteId(data).subscribe((res: any) => {
      this.types = res.sensorsTypesList;
    })
  }

  zoneData: any = [];
  eventData: any = [];
  newEventData: any = [];
  currentSite: any;
  navActive!: number;
  footageList(data: any, index: any) {
    // this.storageService.storeEncrData('navItem', {site: data, index: index});
    this.storageService.site_sub.next({site: data, index: index});
    this.getMetadata()
    this.listZonesForSiteId(data);
    this.listSensorTypesForSiteId(data);
    // this.camerasListForSites(data);
    // this.getsiteservices1(data);
    this.currentSite = data;
    this.navActive = index;
    this.showLoader = true;
    this.eventSer.listSensorData(data).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.listSensorDevices(data)
        // this.newEventData = res.flatMap((item: any) => item.devices_data);
        res.data.forEach((zone: any) => {
          zone.devices_data.sort((a: any, b: any) => a.lightStatus - b.lightStatus);
        });
        this.eventData = res.data;
        this.newEventData = this.eventData;
      } else {
        this.newEventData = [];
      }

      this.deviceData = this.eventData.flatMap((item: any) => item.devices_data);
      // this.sensorDevices = this.eventData.flatMap((item:any) => item.devices_data).map((data:any) => data.sensorDeviceId)
      // this.sensorType = this.eventData.flatMap((item:any) => item.devices_data).map((data:any) => data.sensorType)
      // this.zoneNames = Array.from(this.eventData, (item:any) => item.zoneId, item.zoneName)
      // this.zoneNames = this.eventData.map((site:any) => site.zoneId);
   
    }, (err: any) => {
      this.newEventData = [];
      this.showLoader = false;
    })
  }
  deviceData:any

  sortTable(data: any) {
    return data.sort((a: any, b: any) => (a.lightStatus < b.lightStatus) ? -1 : 1);
  }

  site:any
  sensorType:any =[]
  zoneNames:any =[]
  sensorDevices:any = []
  sensorDevicesData:any = [];
  listSensorDevices(data:any) {
    this.eventSer.listSensorDevices(data).subscribe((res:any)=> {
      console.log(res);
      this.sensorDevicesData = res.sensorDeviceIds
    })
  }

  sensorData:any = []
  currentItem:any = []
  opendeletemodal(item: any) {
    console.log(item)
    this.sensorData = item.data;
 
    var x = <HTMLElement>document.getElementById('deletemodal')
    x.style.display = "block";
  
  }

  // siteId: any = '';
  device_name: any = '';
  // objectName: any = '';
  zoneId: any = '';
  sensortype: any = '';
  sensorDeviceId:any = ''
  // toDate: any = '';
  filter() {
    this.showLoader = true;
    this.eventSer.listSensorData({ siteId: this.currentSite?.siteId, sensorDeviceId: this.sensorDeviceId, zoneId: this.zoneId, sensortype: this.sensortype }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        // this.newEventData = res.flatMap((item: any) => item.devices_data);
        this.newEventData = res.data;
      } else {
        this.newEventData = [];
      }
    })
  }

  tempRanges: any;
  getMetadata() {
    let data = this.storageService.getEncrData('metaData');
    for(let item of data) {
      if(item.typeName == `tempRangeForSensor${this.currentSite?.siteId}`) {
        this.tempRanges = item.metadata;
      }
    }
  }

  pageSize = 12;
  currentPage = 1;
  get totalPages(): number {
    return Math.ceil(this.newEventData.length / this.pageSize);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.newEventData?.slice(start, end);
  }

  setPage(page: any): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  searchText: any;
  searchText1: any;

  currentVideoData: any;
  tableIndex: any;
  openPlayModel(data: any, index: any) {
    this.currentVideoData = data;
    this.tableIndex = index;
    var x = <HTMLElement>document.getElementById('playModel');
    x.style.display = "block";
  }

  currentFullImage: any;
  openfullScreen(data: any) {
    this.currentFullImage = data
    var x = <HTMLElement>document.getElementById('fullScreen');
    x.style.display = "block";
  }

  closeModel(type: string) {
    if(type === 'playModel') {
      this.tableIndex = null;
    }
    var x = <HTMLElement>document.getElementById(type)
    x.style.display = "none";
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    // var x = this.newEventData.flatMap((item: any) => item.devices_data);
    var x = this.newEventData;
    var y = this.newEventData[0].devices_data;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
      y?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
      y?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  convertToNum(data: any) {
    // return Number(data.split(' ')[0])
    return Number(data)
  }

  getColor(data: any, minTemp: any, maxTemp: any) {
    let status = Number(data.status);
    let sensorId = data.sensorId.split('')[0];
    let newminTemp = Number(minTemp);
    let newmaxTemp = Number(maxTemp);
    return (status < newminTemp && sensorId === 'T') ? true : (status > newmaxTemp && sensorId === 'T') ? true : false;
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted1 = !this.sorted1;
    var x = this.newEventData;
    if (this.sorted1 == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
