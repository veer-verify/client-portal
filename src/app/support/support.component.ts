import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  @ViewChild('catlabel') catlabel: ElementRef;
  @ViewChild('subcatlabel') subcatlabel: ElementRef;
  @ViewChild('statuslabel') statuslabel: ElementRef;
  @ViewChild('sitelabel') sitelabel: ElementRef;


  parentElement: any;
  childElement: any;
  childAcrdHeight: any;
  childAccordion: any;
  childAcrdElement: any;
  faq = false;
  contactUs = false;
  support = true;
  tnc = false;
  placeholder = "Data is not available";
  site: any;
  subscription: Subscription;


  constructor(
    private apiservice: ApiService,
    private alertService: AlertService,
    public storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private domsanitizer: DomSanitizer,
    private http: HttpClient,
    private siteSer: SiteService
  ) { }

  currentInfo: any;
  userData: any
  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.currentInfo = this.storageService.getEncrData('navItem');
    this.currentsite = this.currentInfo?.site.siteId
    this.subscription = this.apiservice.editProfile$.subscribe(() => {
      this.gethelpDeskCategories();
    });
    this.getSitesListForUserName();

    this.pdf();
    // if (window.innerWidth > 993) {
    //   if (window.innerHeight < 678) { this.paginatesize = 6 }
    //   if (window.innerHeight > 678) { this.paginatesize = 7 }
    //   if (window.innerHeight > 747) { this.paginatesize = 8 }
    //   if (window.innerHeight > 824) { this.paginatesize = 10 }
    // }
    var x = localStorage.getItem('tnc');
    if (x) {
      this.opentnc();
      localStorage.removeItem('tnc');
    }
  }
  
  ngAfterViewInit() {
    this.site = this.storageService.getEncrData('siteidfromgaurdpage');
    this.gethelpDeskCategories();
    let x = (new Date(Date.now()).getFullYear());
    let y = (new Date(Date.now()).getMonth() + 1);
    let z = (new Date(Date.now()).getDate());
    this.maxDate = { year: x, month: y, day: z };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  serviceData: any;
  getsiteservices1(site: any){
    this.siteSer.listSiteServices(site).subscribe((res: any) => {
      this.serviceData = res.siteServicesList;
    })
  }

  siteData: any
  getSitesListForUserName() {
    this.showLoader = true;
    this.apiservice.getSitesListForUserName(this.userData).subscribe((sites: any) => {
      this.showLoader = false;
      this.siteData = sites.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
      this.getHelpDeskRequests();
      this.getsiteservices1(this.currentInfo?.site);
    }, (err: any) => {
      this.showLoader = false;
    })
  }

  pagenumber = 1;
  paginatesize = 10;
  nextPage() {
    var x = Number(this.requests.length);
    var a = Math.ceil(x / this.paginatesize);
    var p = (Number(this.pagenumber))
    if (this.pagenumber != a) {
      this.pagenumber = p += 1;
      this.pagination()
    }
  }
  previousPage() {
    var p = (Number(this.pagenumber))
    if (this.pagenumber != 1) {
      this.pagenumber = p -= 1;
    }
    this.pagination()
  }
  paginatedRequestList: any = [];
  selectNumbers: any = [];
  selector() {
    var x = Number(this.requests.length);
    var y = Number(this.pagenumber);
    var a = Math.ceil(x / this.paginatesize);
    this.selectNumbers = new Array(a).fill(0).map((x, i) => i + 1); // [1,2,3,4,...,100]
  }

  pagination() {
    this.selector();
    // var requests = this.filtereddata.sort((a: any, b: any) => (a.serviceId < b.serviceId ? 1 : -1));
    var requests = this.filtereddata;
    var x;
    var y = Number(this.pagenumber)
    x = y -= 1
    var z = x * this.paginatesize
    var a = z + this.paginatesize
    const slicedArray = requests.slice(z, a);
    this.paginatedRequestList = slicedArray;
  }

  requests: any = [];
  categories: any = [];
  subcategories: any = [];
  totalsites: any = [];
  status: any = [];
  minstartdate: any = { year: 2014, month: 1, day: 1 };
  getHelpDeskRequests() {
    this.showLoader = true;
    this.placeholder = ""
    this.cdr.detectChanges();
    // this.selectedsite = this.currentInfo?.site ? this.currentInfo?.site : this.siteData[0].siteName;
    this.apiservice.getHelpDeskRequests().subscribe((res: any) => {
      this.showLoader = false;
      // console.log(res)
      if (res.statusCode === 200) {
        this.requests = res.serviceHelpDeskList;
        if (res.serviceHelpDeskList.length == 0) { this.placeholder = "There are no available request" }
        this.requests = (this.requests.filter(function (e: any) { return e.status !== 'Deleted' })).reverse();
        const a = res.serviceHelpDeskList.filter(function (e: any) { return e.status !== 'Deleted' });
        // var b = a.splice(a.findIndex((e:any) => e.status === "Deleted"),1);
        this.filtereddata = a;
        this.getfilterdata(a);
        this.pagination();
        if (a.length == 0) {
          this.placeholder = "There are no requests for this site."
        } else {
          let minDate = new Date(
            Math.min(...a.map((element: any) => {
                return new Date(element.createdTime);
              }),
            ),
          );
          if (minDate) {
            var pipe = new DatePipe('en-us');
            let dateparts: any = pipe.transform(new Date(minDate), 'dd/MM/yyyy')?.split("/");
            this.minstartdate = { year: dateparts[2], month: dateparts[1], day: dateparts[0] }
            // console.log(this.minstartdate)
          }
        }
      } else {
        this.requests = [];
        this.placeholder = "There are no requests for this site."
        this.cdr.detectChanges();
      }
    }, (err) => {
      this.showLoader = false;
      this.requests = [];
    })
  }

  currentsubcategory: any;
  currentcategory: any;
  getfilterdata(a: any) {
    // const cde = Array.from(a.reduce((m: any, { serviceCategoryName }: { serviceCategoryName: any }) => m.set(serviceCategoryName, (m.get(serviceCategoryName) || 0)),
    //   new Map), ([serviceCategoryName]) => ({ serviceCategoryName }));
    // cde.forEach(el => { this.categories.push(el.serviceCategoryName) });
    // this.categories = [...new Set(this.categories)];
    this.categories = Array.from(a, (x: any) => x.service_cat_name);

    // const efg = Array.from(a.reduce((m: any,
    //   { serviceSubCategoryName }: { serviceSubCategoryName: any }) => m.set(serviceSubCategoryName, (m.get(serviceSubCategoryName) || 0)),
    //   new Map), ([serviceSubCategoryName]) => ({ serviceSubCategoryName }));
    // efg.forEach(el1 => { this.subcategories.push(el1.serviceSubCategoryName) });
    // this.subcategories = [...new Set(this.subcategories)];
    this.subcategories = Array.from(a, (x: any) => x.service_subcat_name);

    // const hij = Array.from(a.reduce((m: any,
    //   { status }: { status: any }) => m.set(status, (m.get(status) || 0)),
    //   new Map), ([status]) => ({ status }));
    // hij.forEach(el1 => { this.status.push(el1.status) });
    // this.status = [...new Set(this.status)];
    this.status = Array.from(a, (x: any) => x.status);

    // const klm = Array.from(a.reduce((m: any,
    //   { accountShortName }: { accountShortName: any }) => m.set(accountShortName, (m.get(accountShortName) || 0)),
    //   new Map), ([accountShortName]) => ({ accountShortName }));
    // klm.forEach(el1 => { this.totalsites.push(el1.accountShortName) });
    // this.totalsites = [...new Set(this.totalsites)];
    // this.totalsites = (this.totalsites.filter((el: any) => { return el != null; }))
    this.totalsites = this.siteData;

  }

  selectedsite: any;
  selectedCategory: any;
  selectedSubcategory: any;
  selectedStatus: any;
  filtereddata: any = [];
  netfilter(type: any, site?: any) {
    var abc: any;
    if (type == 'site') {
      this.sitelabel.nativeElement.click();
      // this.categories = [];
      // this.subcategories = [];
      // this.status = [];
      // this.selectedCategory = null;
      // this.selectedSubcategory = null;
      abc = this.requests.filter((e: any) => { return e.accountShortName == this.selectedsite?.siteName });
      const efg = Array.from(abc.reduce((m: any,
        { serviceCategoryName }: { serviceCategoryName: any }) => m.set(serviceCategoryName, (m.get(serviceCategoryName) || 0)),
        new Map), ([serviceCategoryName]) => ({ serviceCategoryName }));
      efg.forEach(el1 => { this.categories.push(el1.serviceCategoryName) });
    }
    if (type == 'category') {
      // this.subcategories = [];
      // this.status = [];
      // this.selectedSubcategory = null;
      this.catlabel.nativeElement.click();
      abc = this.requests.filter((e: any) => { return e.serviceCategoryName == this.selectedCategory });
      const efg = Array.from(abc.reduce((m: any,
        { serviceSubCategoryName }: { serviceSubCategoryName: any }) => m.set(serviceSubCategoryName, (m.get(serviceSubCategoryName) || 0)),
        new Map), ([serviceSubCategoryName]) => ({ serviceSubCategoryName }));
      efg.forEach(el1 => { this.subcategories.push(el1.serviceSubCategoryName) });
    }
    if (type == 'subcategory') {
      this.subcatlabel.nativeElement.click();
    }
    if (type == 'status') {
      this.statuslabel.nativeElement.click();
    }
    this.pagination();
  }

  @ViewChild('selectedSiteEl') selectedSiteEl: ElementRef;
  searched: boolean = false;
  applysearchfilters() {
    var sitefilter;
    var catfilter;
    var subcatfilter;
    var datefilter;
    var rawdata;

    // this.selectedsite = this.selectedSiteEl.nativeElement.innerHTML;
    rawdata = (this.requests.filter(function (e: any) { return e.status !== 'Deleted' })).reverse();
    // console.log(rawdata)
    if (this.selectedsite) {
      this.searched = true;
      sitefilter = rawdata.filter((el: any) => { return el.siteName === this.selectedsite?.siteName });
    } else {
      sitefilter = rawdata;
    };
    // console.log(sitefilter)

    if (this.selectedCategory) {
      catfilter = sitefilter.filter((el: any) => { return el.service_cat_name === this.selectedCategory })
    } else {
      catfilter = sitefilter;
    }
    // console.log(catfilter)

    if (this.selectedSubcategory) {
      subcatfilter = catfilter.filter((el: any) => { return el.service_subcat_name === this.selectedSubcategory })
    } else { subcatfilter = catfilter }
    // console.log(subcatfilter)


    if (this.startDate) {
      var startDate = new Date(this.displaYstartDate);
      var endDate = new Date(this.displaYendDate);
      if (endDate.toString() == "Invalid Date") { endDate = new Date(this.displaYstartDate); endDate.setDate(endDate.getDate() + 1); }
      else { endDate.setDate(endDate.getDate() + 1); }
      var datefilter = subcatfilter.filter((a: any) => {
        var aDate = new Date(a.createdTime);
        startDate; endDate; aDate;
        return aDate <= endDate && aDate >= startDate;
      })
    } else { datefilter = subcatfilter }
    this.filtereddata = datefilter;
    if (this.filtereddata.length == 0) { this.placeholder = "There are no requests for selected search parameters." }
    this.pagenumber = 1;
    this.pagination();
    this.show = !this.show;
  }
  clearsearchfilters() {
    (this.selectedsite = undefined, this.selectedCategory = undefined, this.selectedSubcategory = undefined, this.selectedStatus = undefined, this.startDate = undefined, this.endDate = undefined);

    this.searched = false;

    this.displaYstartDate = undefined;
    this.displaYendDate = undefined;
    this.filtereddata = (this.requests.filter(function (e: any) { return e.status !== 'Deleted' })).reverse();
    this.pagination();
    this.show = !this.show;
  }

  filter() {
    var abc: any = [];
    if (this.selectedCategory == "Other")
      abc = this.requests.filter((e: any) => { return e.serviceCategoryName == this.selectedCategory });
  }
  startDate: any;
  endDate: any;
  displaYstartDate: any;
  displaYendDate: any;
  maxDate: any;
  minenddate: any;

  onDateSelect(event: any, select: any) {
    var x = event.day;
    var y = event.month;
    var a;
    var b;
    // console.log(select)
    if (x < 10) { a = '0' + x; } else { a = x };
    if (y < 10) { b = '0' + y; } else { b = y };
    if (select == 'end') {
      this.endDate = a + '/' + b + '/' + event.year; this.displaYendDate = b + '/' + a + '/' + event.year
    };
    if (select == 'start') {
      this.startDate = a + '/' + b + '/' + event.year; this.displaYstartDate = b + '/' + a + '/' + event.year;
      this.endDate = a + '/' + b + '/' + event.year; this.displaYendDate = b + '/' + a + '/' + event.year
      this.minenddate = { year: event.year, month: event.month, day: event.day };
    };
  }

  openfaq() {
    this.tnc = this.contactUs = this.support = false; this.faq = true; this.closemodal();
  }
  openContactUs() {
    this.tnc = this.faq = false; this.contactUs = true; this.support = false; this.closemodal();
  }
  openServiceHelpdesk() {
    this.tnc = this.faq = false; this.contactUs = false; this.support = true; this.closemodal();
  }
  opentnc() {
    this.faq = false; this.contactUs = false; this.support = false; this.tnc = true; this.closemodal();
  }

  toggleAccordian(event: any, index = 0) {
    var element = event.target;
    element.classList.add("active");
    var panel = element.nextElementSibling;
    this.parentElement = panel
    if (panel.style.maxHeight) {
      // panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    // to close the opened child accordion
    if (this.childAcrdHeight >= 0) {
      this.childAcrdElement.classList.toggle("active");
    }
  }

  toggleAccordian1(event: any, index = 0) {
    var element = event.target;
    element.classList.toggle("active");
    this.childAcrdElement = element;
    var panel1 = element.nextElementSibling;
    this.childElement = panel1;
    this.childAccordion = panel1;
    if (panel1.style.maxHeight) {
      panel1.style.maxHeight = null;
    } else {
      panel1.style.maxHeight = (panel1.scrollHeight) + "px";
      // to increase maxHeight of parent accordion element on opening child accordion
      this.parentElement.style.maxHeight = (Number(this.parentElement.scrollHeight) + Number(panel1.scrollHeight)) + "px";
    }
    // to save the child accordion height so as to close when parent is closed
    this.childAcrdHeight = panel1.scrollHeight;
  }

  toggleAccordian2(event: any, index = 0) {
    var element = event.target;
    element.classList.toggle("active");
    var panel2 = element.nextElementSibling;
    if (panel2.style.maxHeight) {
      panel2.style.maxHeight = null;
    } else {
      panel2.style.maxHeight = panel2.scrollHeight + "px";
      this.childElement.style.maxHeight = (Number(this.childElement.scrollHeight) + Number(panel2.scrollHeight)) + "px";
      this.parentElement.style.maxHeight = (Number(this.parentElement.scrollHeight) + Number(this.childElement.scrollHeight) + Number(panel2.scrollHeight)) + "px";
    }
  }

  message: string;
  bodyContent(e: any) {
    this.message = (e.target.value)
  }
  showLoader = false;
  submitIssue() {
    this.showLoader = true;
    let body = this.message;
    let subject = "Support Request"
    this.apiservice.sendEmail(body, subject).subscribe((res: any) => {
      this.showLoader = false;
      this.alertService.success("Success", "Request Sent Successfully")
    }, (error) => {
      this.showLoader = false;
      this.alertService.warning("Error", "Something went wrong. Please try again later.")
    })
  }

  showOptions() { return this.apiservice.showOptions() }
  showOptions1() { return this.apiservice.showOptions1() }
  closemodal() { return this.apiservice.closemodal(); }
  toQRmodal() { return this.apiservice.toQR() }
  togglePanel(event: any) {
    return this.apiservice.toggle(event)
  }

  toggletickets(event: any) {
    var element = event.target;
    element.classList.add("active");
    var panel = element.nextElementSibling;
    this.parentElement = panel
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    // to close the opened child accordion
    if (this.childAcrdHeight >= 0) {
      this.childAcrdElement.classList.toggle("active");
    }
  }

  show = false;
  filters() {
    this.show = !this.show;
  }
  showAddSite = false;
  closenow(value: any) {
    this.showAddSite = value;
  }

  requestbean = {
    PrefTimeToCall: '',
    assignedTo: null,
    assignedType: null,
    createdBy: '',
    createdTime: '',
    description: '',
    editedBy: null,
    editedTime: null,
    imagePath: null,
    priority: '',
    reason: null,
    reasonCategory: null,
    remarks: null,
    requestType: '',
    resolution: null,
    serviceCategoryName: '',
    serviceId: '',
    serviceSubCategoryName: '',
    status: '',
    // accountId:''
  }

  visible1 = false
  visible2 = false
  currentItem: any;
  openeditmodal(e: any, req: any) {
    this.currentItem = req;
    var x = <HTMLElement>document.getElementById('editmodal')
    x.style.display = "block";
    this.requestbean = req;
    e.target.src = 'assets/icons/editicon2White_selected.svg';
    this.savedevent = e;
  }

  closeEditModal() {
    var x = <HTMLElement>document.getElementById('editmodal')
    x.style.display = "none";
    this.savedevent.target.src = 'assets/icons/editicon2White.svg';
  }

  savedevent: any;
  openviewmodal(e: any, req: any) {
    this.currentItem = req;
    var x = <HTMLElement>document.getElementById('viewmodal')
    this.requestbean = req;
    x.style.display = "block";
    e.target.src = 'assets/icons/viewWhite_selected.svg';
    this.savedevent = e;
  }

  closeviewModal() {
    var x = <HTMLElement>document.getElementById('viewmodal')
    x.style.display = "none";
    this.savedevent.target.src = 'assets/icons/viewWhite.svg';
  }

  addopen = false;
  openaddmodal() {
    this.currentaddcat = null;
    this.currentaddsubcat = null;
    this.requestbean.description = "";
    this.requestbean.remarks = null;
    this.requestbean.PrefTimeToCall = "";
    this.addtime = '';

    this.currentsite = this.currentInfo?.site.siteId
    this.addopen = true;
    var x = <HTMLElement>document.getElementById('addmodal')
    x.style.display = "block";

    var y = <HTMLTextAreaElement>document.getElementById('textareareq');
    var z = <HTMLTextAreaElement>document.getElementById('textareadescr');
    y.value = z.value = ""
  }

  closeAddModal() {
    this.addopen = false;
    var x = <HTMLElement>document.getElementById('addmodal')
    x.style.display = "none";
  }

  opendeletemodal(e: any, item: any) {
    this.currentItem = item;
    var x = <HTMLElement>document.getElementById('deletemodal')
    x.style.display = "block";
    this.requestbean = item;
    e.target.src = 'assets/icons/deleteWhite_selected.svg';
    this.savedevent = e;
  }
  closedeleteModal() {
    var x = <HTMLElement>document.getElementById('deletemodal')
    x.style.display = "none";
    this.savedevent.target.src = 'assets/icons/deleteWhite.svg';
  }

  deleteRequest(item: any) {
    var id = item.serviceId;
    this.showLoader = true;
    this.apiservice.deleteHelpDeskRequests(item).subscribe((res: any) => {
      this.showLoader = false;
      this.pagenumber = 1;
      this.closedeleteModal();
      this.alertService.success("Information", res.message);
      this.getHelpDeskRequests();
    })
  }


  @ViewChild('date') date: ElementRef;
  opentimer() {
    var x = <HTMLInputElement>document.getElementById("date");
    // console.log(this.date.nativeElement)
    x.focus();
    x.click();
    this.date.nativeElement
    this.date.nativeElement.focus();
  }
  calldisabled = true
  mindate() {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var min: any = today.getMinutes();
    let hh: any = today.getHours();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    if (min < 10) { min = '0' + min }
    if (min < 50) { min + 10 }
    if (min > 50) {
      min = 10;
      if (hh < 11) { hh + 1 } else { hh = 1 }
    }
    if (hh < 10) { hh = '0' + hh }
    // YYYY-MM-DDThh:mm:ss.ms
    today = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min;
    return today;
  }
  checkbox(e: any) {
    if (this.currentCall === 'yes') {
      this.calldisabled = false;
    } else {
      this.calldisabled = true;
    }
  }
  prefcall(type: any) {
    if (type == 'yes') { this.calldisabled = false }
    if (type == 'no') { this.calldisabled = true }
  }

  submitedit() {
    if (this.requestbean.PrefTimeToCall != null) {
      this.requestbean.PrefTimeToCall = (String(this.requestbean.PrefTimeToCall).replace("T", " "))
      if (this.requestbean.PrefTimeToCall.length == 16) {
        this.requestbean.PrefTimeToCall = this.requestbean.PrefTimeToCall + ':00'
      }
    }

    this.showLoader = true;
    if (this.currentItem.description != null && this.currentItem.description != "") {
      this.apiservice.updateHelpDeskRequest(this.currentItem).subscribe((res: any) => {
        this.showLoader = false;
        this.closeEditModal();
        if (res.statusCode === 200) {
          this.getHelpDeskRequests();
          this.alertService.success("Success", res.message)
        } else {
          this.alertService.success("Failed", "Failed to update request please try again later.")
        }
      }, (err) => {
        this.showLoader = false
      })
    } else {
      this.showLoader = false;
      this.error = true;
    }
  }


  showcategories: any = [];
  showsubcats: any = [];
  gethelpDeskCategories() {
    this.apiservice.getHelpDeskCategories().subscribe((res: any) => {
      // console.log(res);
      if (res.statusCode === 200) {
        this.showcategories = res.categoryList
      }
    });
  }

  shifttofirst(arrayObj1: any, val: any) {
    var index = arrayObj1.findIndex((res: any) => res.serviceSubcatName == val)
    let y = arrayObj1.push(...arrayObj1.splice(0, index));
    return y;
  }

  unique(arr: any, key: any) {
    return [...new Map(arr.map((item: any) => [item[key], item])).values()]
  }

  currentsite: any = null;
  currentaddcat: any = null;
  currentaddsubcat: any = null;
  // catsforadd: any = 'Low';
  currentaddpriority: any = 'Low';
  currentCall: any = 'no'
  adddescription: any;

  inputclicked1(e: any) {
    var x = (e.target.parentNode);
    this.visible1 = !this.visible1;
    this.visible2 = false;
  }

  inputclicked2(e: any) {
    var x = (e.target.parentNode);
    this.visible2 = !this.visible2;
  }

  issueclicked(data: any) {
    // var x = (e.target.parentNode.previousElementSibling);
    // this.currentaddcat = cat;
    // this.visible1 = !this.visible1
    // this.currentaddsubcat = this.currentaddcat.subCategoryList[0];
    // this.showcategories = this.catsforadd.filter((item: any) => item.catName !== this.currentaddcat.catName)
    // this.showsubcats = this.currentaddcat.subCategoryList.filter((item: any) => item.serviceSubcatName !== this.currentaddsubcat.serviceSubcatName)
    // console.log(data)
    this.showsubcats = this.showcategories[Number(data) - 1]?.subCategoryList;

  }

  subcatclicked(e: any, index: any) {
    // var x = (e.target.parentNode.previousElementSibling);
    // this.currentaddsubcat = scat;
    // this.visible2 = !this.visible2
    // this.showsubcats = this.currentaddcat.subCategoryList.filter((item: any) => item.serviceSubcatName !== this.currentaddsubcat.serviceSubcatName)
  }

  priorityclicked(e: any, priority: any) {
    this.currentaddpriority = priority;
  }

  // priorityradio() {
  //   var x = <HTMLInputElement>document.querySelector('input[name="addpriority"]:checked');
  //   this.currentaddpriority = x.value;
  // }

  fruits: any = ['Low', 'Medium', 'High'];
  addtime: any;

  addremark: any;
  addreq() {
    if (this.currentCall == 'yes' && this.addtime == '') {
      this.alertService.success('Alert', 'Please select preferred time')
    } else {
      this.addreq1();
    }
  }

  addreq1() {
    this.addopen = false;
    // console.log(this.currentcategory);
    // console.log(this.currentsubcategory);
    // if (this.currentaddsubcat == null) {
    //   this.currentaddsubcat = { serviceSubcatName: 'Other' }
    // }
    this.showLoader = true;
    var site = this.storageService.getEncrData('siteidfromgaurdpage');
    var site1 = this.storageService.getEncrData('navItem');

    if (!this.addtime) { this.addtime = '' }
    else { this.addtime = String(this.addtime).replace("T", " ") + ':00' }
    var payload = {
      // siteId: site?.siteId ? site?.siteId : site1?.site?.siteId,
      siteId: this.currentsite,
      service_cat_id: this.currentaddcat,
      service_subcat_id: this.currentaddsubcat,
      description: this.adddescription,
      priority: this.currentaddpriority,
      remarks: this.addremark,
      PrefTimeToCall: this.addtime
    }
    if (payload.service_cat_id != null && payload.service_subcat_id != null && payload.description != null && payload.description != "") {
      this.apiservice.addHelpDeskRequest(payload).subscribe((res: any) => {
        // console.log(res);
        this.closeAddModal();
        this.getHelpDeskRequests();
        this.showLoader = false
        if (res.statusCode === 200) {
          this.alertService.success("Success", res.message)
        } else {
          this.alertService.success("Failed", "Failed to add request please try again later.")
        }
      }, (err) => {
        this.showLoader =  false;
      });
    } else {
      this.showLoader = false;
      this.error = true;
      // this.alertService.warning("Warning","Please enter the request")
    }
  }
  error = false;

  @ViewChild("filter") filtermodal: ElementRef;
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(e: any): void {
    if (this.show) {
      if (!this.filtermodal.nativeElement.contains(e.target)) {
        this.show = !this.show
      } else { }
    }
  }



  sanitizedURL: any;
  // pdf1(){
  //   this.showLoader=true;
  //   this.apiservice.gettncBlob().subscribe((data:any) => {
  //       var file = new Blob([data], {type: 'application/pdf'});
  //       var fileURL = URL.createObjectURL(file);
  //       // window.open(fileURL); //'#zoom=120&toolbar=0&' '#view=FitH&toolbar=0&transparent=0'
  //       this.sanitizedURL = this.domsanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file)+ '#zoom=120&toolbar=0&transparent=1');
  //       if(data.Status == 'Failed' && data.Message == 'Invalid user details'){
  //         this.apiservice.refresh();
  //       }
  //     },(error:any)=>{
  //       this.showLoader=false;
  //       this.alertService.success("Error","Something went wrong. Please Try Again.")
  //     }
  //  );
  // }

  pdf() {
    this.showLoader = true;
    this.apiservice.gettnc().subscribe((res: any) => {
      if (res.Status == "Success") {
        var zoom = '';
        if (window.innerWidth > 1300) { zoom = 'zoom=120&' }
        else { zoom = '' }
        this.sanitizedURL = this.domsanitizer.bypassSecurityTrustResourceUrl(res.url + `#${zoom}toolbar=0&transparent=1`);
      } else {
        return res;
      }
      if (res.Message == "Invalid accessToken") { this.apiservice.refresh(); }
    });
  }

  sanitizedUrls: Map<string, SafeResourceUrl> = new Map();
  sanitizeUrl(url: string | undefined): SafeResourceUrl | null {
    if (url === undefined) {
      return null;
    } else {
      let sanitizedUrl = this.sanitizedUrls.get(url);
      if (!sanitizedUrl) {
        sanitizedUrl = this.domsanitizer.bypassSecurityTrustResourceUrl(url);
        this.sanitizedUrls.set(url, sanitizedUrl);
      }
      return sanitizedUrl;
    }
  }

}
