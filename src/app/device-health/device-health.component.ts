import { DatePipe, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-device-health',
  templateUrl: './device-health.component.html',
  styleUrls: ['./device-health.component.css']
})
export class DeviceHealthComponent {

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private alertService: AlertService,
    private authservice: AuthService,
    public storageService: StorageService,
    public datepipe: DatePipe,
    private proxSer: ProximityService,
    private eventSer: EventService,
    private siteSer: SiteService
  ) { }

  columns = [
    // {
    //   id: 'siteId',
    //   label: 'site id',
    //   sort: true
    // },
    {
      id: 'siteName',
      label: 'site name',
      sort: true
    },
    {
      id: 'deviceId',
      label: 'device id',
      sort: true
    },
    {
      id: 'firstConnected',
      label: 'installation date',
      sort: true
    },
    {
      id: 'lastTimeLastConnected',
      label: 'site local time',
      sort: true
    },
    // {
    //   id: 'status',
    //   label: 'latest re-connected time',
    //   sort: false
    // },
    // {
    //   id: 'uptime',
    //   label: 'latest up / down time',
    //   sort: true
    // },
    {
      id: 'latestReconnectedTime',
      label: 'Recently Connected Time',
      sort: true
    },
     {
      id: 'latestUpOrDowntime',
      label: 'latestUp Or Downtime',
      sort: true
    },
    // {
    //   id: '',
    //   label: 'total up time',
    //   sort: true
    // },
    // {
    //   id: '',
    //   label: 'total down time',
    //   sort: true
    // },
    {
      id: '',
      label: 'device status',
      sort: true
    },
    {
      id: '',
      label: 'device downtimes',
      sort: false
    }
  ]

  selectNumbers: any = [];
  currentPage: number;
  totalPages: number;
  userData: any;
  currentInfo: any;

  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.storageService.site_sub.subscribe((res) => {
      this.currentInfo = res;
      this.navActive = res?.index
    })

    this.getSitesListForUserName();
    this.getTags();
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

  cameraId: any;
  siteData: any = [];
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.userData).subscribe((sites: any) => {
      this.showLoader = false;
      this.siteData = sites?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
      var user = this.storageService.getEncrData("user");
      if (user.UserName == 'sales@ivisecurity.com') {
        this.siteData.forEach((item: any) => {
          if (item.siteId == 36349) {
            item.siteName = "Your Shopping Center";
            item.siteShortName = "Machinery Service";
          }
          if (item.siteId == 36347) {
            item.siteName = "Your Pharmacy";
            item.siteShortName = "Machinery Service";
          }
          if (item.siteId == 36331) {
            item.siteName = "Your Machinery Service";
            item.siteShortName = "Machinery Service";
          }
        });
      }


      
      if(!this.currentInfo) {
        this.storageService.site_sub1.next({site: this.siteData[0], index: 0});
        this.footageList(this.siteData[0], 0);
      } else {
        this.footageList(this.currentInfo?.site, this.currentInfo?.index);
      };
      // this.eventSer.getHealth(this.currentInfo?.site).subscribe((res: any) => {
      //   this.showLoader = false;
  
      //   if(res.statusCode === 200) {
      //     this.eventData = res.DeviceHealthData;
      //     this.newEventData = this.eventData;
      //   } else {
      //     this.newEventData = [];
      //   }
      // }, (err: any) => {
      //   this.showLoader = false;
      // })
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
  timeSearches: any = [];
  deviceStatus: any = [];
  getTags() {
    this.proxSer.getMetadataByType(36).subscribe((res: any) => {
      this.actionTags = res[0].metadata;
    });
    this.proxSer.getMetadataByType(109).subscribe((res: any) => {
      this.timeSearches = res[0].metadata;
    })
    this.proxSer.getMetadataByType(110).subscribe((res: any) => {
      this.deviceStatus = res[0].metadata;
    })
  }

  getDisplySite(site: any) {
    if(site) {
      this.camerasListForSites({siteId: site});
    }
    let x = this.siteData.filter((item: any) => site == item.siteId);
    this.displaySite = x[0];
  }

  
  // paramBody = {
  //   siteId: null,
  //   time: 'All',
  //   status: 'All',
  // }
  displaySite: any;
  eventData: any = [];
  newEventData: any = [];
  currentSite: any;
  navActive!: number;
  footageList(data: any, index: any) {
    // this.storageService.storeEncrData('navItem', { site: data, index: this.siteData.indexOf(data) });
    // this.storageService.site_sub.next({site: data, index: this.siteData.indexOf(data)});
    if(data) {
      this.camerasListForSites(data);
    }
    this.currentSite = data;
    this.displaySite = data;
    this.navActive = index;

    this.showLoader = true;
    this.eventSer.getHealth(data).subscribe((res: any) => {
      this.showLoader = false;

      if(res.statusCode === 200) {
        this.eventData = res.DeviceHealthData;
        this.newEventData = this.eventData;
              this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);
      } else {
        this.newEventData = [];
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }


  siteId: any = '';
  time: any = '';
  status: any = '';

  filter(type?: string | Event) {

    let pageNumber;
    type == 'next' ? pageNumber = this.currentPage + 1 : type == 'prev' ? pageNumber = this.currentPage - 1 : pageNumber = type;
    if(pageNumber == (this.totalPages + 1)) return;

    let x = this.siteData.map((item: any) => item.siteId).indexOf(Number(this.currentSite.siteId));
    this.navActive = x;
    this.newEventData = [];
      
    this.showLoader = true;
    this.eventSer.getHealth({
        siteId: this.currentSite?.siteId,
        time: this.time,
        status: this.status,
        pageno: pageNumber,
        pagesize:10
        
    }).subscribe((res: any) => {
      this.showLoader = false;
      if(res.statusCode === 200) {
        this.eventData = res.DeviceHealthData;
        this.newEventData = this.eventData;
          this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);

      } else {
        this.newEventData = [];
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  downParams = {
    deviceId: null,
    days: 'All',
  }
  downTimes: any = [];
  downtimesForDeviceId() {
    this.downParams.deviceId = this.currentItem.deviceId
    this.eventSer.downtimesForDeviceId(this.downParams).subscribe((res: any) => {
      if(res.statusCode === 200) {
        this.downTimes = res.DeviceHealthData;
      } else {
        this.downTimes = [];
      }
    })
  }

  // pageSize = 12;
 
  // get totalPages(): number {
  //   return Math.ceil(this.newEventData.length / this.pageSize);
  // }

  // get paginatedData() {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   const end = start + this.pageSize;
  //   return this.newEventData?.slice(start, end);
  // }

  setPage(page: any): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  searchText: any;
  currentItem: any;
  openPlayModel(data: any, index: any) {
    this.currentItem = data;
    this.downtimesForDeviceId();
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

  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.downTimes;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}
