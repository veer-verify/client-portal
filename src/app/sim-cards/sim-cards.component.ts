import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { EventService } from '../services/event.service';
import { ProximityService } from '../services/proximity.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-sim-cards',
  templateUrl: './sim-cards.component.html',
  styleUrls: ['./sim-cards.component.css']
})
export class SimCardsComponent {


  
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
      this.storageService.site_sub.subscribe((res) => {
        this.currentInfo = res;
        this.navActive = res?.index
      });
      let d1 = new Date();
      let d2 = new Date(d1);
      d2.setMinutes (d1.getMinutes() - 360);
      this.currentTime = formatDate(d2, 'yyyy-MM-ddThh:mm:ss', 'en-us');

      this.getSitesListForUserName();
      this.getTags();
  }

  openSim:boolean = false;
  open(type:string) {
    if(type == 'close') {
      this.openSim = true
    }
  }

  closeSim(type:string) {
    if(type == 'close') {
      this.openSim = false
    }
  }



  currentTableDataForEdit:any = []
  currentSimDataEdit:any
  openPlayModelForEdit(data: any, index: any) {
    var x = <HTMLElement>document.getElementById('playModel1');
    x.style.display = "block";
    this.currentSimDataEdit = JSON.parse(JSON.stringify(data)); 
  }

  updateSimDetailsForSim() {
    this.currentSimDataEdit.editedBy = 1;
    this.currentSimDataEdit.id = this.currentSimDataEdit.simId;
    this.proxSer.updateSimDetailsForSim(this.currentSimDataEdit).subscribe((res:any)=> {
      // console.log(res)
      this.currentTableDataForEdit = res;
      if(res.statusCode == 200) {
        this.closeModel('playModel1');
        this.alertService.success('success', res?.message);
        this.footageList(this.currentInfo?.site, this.currentInfo?.index);
      } else {
        this.alertService.error('error', res?.message)
      }
     
    })
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
    this.apiservice.getSitesListForUserName(this.userData).subscribe((sites: any) => {
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
        this.storageService.site_sub1.next({site: this.siteData[0], index: 0});
      }
      // this.getsiteservices1(this.currentInfo?.site);
      this.footageList(this.currentInfo?.site, this.currentInfo?.index);
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
    // this.storageService.storeEncrData('navItem', {site: data, index: index});
    this.storageService.site_sub1.next({site: data, index: index});
    this.camerasListForSites(data);
    this.currentSite = data;
    // this.siteId = this.currentSite?.siteId ? this.currentSite?.siteId : this.currentSite?.siteId;
    // this.getsiteservices1(data);
    this.navActive = index;
    this.showLoader = true;
    this.proxSer.getSimDetailsForSiteId(data).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if (res.statusCode == 200) {
        this.eventData = res.data
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
    this.proxSer.getSimDetailsForSiteId({ siteId: this.currentSite?.siteId, cameraId: this.cameraId, actionTag: this.actionTag, fromDate: this.fromDate, toDate: this.toDate }).subscribe((res: any) => {
      this.showLoader = false;
      if (res.statusCode === 200) {
        this.newEventData = res.data
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
  currentSimData: any;
  currentTableData: any = [];
  tableIndex: any;
  openPlayModel(data: any, index: any) {
    this.currentSimData = data;
    this.tableIndex = index;
    var x = <HTMLElement>document.getElementById('playModel');
    x.style.display = "block";
    this.proxSer.deviceSimStats(data).subscribe((res:any)=> {
      this.currentTableData = res.stats;
    })
    
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
    var x = this.newEventData;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sort1(label: any) {
    this.sorted = !this.sorted;
    var x = this.currentTableData;
    if (this.sorted == false) {
      x?.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x?.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  generatePDF1(videoData: any) {
    this.showLoader = true;
    const data: any = document.getElementById('canvas');
    html2canvas(data, { useCORS: true }).then(canvas => {
      this.showLoader = false;
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'px', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${videoData?.eventId}.pdf`);
    });
  }

  
  @ViewChild('reportDialog', { static: false }) reportDialog!: ElementRef;
  generatePDF() {
    const doc = new jsPDF();
    const table = this.reportDialog.nativeElement;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('table-data.pdf');
    });
  }

}
