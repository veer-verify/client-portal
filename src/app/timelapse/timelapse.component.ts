import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/auth/storage.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-timelapse',
  templateUrl: './timelapse.component.html',
  styleUrls: ['./timelapse.component.css']
})
export class TimelapseComponent implements OnInit {

  model: NgbDateStruct;
  environment = environment.commonDownUrl + '/downloadFile_1_0?requestName=incidents&assetName=';

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
    currentInfo: any;
    ngOnInit(): void {
      this.userData = this.storageService.getEncrData('user');
      // this.currentInfo = this.storageService.getEncrData('navItem');
      // console.log(this.currentInfo)

      this.storageService.site_sub.subscribe((res) => {
        this.currentInfo = res;
        this.navActive = res?.index
      })
      let d1 = new Date();
      let d2 = new Date(d1);
      d2.setMinutes (d1.getMinutes() - 1440);
      this.currentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us')

      this.getSitesListForUserName();
      this.getTags();
  }

  serviceData: any;
  getsiteservices1(site: any){
    this.siteSer.listSiteServices(site).subscribe((res: any) => {
      this.serviceData = res.siteServicesList;
    })
  }


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
  closemodal() { return this.apiservice.closemodal(); }
  toQRmodal() { return this.apiservice.toQR() }


  showLoader: boolean = false;
  sites: boolean = true;
  devices: boolean = false;

  @ViewChild('panel') panel: ElementRef;
  openSites() {
    this.sites = true;
    this.devices = false;
    this.closemodal();
  }

  openDevices() {
    this.sites = false;
    this.devices = true;
    this.closemodal();
  }

  siteData: any = [];
  // getSites() {
  //   this.showLoader = true;
  //   this.apiservice.getSites().subscribe((res: any) => {
  //     this.showLoader = false;
  //     if (res.Status === "Success") {
  //       this.siteData = res.siteList.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
  //       this.camerasListForSites(this.siteData[0]);
  //       if(this.currentInfo) {
  //         this.footageList(this.currentInfo?.site, this.currentInfo?.index);
  //       } else {
  //         this.footageList(this.siteData[0], 0);
  //       }
  //     } else if (res.Status === "Failed") {
  //       this.getSitesListForUserName();
  //     }
  //   }, (err: any) => {
  //     this.showLoader = false;
  //   })
  // }


  getSitesListForUserName() {
    this.showLoader = true;
    this.apiservice.getSitesListForUserName(this.userData).subscribe((sites: any) => {
      // console.log(sites);
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
      this.getsiteservices1(this.currentInfo?.site)
      this.camerasListForSites(this.siteData[0]);

      if(!this.currentInfo) {
        this.storageService.site_sub.next({site: this.siteData[0], index: 0});
      }

      // if(this.currentInfo) {
        this.footageList(this.currentInfo?.site, this.currentInfo?.index);
      // } else {
      //   this.footageList(this.siteData[0], 0);
      // }
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  camData: any = [];
  camerasListForSites(siteId: any) {
    this.eventSer.camerasListForSites(siteId).subscribe((res: any) => {
      this.camData = res;
    });
  }

  actionTags: any = [];
  getTags() {
    this.proxSer.getMetadataByType(36).subscribe((res: any) => {
      this.actionTags = res[0].metadata;
    })
  }

  eventData: any = [];
  newEventData: any = [];
  currentSite: any;
  navActive!: number;
  footageList(data: any, index: any) {
    this.fromDate = ''
    this.storageService.storeEncrData('navItem', {site: data, index: index});
    this.storageService.site_sub.next({site: data, index: index});
    this.camerasListForSites(data);
    this.currentSite = data;
    // this.siteId = this.currentSite?.siteId ? this.currentSite?.siteId : this.currentSite?.siteId;
    this.getsiteservices1(data)
    this.navActive = index;
    this.showLoader = true;
    this.eventSer.listTimeLapseVideos(data).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res.statusCode == 200) {
        this.eventData = res.timeLapseList;
        this.newEventData = this.eventData;
      } else {
        this.newEventData = [];
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  // siteId: any = '';
  cameraId: any = '';
  objectName: any = '';
  actionTag: any = '';
  fromDate: any = '';
  toDate: any = '';
  filter() {
    this.showLoader = true;
    this.eventSer.listTimeLapseVideos({ siteId: this.currentSite.siteId, cameraId: this.cameraId, fromDate: this.fromDate, toDate: this.toDate }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.newEventData = res.timeLapseList
      } else {
        this.newEventData = [];
      }
    })
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
  showCreateAdd: boolean = false;
  open() {
    this.showCreateAdd = true;
  }

  closeIncident() {
    this.showCreateAdd = false;
  }

  currentVideoData: any;
  tableIndex: any;
  isVideo: boolean = false;
  openPlayModel(data: any) {
    this.currentItem = data;
    var x = <HTMLElement>document.getElementById('playModel');
    x.style.display = "block";
  }

  currentItem: any;
  openInfoModel(data: any) {
    this.currentItem = data;
    var x = <HTMLElement>document.getElementById('infoModel');
    x.style.display = "block";
  }

  closeModel(type: string) {
    this.tableIndex = null;
    var x = <HTMLElement>document.getElementById(type)
    x.style.display = "none";
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newEventData;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
}

}
