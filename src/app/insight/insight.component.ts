import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { NgbDate, NgbDatepickerNavigateEvent, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit {
  @ViewChild('optionlabel') optionlabel: ElementRef;
  zoomIn: boolean = false;


  startDate: any;
  endDate: any;
  reports: any;
  showLoader = false;
  today = new Date();
  maxDate: any;
  searchText: any;
  cols: any[];
  pipe = new DatePipe('en-us');
  keysVerification: any;
  weekends: any;


  constructor(
    private apiservice: ApiService,
    private alertservice: AlertService,
    public storageService: StorageService,
    private router: Router,
    private eRef: ElementRef,
    private http: HttpClient,
    private datePipe: DatePipe,
    private siteSer: SiteService
  ) { }

  user: any;
  currentInfo: any
  ngOnInit(): void {
    // this.getsitenonworkingdays();
    this.user = this.storageService.getEncrData("user");
    this.storageService.site_sub.subscribe((res) => {
      this.currentInfo = res;
      if (res) {
        this.storageService.storeEncrData('currentSite', res.site);
        // this.listInsightImages(res?.site);
      }
    })
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = { year: x, month: y, day: z };
    this.getSitename();
  }

  sites: any = []
  reportsite = "";
  currentsite: any;
  currentsiteid: any;
  placeholderhere = "";

  // serviceData: any;
  // getsiteservices1(site: any){
  //   this.siteSer.listSiteServices(site).subscribe((res: any) => {
  //     this.serviceData = res.siteServicesList;
  //   })
  // }

  removeDuplicateSites() {
    var names_array_new = this.sites.reduceRight(function (r: any, a: any) {
      r.some(function (b: any) { return a.siteId === b.siteId; }) || r.push(a);
      return r;
    }, []);
    this.sites = names_array_new.reverse();
  }

  getSitename() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.user).subscribe((res: any) => {
      this.showLoader = false;
      if (res.status == 'Failed') {
        if (res.Message == "Data not available") {
          // this.router.navigateByUrl('/guard');
        }
      } else {
        this.sites = res.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
        // this.currentSite = this.sites[0].siteName
        // this.getsiteservices1(this.currentInfo?.site);

        if (!this.currentInfo) {
          this.storageService.site_sub.next({ site: this.sites[0], index: 0 });
        }

        // var sitelist = this.sites.sites
        // const sortAlphaNum = (a: any, b: any) => a.siteName.localeCompare(b.siteName, 'en', { numeric: true })
        // sitelist = this.sites.sites.sort(sortAlphaNum);

        // this.firstreport();
        this.getsitenonworkingdays();
        var user = this.storageService.getEncrData("user");
        if (user.UserName == 'sales@ivisecurity.com') {
          this.sites.forEach((item: any) => {
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
      }
    }, (error) => {
      if (error.ok == false) {
        this.apiservice.onHTTPerror(error);
      }
    })
  }

  getDayName(date: Date): any {
    return this.datePipe.transform(date, 'EEEE');
  }


  reportsd: any;
  reported: any;
  getreports(site: any) {
    // this.reportsd = y;
    // this.reported = z;
    this.placeholderhere = "";
    this.showLoader = true;
    var user = this.storageService.getEncrData("user");
    if (user.UserName != 'sales@ivisecurity.com') {
      this.apiservice.getBiAnalyticsReport(site, this.displaYstartDate, this.displaYendDate).subscribe((res: any) => {
        this.showLoader = false;
        if (res.status != "Failed") {
          res = res.AnalyticsReportList;
          this.reportsite = this.currentsite;
          if (res.length == 0) { res = null };
          // this.showOptions();
          var ar: any = [];
          if (res != null) {
            res.forEach((el: any) => {
              el.data.forEach((eld: any) => {
                var keyslist = (Object.keys(eld));
                let ary: any = [];
                keyslist.forEach(elem => {
                  if (elem != 'icon' && elem != 'type') {
                    var capsName = this.apiservice.makeTitleForTables(elem);
                    ary.push({ field: elem, header: capsName })
                  }
                });
                ary = ary.sort((a: any, b: any) => (a.header > b.header ? 1 : -1));
                this.cols = ary;
                this.keysVerification = ar.concat(keyslist.filter((item) => ar.indexOf(item) < 0))
              });
            });
          }
          this.reports = res;
          if (this.reports == null) {
            this.placeholderhere = "NO DATA AVAILABLE!";
          }
        } else {
          this.reportsite = this.currentsite;
          this.showLoader = false;
          this.reports = null;
          this.placeholderhere = res.Message
          this.getsiteservices();
        }
      },
        (error: any) => {
          this.showLoader = false;
          setTimeout(() => { this.showLoader = false; }, 1000);
          this.alertservice.warning("Error", "Something went wrong please try after some time ");
        });
    } else if (user.UserName == 'sales@ivisecurity.com') {
      this.showLoader = true;
      let dayName = this.getDayName(this.displaYstartDate);
      let url: any;
      if (this.currentsite == 'Your Gas Station') {
        url = 'assets/insight-data/yoursGasStation.json';
      } else if (this.currentsite == 'Your Machinery Service') {
        url = 'assets/insight-data/yoursMachinery.json';
      } else if (this.currentsite == 'Your Shopping Center') {
        url = 'assets/insight-data/yoursShoppingCenter.json';
      } else if (this.currentsite == 'Your Pharmacy') {
        url = 'assets/insight-data/yoursPharmacy.json';
      }
      this.http.get(url).subscribe((x: any) => {
        // console.log(x);
        setTimeout(() => this.showLoader = false, 1000);
        if (dayName == 'Sunday') {
          x = x.Sun;
          this.reports = x;
        } else if (dayName == 'Monday') {
          x = x.Mon;
          this.reports = x;
        } else if (dayName == 'Tuesday') {
          x = x.Tue;
          this.reports = x;
        } else if (dayName == 'Wednesday') {
          x = x.Wed;
          this.reports = x;
        } else if (dayName == 'Thursday') {
          x = x.Thu;
          this.reports = x;
        } else if (dayName == 'Friday') {
          x = x.Fri;
          this.reports = x;
        } else if (dayName == 'Saturday') {
          x = x.Sat;
          this.reports = x;
        }

        this.reportsite = this.currentsite;
        var ar: any = [];
        if (x != null) {
          x.forEach((el: any) => {
            el.data.forEach((eld: any) => {
              var keyslist = (Object.keys(eld));
              let ary: any = [];
              keyslist.forEach(elem => {
                if (elem != 'icon' && elem != 'type') {
                  var capsName = this.apiservice.makeTitleForTables(elem);
                  ary.push({ field: elem, header: capsName })
                }
              });
              ary = ary.sort((a: any, b: any) => (a.header > b.header ? 1 : -1));
              this.cols = ary;
              this.keysVerification = ar.concat(keyslist.filter((item) => ar.indexOf(item) < 0))
            });
          });
        }
      });
      // console.log(this.reports)
    }
  }

  getcols(r: any) {
    let ary: any = [];
    const result = r.data.reduce((e1: any, e2: any) => e1.length > e2.length ? e1 : e2);
    // console.log( "Element of arr having longest a:", result );
    var keys = (Object.keys(result));
    keys.forEach((elem: any) => {
      if (elem != 'icon' && elem != 'type') {
        var capsName = this.apiservice.makeTitleForTables(elem);
        ary.push({ field: elem, header: capsName })
      }
    });
    ary = ary.sort((a: any, b: any) => (a.header > b.header ? 1 : -1));
    return ary;
  }

  firstreport() {
    var p = this.storageService.getEncrData('currentSite');
    this.currentsite = p.siteName;
    this.currentsiteid = p.siteId;

    // this.setweekenddisable();
    var siteId = p.siteId;
    this.startDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'dd-MM-yyyy');
    this.endDate = this.startDate;
    var yesterday = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
    var startDateParts: any = this.startDate.split("-");
    var endDateParts: any = this.endDate.split("-");
    var sd = this.months[Number(startDateParts[1]) - 1] + ' ' + startDateParts[0] + ', ' + startDateParts[2]
    var ed = this.months[Number(endDateParts[1]) - 1] + ' ' + endDateParts[0] + ', ' + endDateParts[2];
    if (sd != ed) { this.selectedSpan = sd + ' - ' + ' ' + ed } else { this.selectedSpan = sd }

    // setTimeout(() => {
    //   if(this.lastWorkingDay ){
    //     yesterday = this.lastWorkingDay;
    //    this.getreports(siteId,yesterday,yesterday);
    //   //  console.log(yesterday);
    //   //  console.log(new Date(this.lastWorkingDay))
    //   } else{
    this.getsitenonworkingdays();

    //  this.getreports(siteId,yesterday,yesterday);
    //   }
    // },2000)

    // else{
    // this.getsitenonworkingdays();
    // this.getreports(siteId,this.lastWorkingDay,this.lastWorkingDay);
    //   if(!this.lastWorkingDay){
    //     this.getreports(siteId,yesterday,yesterday);
    //   }
    // }

    // console.log("yesdate",yesterday)

    // this.displaYstartDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM-dd-yyyy');
    // this.displaYendDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM-dd-yyyy');
    // this.minenddate = { year: Number(this.displaYstartDate.split('-')[2]), month: Number(this.displaYstartDate.split('-')[0]), day: Number(this.displaYstartDate.split('-')[1]) };

  }

  getsitenonworkingdays() {
    var p = this.storageService.getEncrData('currentSite');
    var siteId = p.siteId;
    this.currentsite = p.siteName;
    this.currentsiteid = p.siteId;
    // var year = (new Date()).getFullYear();
    // var yeararr = [year - 1, year - 2, year - 3, year - 4];
    // var datesarr: any = [];

    this.apiservice.getNonWorkingDays(siteId, this.displaYstartDate?.year).subscribe((res: any) => {
      if (res.status == "Success") {
        // if (res.LastWorkingDay !== "") {
        this.disabledDates = res.NotWorkingDaysList
          // var dateParts = res.LastWorkingDay.split('-');
          // this.lastWorkingDay = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2]
          // this.displaYstartDate = this.pipe.transform(new Date(this.lastWorkingDay), 'MM-dd-yyyy');

          this.startDate = this.endDate = res.LastWorkingDay.split('-')[2] + '-' + res.LastWorkingDay.split('-')[1] + '-' + res.LastWorkingDay.split('-')[0];
          this.displaYstartDate = {year: Number(res.LastWorkingDay.split('-')[0]), month: Number(res.LastWorkingDay.split('-')[1]), day: Number(res.LastWorkingDay.split('-')[2])};
          // console.log(this.displaYstartDate)
          this.selectedSpan = `${this.months[this.displaYstartDate.month - 1]}, ${this.displaYstartDate.year}`;

          // this.displaYendDate = this.pipe.transform(new Date(this.lastWorkingDay), 'MM-dd-yyyy');
          // this.minenddate = { year: Number(this.displaYstartDate.split('-')[2]), month: Number(this.displaYstartDate.split('-')[0]), day: Number(this.displaYstartDate.split('-')[1]) };
          this.getreports(siteId);
          this.minenddate = this.displaYstartDate;
          this.dates(res.NotWorkingDaysList);
        // }
        
        // datesarr.push(res.NotWorkingDaysList);
        // this.datesarr = datesarr.flat();
        // yeararr.forEach((el: any) => {
        //   this.apiservice.getNonWorkingDays(siteId, el).subscribe((res: any) => {
        //     if (res.status == "Success") {
        //       datesarr.push(res.NotWorkingDaysList);
        //       this.datesarr = datesarr.flat();
        //       this.displaYstartDate = {year: Number(this.lastWorkingDay?.split('-')[0]), month: Number(this.lastWorkingDay?.split('-')[1]), day: Number(this.lastWorkingDay?.split('-')[2])}
        //     }
        //   })
        // });
        // setTimeout(() => {
        //   this.dates(this.datesarr)
        // }, 2000);

      } else {
        // var yesterday = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
        // this.dates([]);
        this.selectedSpan = `${this.months[this.displaYstartDate.month - 1]}, ${this.displaYstartDate.year}`;
        this.getreports(siteId);
        this.disabledays = false
      }
    })
  }

  disabledays: any
  // lastWorkingDay: any;
  currentSite: any;
  siteClicked(site: any) {
    this.currentSite = site;
    this.storageService.site_sub.next({ site: site, index: this.sites.indexOf(site) });
    this.storageService.storeEncrData('currentSite', site);
    this.currentsite = site.siteName;
    this.currentsiteid = site.siteId;
    // this.getsiteservices1(site);
    this.optionlabel.nativeElement.click();
    // this.setweekenddisable();
    // this.showLoader = true;
    // this.apiservice.getServices(site.siteId);
    this.getsitenonworkingdays();
  }

  setweekenddisable() {
    // this.dates(this.datesarr)
    var a;
    //  add beow when received no data dates as array
    // this.apiservice.clientServices(this.currentsiteid).subscribe((res: any) => {
    //   a = res.nonWorkingDays;
    //   if (a == "Sat-Sun") {
    //     this.disabledays = this.weekend
    //   } else if (a == "Sun") {
    //     this.disabledays = this.sunday
    //   } else {
    //     this.disabledays = false;
    //   }
    // })
  }

  weekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6; // sat sun off
  }

  sunday(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0;
  }

  // datesarr = ["2022-05-02", "2022-05-03", "2022-05-21", "2022-05-24", "2022-05-11", "2022-05-06"];
  dates(arr: any[]) {
    // if(arr.length !== 0) {}
    arr.forEach(el => {
      var splits: any = el.split("-");
      this.disabledDates.push({ year: +splits[0], month: +splits[1], day: +splits[2] })
    });
    this.disabledays = this.isDisabled;
  }

  disabledDates: NgbDateStruct[] = [
    { year: 2019, month: 2, day: 26 }
  ]

  isDisabled = (date: NgbDateStruct, current: { month: number, year: number }) => {
    return this.disabledDates.find(x => new NgbDate(x.year, x.month, x.day).equals(date)) ? true : false;
  }

  // For input Data of Start and End Date of Report
  startDateValue() {
    const date = (document.getElementById("startDate") as HTMLInputElement).value;
    this.startDate = date;
  }

  endDateValue() {
    const date = (document.getElementById("endDate") as HTMLInputElement).value;
    this.endDate = date;
  }
  
  displaYstartDate: any;
  displaYendDate: any;
  minenddate = { year: 2014, month: 1, day: 1 };
  // onDateSelect(event: any, select: any) {
  //   this.selectedMonth = '';
  //   var x = event.day;
  //   var y = event.month;
  //   var a;
  //   var b;
  //   if (x < 10) { a = '0' + x; } else { a = x };
  //   if (y < 10) { b = '0' + y; } else { b = y };
  //   if (select == 'end') { this.endDate = a + '-' + b + '-' + event.year; this.displaYendDate = b + '-' + a + '-' + event.year };
  //   if (select == 'start') {
  //     this.startDate = a + '-' + b + '-' + event.year; this.displaYstartDate = b + '-' + a + '-' + event.year;
  //     this.minenddate = { year: event.year, month: event.month, day: event.day };
  //   };
  // }

  generateReport() {
    // this.listInsightImages(this.currentSite);
    var dateParts: any = this.startDate.split("-");
    var start = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    var dateParts1: any = this.endDate.split("-");
    var end = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]);
    if (this.startDate != "null" && this.endDate != "null") {
      if (start > end) {
        this.alertservice.warning("Error", "Start Date cannot be later than End Date")
      } else {
        this.getsitenonworkingdays()
        // this.getAnalyticsData();
      }
    } else {
      if (this.reports == null) {
        this.alertservice.warning("Information", "Currently, we dont have data for this table")
      }
    }

    this.closemodal();
  }


  // To get analytics report data to display according to date
  getAnalyticsData() {
    var x = this.currentsiteid;
    var y = this.startDate.split("-").reverse().join("-");
    var z = this.endDate.split("-").reverse().join("-");
    var startDateParts: any = this.startDate.split("-");
    var endDateParts: any = this.endDate.split("-");
    var sd = this.months[Number(startDateParts[1]) - 1] + ' ' + startDateParts[0] + ', ' + startDateParts[2];
    var ed = this.months[Number(endDateParts[1]) - 1] + ' ' + endDateParts[0] + ', ' + endDateParts[2];
    if (sd != ed) { this.selectedSpan = sd + ' - ' + ' ' + ed } else { this.selectedSpan = sd }
    this.getreports(x);
  }


  downloadReport() {
    this.showLoader = true;
    this.apiservice.getsiteid(this.currentsiteid).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        // console.log(res,this.reportsd.replaceAll("/", "-"), this.reported.replaceAll("/", "-"))
        this.apiservice.downloadReport1(res, this.reportsd.replaceAll("/", "-"), this.reported.replaceAll("/", "-")).subscribe(
          data => {
            var file = new Blob([data], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            //  window.open(fileURL);
            this.downloadFile(fileURL)
          }, (error: any) => {
            this.showLoader = false;
            this.alertservice.success("Error", "Something went wrong. Please Try Again.")
          }
        );
      }
    }, (error: any) => {
      this.showLoader = false;
      this.alertservice.success("Error", "Something went wrong. Please Try Again.")
    })
  }
  downloadFile(filePath: any) {
    this.showLoader = false;
    var link = document.createElement('a');
    link.href = filePath;
    // link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    // link.download =this.currentsite + '-' + this.startDate + 'to'+ this.endDate;
    link.download = this.currentsite + ' - ' + this.selectedSpan.replace("-", "to");
    link.click();
  }

  images: any
  listInsightImages(data: any) {
    this.apiservice.listInsightImages(data).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.images = res;
      } else {
        this.images = []
      }
    })
  }

  currentImg: any

  // for month selection from search bar
  visible = false
  selectedSpan = "";
  openmonths(event: any) {
    this.visible = true;
    var x = (document.getElementById("searchbox") as HTMLInputElement);
    x.classList.add("padd")
  }
  loadMonthReport() {
    // this.showLoader = true
    var startDate = this.startDate.split("-").reverse().join("-");
    var endDate = this.endDate.split("-").reverse().join("-");
    this.getreports(this.currentsiteid);
  }
  dateNavigate($event: NgbDatepickerNavigateEvent) {
    var month = $event.next.month;
    var year = $event.next.year;
    var lastDate = new Date(year, month, 0).getDate();
    var a; var b
    if (month < 10) { a = '0' + month; } else { a = month };
    this.startDate = '01-' + a + '-' + $event.next.year;
    this.endDate = lastDate + '-' + a + '-' + $event.next.year;
  }
  // for months selector
  years = Array((new Date().getUTCFullYear()) - ((new Date().getUTCFullYear()) - 20)).fill('').map((v, idx) => (new Date().getUTCFullYear()) - idx);
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  selectedMonth = "Select Month"
  nextYear() {
    var y = this.years[0] + 1;
    var z = new Date().getUTCFullYear();
    if (this.years[0] < z) { this.years.splice(0, 0, y); }
  }
  prevYear() {
    if (this.years[0] > 2014) { this.years = this.years.slice(1); }
  }
  currentMonthIndex = ((new Date()).getMonth());
  currentyear = new Date().getUTCFullYear();
  monthselected = false;
  selectedmonth(i: any) {
    if ((this.years[0] == this.currentyear && i <= this.currentMonthIndex) || this.years[0] < this.currentyear) {
      this.monthselected = true;
      this.visible = false;
      this.selectedMonth = this.months[i] + ' ' + this.years[0];
      // this.selectedMonth = this.months[i] +', '+ this.years[0];
      var month = i + 1;
      var year = this.years[0];
      if (this.years[0] == this.currentyear && i == this.currentMonthIndex) {
        var lastDate = new Date().getDate();
      } else {
        var lastDate = new Date(year, month, 0).getDate();
      }
      var a;
      if (month < 10) { a = '0' + month; } else { a = month };
      this.startDate = '01-' + a + '-' + year;
      this.endDate = lastDate + '-' + a + '-' + year;

      this.displaYstartDate = a + '-01-' + year;
      this.displaYendDate = a + '-' + lastDate + '-' + year;
      this.minenddate = { year: Number(this.displaYstartDate.split('-')[2]), month: Number(this.displaYstartDate.split('-')[0]), day: Number(this.displaYstartDate.split('-')[1]) };
    }
  }

  // searchMonthreport() {
  //   if (this.monthselected == true) {
  //     this.visible = false;
  //     this.getAnalyticsData();
  //   }
  // }

  onInput(e: any) {
    var x = e.target.value;
    var items = this.sites
    var a: any[] = items.filter((item: any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
    if (a.length != 0) {
      if (!this.optionlabel.nativeElement.classList.contains('active')) {
        this.optionlabel.nativeElement.click();
      }
    }
    (this.optionlabel.nativeElement.nextElementSibling.scrollHeight)
  }

  toggleAccordian(event: any) {
    if (this.sites.length > 1) {
      return this.apiservice.toggle(event)
    }
  }
  showOptions() { return this.apiservice.showOptions() }
  showOptions1() { return this.apiservice.showOptions1() }
  closemodal() { return this.apiservice.closemodal(); }
  toQRmodal() { return this.apiservice.toQR() }
  makeTitleForTable(a: any) { return this.apiservice.makeTitleForTables(a) }

  clickoutside() {
    console.log("outside")
  }

  @ViewChild("month") monthmodal: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(e: any): void {
    if (this.visible) {
      if (!this.monthmodal.nativeElement.contains(e.target)) {
        this.visible = !this.visible
      } else { }
    }
  }
  getsiteservices() {
    this.apiservice.siteservices$.subscribe((res: any) => {
      var services = this.storageService.getEncrData('siteservices');
      if (services) {
        if (services.Status != "Failed") {
          var servs = services.Services;
          if (servs.business_intelligence != "T") {
            var x = <HTMLElement>document.getElementById('toSupportmodal')
            x.style.display = "block";
            this.placeholderhere = "";
          }
        } else {
        }
      }
    })
  }
  closeWarnModal() {
    var x = <HTMLElement>document.getElementById('toSupportmodal')
    x.style.display = "none";
    this.placeholderhere = "Please subscribe to Business Intelligence to view Insights"
  }
  toSupport() {
    this.router.navigateByUrl('/support')
  }

  openZoomModel(data: any) {
    this.currentImg = data;
    var x = <HTMLElement>document.getElementById('imgModel')
    x.style.display = "block";
  }

  closeZoomModal() {
    var x = <HTMLElement>document.getElementById('imgModel')
    x.style.display = "none";
  }

}
