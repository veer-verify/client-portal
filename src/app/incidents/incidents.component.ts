import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateFormatter } from '../services/customDateFormatter';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateFormatter }]
})
export class IncidentsComponent implements OnInit {

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private alertService: AlertService,
    private authservice: AuthService,
    private storageService: StorageService,
    public datepipe: DatePipe,
    private proxSer: ProximityService,
    private eventSer: EventService,
    private siteSer: SiteService,
    public storageSer: StorageService
  ) { }

  environment = environment.commonDownUrl + '/downloadFile_1_0?requestName=incidents&assetName=';
  // commonsUrl: string = 'https://commonssl.ivisecurity.com/common/downloadFile_1_0?requestName=incidents&assetName='
  userData: any;
  currentTime: any;
  currentInfo: any
  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    // this.currentInfo = this.storageService.getEncrData('navItem');
    this.storageService.site_sub.subscribe((res) => {
      this.currentInfo = res;
      this.navActive = res?.index
    })
    let d1 = new Date();
    let d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() - 360);
    this.currentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us');

    this.getSitesListForUserName();
    this.getTags();
  }

  // serviceData: any;
  // getsiteservices1(site: any) {
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
    this.apiservice.getSitesListForUserName(this.userData).subscribe((sites: any) => {
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
        this.storageService.site_sub.next({site: this.siteData[0], index: 0});
      }
      // this.getsiteservices1(this.currentInfo?.site);


      this.footageList(this.currentInfo?.site, this.currentInfo?.index);
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  getsitesListByService(){
    
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

  getDisplySite(site: any) {
    console.log(site)
    if(site) {
      this.camerasListForSites({siteId: site});
    }
    let x = this.siteData.filter((item: any) => site == item.siteId);
    this.displaySite = x[0];
  }

  displaySite: any;
  eventData: any = [];
  newEventData: any = [];
  currentSite: any;
  navActive!: number;
  todayDate: any;
  footageList(data: any, index: any) {
    // this.storageService.storeEncrData('navItem', { site: data, index: this.siteData.indexOf(data ) });
    
    if(data) {
      this.camerasListForSites(data);
    }
    // if(this.currentInfo.index != 0) {
      this.storageService.site_sub.next({site: data, index: this.siteData.indexOf(data)});
    // }
    
    this.currentSite = data;
    this.displaySite = data;
    // this.getsiteservices1(data);
    this.navActive = index;
    
    let d = new Date().setMonth(new Date().getMonth() + 1);
    this.todayDate = {
      year: new Date(d).getFullYear(),
      month: new Date(d).getMonth(),
      day: new Date(d).getDate()
    }
    
    this.newEventData = [];
    this.showLoader = true; 
    this.eventSer.incidentList(data).subscribe((res: any) => {
      this.showLoader = false;
      this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);
      if (res.statusCode == 200) {
        this.eventData = res.IncidentList.sort((a: any, b: any) => a.createdTime > b.createdTime ? -1 : a.createdTime < b.createdTime ? 1 : 0);
        this.newEventData = this.eventData;
      }
    }, (err: any) => {
      this.showLoader = false;
    })
  }
    
    // siteId: any
    cameraId: any = '';
    objectName: any = '';
    actionTag: any = '';
    fromDate: any = '';
    toDate: any = '';
    selectNumbers: any = [];

    currentPage: number;
    totalPages: number;
    filter(type?: string | Event) {
    // this.currentSite.siteId = this.siteId;
    
    let pageNumber;
    type == 'next' ? pageNumber = this.currentPage + 1 : type == 'prev' ? pageNumber = this.currentPage - 1 : pageNumber = type;
    if(pageNumber == (this.totalPages + 1)) return;

    let x = this.siteData.map((item: any) => item.siteId).indexOf(Number(this.currentSite?.siteId));
    this.navActive = x;
    this.newEventData = [];
    this.showLoader = true;
    this.eventSer.incidentList({
      siteId: this.currentSite?.siteId,
      cameraId: this.cameraId,
      actionTag: this.actionTag,
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: pageNumber
    }).subscribe((res: any) => {
      this.showLoader = false;
      this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);
      if (res.statusCode === 200) {
        this.newEventData = res.IncidentList.sort((a: any, b: any) => a.createdTime > b.createdTime ? -1 : a.createdTime < b.createdTime ? 1 : 0);
      }
    }, (err) => {
      this.showLoader = false
    })
  }

  download() {
    this.eventSer.incidentsDataToExcel(
      {
        siteId: this.currentSite?.siteId,
        fromDate: this.fromDate,
        toDate: this.toDate,
      }
    ).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  searchText: any;
  currentVideoData: any;
  tableIndex: any;
  openPlayModel(data: any, index: any) {
    this.currentVideoData = data;
    this.currentTileItem = data.files[0];
    this.tableIndex = index;
    var x = <HTMLElement>document.getElementById('playModel');
    x.style.display = "block";
  }

  tilePageSize = 4;
  currentTilePage = 1;
  get getTilePages() {
    return Math.ceil(this.currentVideoData?.files.length / this.tilePageSize);
  }

  get currentTiles() {
    let start = (this.currentTilePage - 1) * this.tilePageSize;
    let end = start + this.tilePageSize;
    return this.currentVideoData?.files.slice(start, end);
  }

  next() {
    this.currentTilePage++;
  }

  prev() {
    this.currentTilePage--;
  }

  currentTileItem: any;
  getCurrentTile(tile: any) {
    this.currentTileItem = tile;
  }

  currentFullImage: any;
  openfullScreen(data: any) {
    this.currentFullImage = data
    var x = <HTMLElement>document.getElementById('fullScreen');
    x.style.display = "block";
  }

  closeModel(type: string) {
    if (type === 'playModel') {
      this.tableIndex = null;
    }
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

  // @ViewChild('reportDialog', { static: false }) reportDialog!: ElementRef;
  // generatePDF1(videoData: any) {
  //   this.showLoader = true;
  //   setTimeout(() => {
  //     const data: any = document.getElementById('canvas');
  //     html2canvas(data, { useCORS: true }).then(canvas => {
  //       this.showLoader = false;
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       let pdf = new jsPDF('p', 'mm', 'a4');
  //       pdf.addImage(contentDataURL, 'PNG', 0, 0, 0, 0);
  //       pdf.save(`${videoData?.eventId}.pdf`);
  //     });
  //   }, 1000)
  // }

  async generatePdf() {
    this.showLoader = true;
    let urls: any = [];
    await this.currentVideoData.files.forEach((item: any) => {
      let isImg = item.split('.')[item.split('.').length - 1] != 'mp4' && item.split('.')[item.split('.').length - 1] != 'avi';
      if (isImg) {
        urls.push(this.environment + item);
      }
    });

    const doc = new jsPDF('p', 'px', [420, 420]);
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const img = await this.loadImage(url);
      const canvas = await this.imageToCanvas(img);
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) {
        doc.addPage();
      }
      doc.addImage(imgData, 'PNG', 10, 10, 400, 400);
    }
    this.showLoader = false;
    doc.save(`${new Date()}.pdf`);
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }

  private imageToCanvas(img: HTMLImageElement): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    });
  }
}
