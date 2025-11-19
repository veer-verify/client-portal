import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateFormatter } from '../services/customDateFormatter';
import { DatePipe, formatDate } from '@angular/common';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { SiteService } from '../services/site.service';
import { AlertService } from '../services/alertservice/alert-service.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: CustomDateFormatter }]
})
export class IncidentsComponent implements OnInit {

  constructor(
    private apiservice: ApiService,
    public storageService: StorageService,
    public datepipe: DatePipe,
    private proxSer: ProximityService,
    private eventSer: EventService,
    public storageSer: StorageService,
    private siteService: SiteService,
    private alert:AlertService
  ) {
     this.storageService.site_sub.subscribe((res) => {
      this.currentInfo = res;
      this.currentSite = res?.site;
       })
  }

  environment = environment.commonDownUrl + '/downloadFile_1_0?requestName=incidents&assetName=';
  userData: any;
  currentTime: any;
  currentInfo: any
  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.getSitesListForUserName();
    let d1 = new Date();
    let d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() - 360);
    this.currentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us');

    this.getTags();
  }

  isVideo(data: string) {
    if(!data) return;
    let arr = ['mp4', 'avi'];
    return arr.includes(data?.split('.')[data.split('.').length - 1])
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


  // showLoader: boolean = false;
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
    this.storageService.loading_text = '';
    this.siteService.getSitesListForUserName(this.userData).subscribe((res: any) => {
    this.storageService.loading_text = null;
    this.siteData = res?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
      // this.getsitesListByService(res.sites);
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
        // this.storageService.site_sub.next({site: this.siteData[0], index: 0});
         this.storageService.site_sub.next({site: this.siteData[0]});
      }
      // this.getsiteservices1(this.currentInfo?.site);

      this.footageList(this.currentInfo?.site);
    }, (err: any) => {
    this.storageService.loading_text = 'NO DATA!';
    })
  }

  // getsitesListByService(sites: any){
  //   this.showLoader=true;

  //   let data = Array.from(sites, (item: any) => item.siteId);
  //   this.siteSer.getsitesListByService({sites:data, service:'alerts'}).subscribe((res:any)=>{
  //      this.showLoader=false;
  //     if(res.statusCode==200){
  //        this.siteData=res?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);

  //     }
  //     else{
  //       this.siteData=[]
  //     }
  //   })

  // }

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

@ViewChildren('siteselect') siteselect!: QueryList<ElementRef>;
scrollToSite(siteId: number) {
  setTimeout(() => {
    const index = this.siteData.findIndex((site:any) => site.siteId === siteId);
    const elements = this.siteselect.toArray();  // Convert to real array
    const el = elements[index];
    if (el) {
      el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 1000);
}


  footageList(data: any) {
    // this.storageService.storeEncrData('navItem', { site: data, index: this.siteData.indexOf(data ) });

    if(data) {
      this.camerasListForSites(data);
      this.scrollToSite(data?.siteId);
    }
    // if(this.currentInfo.index != 0) {
      // this.storageService.site_sub.next({site: data, index: this.siteData.indexOf(data)});
      this.storageService.site_sub.next({site: data});
    // }

    this.currentSite = data;
    this.displaySite = data;
    // this.getsiteservices1(data);
      this.navActive = this.siteData.findIndex(
          (site: any) => site.siteId === data.siteId
        );


    let d = new Date().setMonth(new Date().getMonth() + 1);
    this.todayDate = {
      year: new Date(d).getFullYear(),
      month: new Date(d).getMonth(),
      day: new Date(d).getDate()
    }

    this.newEventData = [];
    this.storageService.loading_text = '';
   
    this.eventSer.incidentList({...data,pageSize:this.pageSize}).subscribe((res: any) => {
      this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);
      if (res.statusCode == 200) {
        this.storageService.loading_text = null;
        this.eventData = res.IncidentList.sort((a: any, b: any) => a.createdTime > b.createdTime ? -1 : a.createdTime < b.createdTime ? 1 : 0);
        this.newEventData = this.eventData;
      } else {
                this.storageService.loading_text = 'No DATA!';
      }
    }, (err: any) => {
    this.storageService.loading_text = 'NO DATA!';
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
    pageSize:number=10;

    filter(type?: string | Event) {
    // this.currentSite.siteId = this.siteId;

    let pageNumber;
    type == 'next' ? pageNumber = this.currentPage + 1 : type == 'prev' ? pageNumber = this.currentPage - 1 : pageNumber = type;
    if(pageNumber == (this.totalPages + 1)) return;

    console.log(pageNumber,this.currentPage)

    let x = this.siteData.map((item: any) => item.siteId).indexOf(Number(this.currentSite?.siteId));
    this.navActive = x;
    this.newEventData = [];
    this.storageService.loading_text = '';
    this.eventSer.incidentList({
      siteId: this.currentSite?.siteId,
      cameraId: this.cameraId,
      actionTag: this.actionTag,
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: pageNumber,
      pageSize:this.pageSize
    }).subscribe((res: any) => {
    this.storageService.loading_text = null;
      this.currentPage = res.page;
      this.totalPages = res.totalPages;
      this.selectNumbers = new Array(this.totalPages).fill(0).map((d, i) => i+1);
      if (res.statusCode === 200) {
        this.newEventData = res.IncidentList.sort((a: any, b: any) => a.createdTime > b.createdTime ? -1 : a.createdTime < b.createdTime ? 1 : 0);
      }
    }, (err) => {
    this.storageService.loading_text = 'NO DATA!';
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
    this.currentVideoData = null;
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

spinexcel:boolean=false;
  incidentsDataToExcel(){

    if(this.fromDate && this.toDate){

      this.spinexcel=true;

      let payload={
        siteId:this.currentSite.siteId,
        fromDate :this.fromDate,
        toDate : this.toDate
      }

      this.siteService.incidentsDataToExcel(payload).subscribe({
      next: (res: ArrayBuffer) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Alerts-report.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
         this.spinexcel=false;
      },
      error: (err) => {
        this.alert.error('Download failed:', err);
         this.spinexcel=false;
      },
    });
    }
    else{
      this.alert.error('error',"Please fill start Date and end Date")
    }
  }
}
