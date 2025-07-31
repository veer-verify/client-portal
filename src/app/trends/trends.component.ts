import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
// import { Color, Label } from 'ng2-charts';
import { ApiService } from '../services/api.service';
import { ChartService } from '../services/charts/chart.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  @ViewChild('optionlabel') optionlabel: ElementRef;
  @ViewChild('optionlabel1') optionlabel1: ElementRef;
  @ViewChild('op') panel: ElementRef;


startDate: any;
endDate :any;
reports : any;
showLoader = false;
today = new Date();
maxDate: any;
minDate:any;
displayDate:any;
sites:any = [];
rsdata:any;
currentsite:any;
currentsiteid:any;
searchText: any;
searchField: any;
reportsite="";
placeholderhere= "";
pipe = new DatePipe('en-us');
yesterday:any;
lastday:any;
lastmonth:any;
prevmonth:any;
weekseq:any;
weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

constructor(
  private apiservice:ApiService,
  private chartservice:ChartService,
  private storageService:StorageService,
  private siteSer: SiteService,
  private router:Router) { }

user: any;
currentInfo: any
ngOnInit(): void {
  this.user = this.storageService.getEncrData("user");
  this.storageService.site_sub.subscribe((res) => {
    this.currentInfo = res;
  })
  // this.currentInfo = this.storageService.getEncrData('navItem');
    // for maxdate as today
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = {year: x, month: y, day: z};
    this.minDate={year: 2014, month: 1, day: 1}
    var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
    this.gettimelines(yesterday);
    this.displayDate = this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'MM-dd-yyyy');

    this.getSitename();

    // this.getResearchData('1002','2022/03/01');
    // this.getBiTrends("1002","2022/03/01","8");
    // this.getTrendsData();
}

// serviceData: any;
// getsiteservices1(site: any){
//   this.siteSer.listSiteServices(site).subscribe((res: any) => {
//     this.serviceData = res.siteServicesList;
//   })
// }

seletedresearch:any;
getResearchData(siteId:any, date:any){
  this.gettimelines(date)
  this.showLoader=true;
  this.reportsite = this.currentsite;
  this.apiservice.getBiAnalyticsResearch(this.currentsiteid, date).subscribe((res:any)=>{
    // console.log(res)
    if(res.status != "Failed"){
      this.showLoader=false;
      this.placeholderhere = "";
      var filter;
      // filter = res.AnalyticsList.sort(function (a:any, b:any) {return a.service.localeCompare(b.service);});
      filter = res.AnalyticsList;
      this.rsdata = filter;
      if(this.currentfield == null || this.currentfieldid == null){
        this.seletedresearch = filter[0];
        this.currentfield = filter[0].service;
        this.currentfieldid = filter[0].serviceId;
      }

      // if(filter.length !== 0) {
        this.getBiTrends();
      // }
    }else{
      this.showLoader=false;
      // this.placeholderhere = "Data is not available for selected date. Please choose different date.";
      this.placeholderhere = "Please select a date to view your TRENDS"
      const y = <any>(document.getElementById("graphholder"));
      y.innerHTML = '';
      this.rsdata = null;
      this.getsiteservices();
    }
  })
}
graphsdata:any;
getBiTrends(){
  var date;
  var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd');
  if(this.startDate == null){
    if(this.lastWorkingDay != null){
      date = this.lastWorkingDay;
    }else{
      date = yesterday
    }
  }else{
    var startDateParts:any = this.startDate.split("-");
    date =  [(startDateParts[2])]+'-'+startDateParts[1] +'-'+ startDateParts[0];
  }

  this.showLoader = true;
  this.apiservice.getBiTrends1(this.currentsiteid, date, this.currentfieldid).subscribe((res:any)=>{
    // console.log(res)
    this.showLoader = false;
    if(res.status === "Success") {
      this.graphsdata = res.AnalyticsTrends;
    } else {
      this.graphsdata = [];
    }
    
    const y = <any>(document.getElementById("graphholder"));
    if(y) {
      y.innerHTML = '';
    }
    this.graphsdata.forEach((el:any) => {
      y.insertAdjacentHTML("beforeend",
      `<div class='card' style="margin:8px; padding:5px;"><div id=${'container'+String(this.graphsdata.indexOf(el))}></div></div>`);
      this.mychart(el,this.graphsdata.indexOf(el));
    });
  }, (err) => {
    this.rsdata = null;
  this.placeholderhere = "Please subscribe to Business Intelligence to view Trends"
    this.showLoader = false;
  })
}
mychart(info:any, index:any){
  var arr=[];
  let obj = info.data;
  for(let item in obj){
    var i =(obj[item])
    if(String(i.value).includes(":")){
      i.value = i.value.replace(/[^\d.]/g, '.');
    }
    arr.push([i.title,Number(i.value)]);
  }
  var charttitle = info.type;
  if(charttitle == 'DAY'){subtitle='Information about last seven days performance with respect to the selected date'}
  if(charttitle == 'WEEK'){subtitle='Information about last four weeks performance with respect to the week of selected date'}
  if(charttitle == 'MONTH'){subtitle='Information about last three months performance with respect to the month of selected date'}
  if(charttitle == 'QUARTER'){subtitle='Information about last four quarters performance with respect to the quarter of selected date'}
  /*
  var obj= info[Object.keys(info)[0]];
  console.log(obj)
  for(var item in obj){
    if(String(obj[item]).includes(":")){
      obj[item] = obj[item].replace(/[^\d.]/g, '.');
    }
    arr.push([item,Number(obj[item])])
  }
  if(Object.keys(info)[0] == 'DAY'){subtitle='Information about last seven days performance with respect to the selected date'}
  if(Object.keys(info)[0] == 'WEEK'){subtitle='Information about last four weeks performance with respect to the week of selected date'}
  if(Object.keys(info)[0] == 'MONTH'){subtitle='Information about last three months performance with respect to the month of selected date'}
  if(Object.keys(info)[0] == 'QUARTER'){subtitle='Information about last four quarters performance with respect to the quarter of selected date'}
  */
  var subtitle = '';
  var charttype = 'line';
  var threeD = false;
  var title = charttitle;
  var antype = charttitle;
  var elementid = 'container'+String(index);
  var data =
    arr.reverse();
    //[ ['91 Minutes', 91],
    // ['50 Minutes', 50],
    // ['66 Minutes', 66] ];
    //  [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
    //   {y: 216.4, marker: { fillColor: '#BF0B23', radius: 10 } }, 194.1, 95.6, 54.4];
  this.chartservice.createchart(charttype, threeD, title, subtitle, antype, data, elementid)
}
getSitename(){
  this.showLoader = true;
  this.siteSer.getSitesListForUserName(this.user).subscribe((res:any) => {
    this.showLoader = false;
    if(res.status == 'Failed'){
      if(res.Message == "Data not available"){
        // this.router.navigateByUrl('/guard')
      }
      else{
        this.apiservice.refresh();
        setTimeout(()=>{
          this.getSitename();
        },1000)
        }
        }else{
          // res.siteList.sort(function (a:any, b:any) {return a.siteName.localeCompare(b.siteName);});
          // console.log(res)
          this.sites = res.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
          // this.getsiteservices1(this.currentInfo?.site);
          if(!this.currentInfo) {
            this.storageService.site_sub.next({site: this.sites[0], index: 0});
          }

      // var sitelist = this.sites
      // const sortAlphaNum = (a:any, b:any) => a.siteName.localeCompare(b.siteName, 'en', { numeric: true })
      var user = this.storageService.getEncrData("user");
        if(user.UserName == 'sales@ivisecurity.com'){
          this.sites.forEach((item:any) => {
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
          // sitelist= sitelist.sort(sortAlphaNum);
          // this.sites.siteList = sitelist;
          // this.removeDuplicateSites();
          this.firstreport();
        }else{
          // this.sites.siteList = sitelist;
          // this.removeDuplicateSites();
          this.firstreport();
        }

      this.removeDuplicateSites();
      // setTimeout(() => {this.optionlabel.nativeElement.click()}, 500);
      this.firstreport();
      }
  },(error)=>{
    if(error.ok== false){
      this.apiservice.onHTTPerror(error);
    }
    console.log("Something went wrong");
  })
}
removeDuplicateSites(){
  var names_array_new =this.sites.reduceRight(function (r:any, a:any) {
    r.some(function (b:any) { return a.siteId === b.siteId; }) || r.push(a);
    return r;
  }, []);
  this.sites = names_array_new.reverse();
}
firstreport(){
  var p = this.storageService.getEncrData('currentSite');
  // if(p == null){
  //   // this.router.navigateByUrl('/guard')
  // }
  this.currentsite = p.siteName;
  this.reportsite = this.currentsite;
  this.currentsiteid = p.siteId;
  // this.showLoader=true;
  this.getsitenonworkingdays();

    // setTimeout(() => {
    //   if(this.lastWorkingDay){
    //     // console.log(this.lastWorkingDay)
    //     this.getResearchData(this.currentsiteid,this.lastWorkingDay);
    //   }else{
    //     var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy/MM/dd')
    //     this.getResearchData(this.currentsiteid,yesterday);
    //   }
    // }, 2000);
}
siteClicked(e:any, site:any){
  // this.showLoader = true;
  this.graphsdata = null;
  // this.storageService.storeEncrData('navItem', {site: site, index: e.target.index});
  this.storageService.site_sub.next({site: site, index: this.sites.indexOf(site)});

  this.storageService.storeEncrData('siteidfromgaurdpage', site);
  this.currentsite = site.siteName;
  this.currentsiteid = site.siteId
  // this.apiservice.getServices(site.siteId);
  // this.getsiteservices1(site)
  // e.target.parentNode.parentNode.previousElementSibling.click()
  this.optionlabel.nativeElement.click();
  this.rsdata = null;
  var date;
  var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
  if((this.startDate) == null){date = yesterday}else{
    var startDateParts:any = this.startDate.split("-");
    date =  [(startDateParts[2])]+'-'+startDateParts[1] +'-'+ startDateParts[0];
  }
  // this.getResearchData(this.currentsiteid,date);
  // this.rsdata = null;
  this.getsitenonworkingdays();
}
currentfield:any;
currentfieldid:any;
fieldClicked(field:any){
  // console.log(field)
  this.graphsdata = null;
  this.currentfield = field.service;
  this.currentfieldid = field.serviceId;
  this.optionlabel1.nativeElement.click();
  this.seletedresearch = field;
}
getResearchonClick(){
  this.placeholderhere = "";
  if(this.startDate == null){
    // var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
    this.getResearchData(this.currentsiteid, this.lastWorkingDay);
  } else {
    var startDateParts: any = this.startDate.split("-");
    var sd = (startDateParts[2]) + '-'+startDateParts[1] + '-' + startDateParts[0]
    this.getResearchData(this.currentsiteid, sd);
  }
  this.closemodal();
}
onDateSelect(event:any, select:any){
  var x = event.day;
  var y = event.month;
  var a;
  var b;
  if(x<10){a = '0' + x;} else{ a = x };
  if(y<10){b = '0' + y;} else { b = y };
  if(select == 'start'){this.startDate = a+'-'+b+'-'+ event.year; this.displayDate=b+'-'+a+'-'+ event.year};
}
gettimelines(date:any){
  var d = new Date(date)
  this.yesterday =this.pipe.transform(new Date().setDate(d.getDate() - 1), 'yyyy-MM-dd');
  if((d.getDay()) != 0){this.lastday = this.weekdays[(d.getDay())];}
  else{this.lastday = this.weekdays[0]}
  if((d.getMonth()) != 0){this.lastmonth = this.months[(d.getMonth()) -1]; this.prevmonth=this.months[(d.getMonth()) -2]}
  else{this.lastmonth = this.months[0];this.prevmonth = this.months[11]; }
  var seq=['first', 'second', 'third', 'fourth', 'fifth']
  this.weekseq= seq[(Math.ceil(d.getDate() / 7))]
}
onInput(e:any){
  var x = e.target.value;
  var items = this.sites
  var a:any[] = items.filter((item:any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
  if(a.length!=0){
    if(!this.optionlabel.nativeElement.classList.contains('active')){
      this.optionlabel.nativeElement.click();
      this.optionlabel1.nativeElement.click();
    }
  }
  (this.optionlabel.nativeElement.nextElementSibling.scrollHeight)
  (this.optionlabel1.nativeElement.nextElementSibling.scrollHeight)
}

toggleAccordian(event:any) { return this.apiservice.toggle(event)  }
showOptions(){return this.apiservice.showOptions()}
showOptions1(){return this.apiservice.showOptions1()}
closemodal(){return this.apiservice.closemodal();}
toQRmodal(){return this.apiservice.toQR()}




selectedSpan:any;
lastWorkingDay:any;
datesarr=[];
disabledays:any;
disabledDates:NgbDateStruct[]=[{year:2019,month:2,day:26}]
getsitenonworkingdays(){
  var p =  this.storageService.getEncrData('currentSite');
  var siteId=p.siteId;
  // var year = (new Date()).getFullYear();
  // var yeararr=[year-1, year-2, year-3, year-4]
  // var datesarr:any=[]
  this.apiservice.getNonWorkingDays(siteId).subscribe((res:any)=>{
    if(res.status=="Success") {
      // if(res.LastWorkingDay !== "") {
        var dateParts = res.LastWorkingDay.split('-');
        this.lastWorkingDay = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2]
        this.selectedSpan = this.months[Number(dateParts[1])-1]+' '+dateParts[0] +', '+ dateParts[2];
        this.displayDate = dateParts[1]+'-'+dateParts[2]+'-'+ dateParts[0];
        this.getResearchData(this.currentsiteid, this.lastWorkingDay);
      // }

      // datesarr.push(res.NotWorkingDaysList);
      // this.datesarr = datesarr.flat();
      // if(this.currentsiteid == siteId){
      //   this.getResearchData(this.currentsiteid, this.lastWorkingDay);
      // }
      // yeararr.forEach((el:any) => {
      //   this.apiservice.getNonWorkingDays(siteId,el).subscribe((res:any)=>{
      //     if(res.status=="Success"){
      //       datesarr.push(res.NotWorkingDaysList);
      //       this.datesarr = datesarr.flat()
      //     }
      //   })
      // });
      // setTimeout(() => {
      //   this.dates(this.datesarr)
      // }, 2000);
    }else{
      console.log("Trends : Last working day is not available")
      var yesterday =this.pipe.transform(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd')
      this.getResearchData(this.currentsiteid,yesterday);
      this.dates([]);
    }
  })
}
dates(arr:any[]){
  arr.forEach(el => {
    var splits:any = el.split("-");
    var newdate;
    this.disabledDates.push({year:+splits[0],month:+splits[1],day:+splits[2]})
  });
  this.disabledays = this.isDisabled;
}
isDisabled=(date:NgbDateStruct,current: {month: number,year:number})=> {
  return this.disabledDates.find(x=>new NgbDate(x.year,x.month,x.day).equals(date))?
  true:false;
}


getsiteservices(){
  this.apiservice.siteservices$.subscribe((res:any)=>{
      var services = this.storageService.getEncrData('siteservices');
      if(services){
        if(services.Status != "Failed"){
          var servs= services.Services;
          if(servs.business_intelligence != "T"){
            var x = <HTMLElement>document.getElementById('toSupportmodal1')
            x.style.display = "block";
            this.placeholderhere = "";
          }
        }else{
        }
      }
  })
}
closeWarnModal(){
  var x = <HTMLElement>document.getElementById('toSupportmodal1')
  x.style.display = "none";
  this.placeholderhere = "Please subscribe to Business Intelligence to view Trends"
}
toSupport(){
  this.router.navigateByUrl('/support')
}






// obsolete function


// for reports
trenddata:any;
filtereddata:any;
xaxis:any = [];
yaxis:any = [];
antypes:any = [];
annames:any = [];
getTrendsData(){
  this.apiservice.getBiTrends('PEOPLECOUNT','01-17-2022').subscribe((res:any)=>{
    // console.log(res)
    this.trenddata = res;
    // for filtering type and sorting wrt timeline
    this.filtereddata = this.trenddata.filter((el:any) => el.analyticTypeValue =="ENTER")
    this.filtereddata.sort(function (a:any, b:any) {return a.arrivalTime.localeCompare(b.arrivalTime);});
    // making chart array by adding count for condition
    const a = Array.from(this.filtereddata.reduce(
      (m:any, {cameraHour, count}:{cameraHour:any, count:any} ) => m.set(cameraHour, (m.get(cameraHour) || 0) + count), new Map
      ), ([cameraHour, count]) => ({cameraHour, count}));
      a.forEach(el => {this.xaxis.push(el.cameraHour);
        this.yaxis.push(el.count)});
    // making array of analytics names from recieved data
    const cde = Array.from(this.trenddata.reduce((m:any,
      {analyticTypeId}:{analyticTypeId:any} ) => m.set(analyticTypeId, (m.get(analyticTypeId) || 0)),
      new Map), ([analyticTypeId]) => ({analyticTypeId}));
      cde.forEach(el => {this.annames.push(el.analyticTypeId)});
      (this.selectedanalyticname = this.annames[0])
    // making array of analytics types from recieved data
    const abc = Array.from(this.trenddata.reduce((m:any,
      {analyticTypeValue}:{analyticTypeValue:any} ) => m.set(analyticTypeValue, (m.get(analyticTypeValue) || 0)),
      new Map), ([analyticTypeValue]) => ({analyticTypeValue}));
      abc.forEach(el => {this.antypes.push(el.analyticTypeValue)});
      (this.selectedanalytictype= this.antypes[0])
      if(this.filtereddata){
        // setTimeout(()=>{this.instantiateChart();},500);
      }
  })
}
currentItem: any;
selectedanalytictype:any;selectedanalyticname:any;
selectAnalytic(event:any, param:any){
  if(param == "type"){this.selectedanalytictype = (event.target.innerText);}
  if(param == "name"){this.selectedanalyticname = (event.target.innerText);}
  var x = event.target.parentNode.parentNode;
  x.style.maxHeight = null;
  (x.previousElementSibling.classList.toggle('active'))
}

getTrendsDataonclick(){
  // console.log(this.startDate, this.endDate, this.selectedanalyticname, this.selectedanalytictype)
  this.getResearchData(this.currentsiteid,this.yesterday);
}

//chart library code - linechart
public lineChartLabels = this.xaxis;
public lineChartOptions: (ChartOptions&{annotation?: any}) = {responsive: true,};
public lineChartColors = [
  {
    borderColor: 'gradient',
    backgroundColor: 'rgba(255,255,255,0.3)',
  }
];
public lineChartLegend = true;
public lineChartType: any = 'line';
public lineChartPlugins = [];
instantiateChart(){
  const canvas = <HTMLCanvasElement> document.getElementById('chart');
  const ctx:any = canvas.getContext('2d');
  var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  gradientStroke.addColorStop(0, "#80b6f4");
  gradientStroke.addColorStop(1, "#f49080");
}

public lineChartData: ChartDataset[] = [
  {
    data: this.yaxis,
    label: "PEOPLECount",
    // lineTension: 0,
    tension: 0,
    pointBorderColor: "#55bae7",
    fill: false,
  }
];

//chart library code - bar chart
public barChartLabels: any[] = this.xaxis;
public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartPlugins = [];
public barChartOptions: ChartOptions = {
  responsive: true,
};

public barChartData: ChartDataset[] = [
  { data: this.yaxis, label: 'PEOPLE Count' },
  // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
];




daaata=[
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:26:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 10, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:06:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:21:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:16:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:26:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "09:22:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:15:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:12:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:10:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 12, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},

{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 5, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:40:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:08:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:50:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:55:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:14:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "09:58:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:36:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "08:50:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "10:49:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},

{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:26:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 5, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:06:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:21:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:35:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "08:16:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 6, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "10:26:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 3, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "09:22:00", cameraDate: "01-10-2022", cameraHour: "09", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "07:15:00", cameraDate: "01-10-2022", cameraHour: "07", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "08:12:00", cameraDate: "01-10-2022", cameraHour: "08", cameraName: "IVISUSA1009", count: 1, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},
{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "DRIVEIN", arrivalTime: "10:10:00", cameraDate: "01-10-2022", cameraHour: "10", cameraName: "IVISUSA1009", count: 2, countType: "enter", departureTime: "0", id: 19, refactorBy: 0, refactoringTo: "", totalTime: "0"},

{ accountId: "1004", analyticTypeId: "PEOPLECOUNT", analyticTypeValue: "ENTER", arrivalTime: "07:06:00",  cameraDate: "01-10-2022",  cameraHour: "07",  cameraName: "IVISUSA1009",  count: 1,  countId: 1,  countType: "enter",  departureTime: "0",  id: 19,  refactorBy: 0,  refactoringTo: "",  totalTime: "0"}
]


calcperc(i:any){
  // console.log(i)
  if(i.count.includes("/") || i.variance.includes("/")){
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance))
    return Math.ceil((i.variance));
  }
  else if(i.count.includes(":") || i.variance.includes(":")){
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance))
    return Math.ceil((i.variance));
  }
  else{
    var percdiff  = ((parseInt(i.variance))*100)/parseInt(i.count);
    if(i.count == 0){var diff = 0;}
    else{diff = Math.ceil(percdiff)}
    // console.log((parseInt(i.count)-parseInt(i.variance)),(i.count),(i.variance),diff,percdiff)
    return diff;
  }
}



}



