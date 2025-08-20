import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { SiteService } from '../services/site.service';


@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css']
})
export class ChatpopupComponent implements OnInit {
  @ViewChild('chatpopup') popupbox: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('date') date: ElementRef;

  // @HostListener('focusout', ['$event'])
  // protected onFocusOut(event: FocusEvent): void {
  //   console.log(
  //     'click away from component? :',
  //     event.currentTarget && event.relatedTarget
  //   );
  //   setTimeout(()=>{
  //     this.showPopUp();
  //   },8000)
  // }

  
  visibility = false;
  submitted = false;
  showLoader = false;
  selected = false;
  troubleshoot = false;
  feedback = false;
  currentpage = "Home";
  body: string;
  visible = false;
  visible1 = false;
  visible2 = false;
  user: any;

  constructor(
    private router:Router, 
    private apiService: ApiService, 
    private alertService:AlertService,
    private storageservice: StorageService,
    private renderer: Renderer2,
    private siteService: SiteService
  )
  {
    this.router.events.subscribe((event) => {
      if ( event instanceof RoutesRecognized ) {
        this.currentpage = (event.state.root.firstChild?.data['routeName']);
      }
    });

  }

  // startlistenerforpopup(){
  //   this.renderer.listen('window', 'click',(e:Event)=>{
  //     // if(!this.profilebtn.nativeElement.contains(e.target) && !this.profile.nativeElement.contains(e.target)) {

  //         if(!this.popupbox.nativeElement.contains(e.target) && !this.popupbox.nativeElement.contains(e.target)) {
  //         this.visibility=false;
  //     }
  //   });
  // }

  currentInfo: any;
  ngOnInit(): void {
    this.user = this.storageservice.getEncrData("user");
    this.storageservice.site_sub.subscribe((res) => {
      if(res) {
        this.currentInfo = res;
      } else {
        this.currentInfo = this.storageservice.getEncrData('navItem');
      }
    })
    // this.startlistenerforpopup();

    if(this.user){
      this.gethelpDeskCategories();
      this.getSitesListForUserName();
    }
  }

  siteData: any
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteService.getSitesListForUserName(this.user).subscribe((sites: any) => {
      this.showLoader = false;
      this.siteData = sites.sites?.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
    }, (err: any) => {
      this.showLoader = false;
    })
  }
  
  currentsite: any;
  categories:any;
  currentcategory:any = [];
  currentsubcategory:any;
  selectedSubcategory:any;
  currentpriority = 'Low';

  showcategories:any;
  showsubcats:any;
  gethelpDeskCategories(){
    this.apiService.getHelpDeskCategories().subscribe((res:any)=>{
      // console.log(res)
     if(res.statusCode==200){
      var a = res.categoryList;
      if(this.currentpage){
        if(this.currentpage == "Support"){this.shifttofirst(a, "Live View")}
        else if(this.currentpage == "Insight"){this.shifttofirst(a, "Business Intelligence")}
        else if(this.currentpage == "Gaurd"){this.shifttofirst(a, "Live View")}
        else if(this.currentpage == "Trends"){this.shifttofirst(a, "Business Intelligence")}
        else if(this.currentpage == "Advertisement"){this.shifttofirst(a, "Proximity Advertisements")}
        else(this.shifttofirst(a, "Live View"))
        this.categories = (this.unique(a,'catName'))
        this.currentcategory = this.categories[0];
        this.currentsubcategory = this.categories[0].subCategoryList[0];
        this.showcategories = this.categories.filter((item:any)=> item.catName !== this.currentcategory.catName)
        this.showsubcats = this.currentcategory.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentsubcategory.serviceSubcatName)
      }      
          
      this.router.events.subscribe((event)=>{
        if ( event instanceof RoutesRecognized ) {
          this.currentpage = (event.state.root.firstChild?.data['routeName']);
          if(this.currentpage == "Support"){this.shifttofirst(a, "Live View")}
          else if(this.currentpage == "Insight"){this.shifttofirst(a, "Business Intelligence")}
          else if(this.currentpage == "Gaurd"){this.shifttofirst(a, "Live View")}
          else if(this.currentpage == "Trends"){this.shifttofirst(a, "Business Intelligence")}
          else if(this.currentpage == "Advertisement"){this.shifttofirst(a, "Proximity Advertisements")}
          else(this.shifttofirst(a, "Safety Escort"))
          this.categories = (this.unique(a,'catName'))
          this.currentcategory = this.categories[0];
          this.currentsubcategory = this.categories[0].subCategoryList[0];
          this.showcategories = this.categories.filter((item:any)=> item.catName !== this.currentcategory.catName)
          this.showsubcats = this.currentcategory.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentsubcategory.serviceSubcatName)
        }
      })
    }else{
      this.categories = []
      this.currentcategory = [];
      this.currentsubcategory = [];
     }
    });
  }

  shifttofirst(arrayObj1:any, val:any){
    var index = arrayObj1.findIndex((res:any) => res.catName == val);
    let y = arrayObj1.push(...arrayObj1.splice(0, index));
    return y;
  }

  time:any;
  addHelpDeskRequest(){
    if(this.calldisabled == false && this.time == null){
      this.alertService.success('Alert', 'Please select preferred time');
      this.showLoader=false;
    }else{
      this.addHelpDeskRequest1();
    }
  }
  addHelpDeskRequest1(){
    if(this.currentsubcategory == null){
      this.currentsubcategory = {serviceSubcatName :'other'}
    }
    this.showLoader =true;

    if(!this.time){this.time = ''}
    else{this.time = String(this.time).replace("T", " ") + ':00'}
    // var payload = {
    //   siteId:site.siteId, 
    //   servicename: this.currentcategory.catName,
    //   subsevice: this.currentsubcategory.serviceSubcatName, 
    //   message: this.body, 
    //   time: this.time,
    //   priority: this.currentpriority
    // }

    var payload = {
      siteId: this.currentInfo?.site?.siteId,
      service_cat_id: this.currentcategory.catId,
      service_subcat_id:this.currentsubcategory.serviceSubcatId,
      description: this.body,
      priority: this.currentpriority,
      remarks: '',
      PrefTimeToCall: this.time
    }
    this.apiService.addHelpDeskRequest(payload).subscribe((res:any)=>{
      this.showLoader =false;
      this.visibility = false;
      if(res.statusCode == 200){
          // console.log(res);
        // setTimeout(()=>{this.showLoader = false; this.submitted = !this.submitted;}, 1000);
        this.alertService.success('success', "Thanks for letting us know! We'll be in touch within 24 hours with asistance.")
      // setTimeout(() => {
      //   if(this.currentpage == 'Support'){
      //     window.location.reload();
      //   }
      // }, 2000);
      }
    }, (err) => {
      this.showLoader =false;
      this.alertService.error('error', "Thanks for letting us know! We'll be in touch within 24 hours with asistance.")
    });
  }
  unique(arr:any, key:any) {
    return [...new Map(arr.map((item:any) => [item[key], item])).values()]
  } 
  showPopUp(){
    this.visibility = !this.visibility;
    // this.alertService.success("Testing"," Alert messages will appear here.")
    this.time = null;
    this.body = '';
    this.selected = false;
    if(this.submitted = true){
      this.submitted = !this.submitted;
    }
  }
  // change(e:any){
  //   this.body = (e.target.value)
  // }
  message:any;
  submit(type:any){
    this.showLoader = true; 
    var site = this.storageservice.getEncrData('siteidfromgaurdpage');
    if((this.body !=null && site.siteId !=null) && this.body != ''){
      this.addHelpDeskRequest();
      
    }else{
      this.showLoader=false;
      this.message = 'Please provide request description'
      this.error = true;
      // this.openalertModal();
      // this.alertService.warning("Warning","Please provide request description");
    }
    // var x:string;
    // if(type == 'troubleshooting'){ x = "Issue with " + this.currentpage; this.send(x)}
    // if(type == 'feedback'){ x = "Feedback Request"; this.send(x)}
  }
  error = false;
  send(subject:string){
    if(this.body != '' && this.body != null && this.body != undefined){
      this.apicall(subject)
    }else{
      this.showLoader=false;
      this.alertService.warning( "Warning","Please enter the request")
      this.error = true;
    }
  }
  apicall(subject:string){
    this.apiService.sendEmail(this.body, subject).subscribe((res:any)=>{
      setTimeout(()=>{ this.showLoader = false; this.submitted = !this.submitted;}, 100);
      setTimeout(()=>{this.visibility = false;},5000)
      // this.alertService.success("Thanks for letting us know! We'll be in touch within 24 hours with asistance.")
      // console.log(res) // Status: success
    },(error)=>{
      this.showLoader=false;
      this.alertService.success("Error","Something went wrong. Please try again later.")
    })
  }
  toFeedback(){
   this.selected = true;
   this.feedback = true;
   this.troubleshoot = false;
  }
  toTroubleshoot(){
    this.selected = true;
    this.troubleshoot = true;
    this.feedback = false;
  }
  inputclicked(e:any){
   var x = (e.target.parentNode);
   this.visible = !this.visible
   if(this.visible1){this.visible1 = !this.visible1}
   if(this.visible2){this.visible2 = !this.visible2}
   if(this.visible){x.style.borderRadius = "8px 8px 2px 2px"}
   else{x.style.borderRadius = "8px"}
  }

  inputclicked1(e:any){
    var x = (e.target.parentNode);
    this.visible1 = !this.visible1
    if(this.visible){this.visible = !this.visible}
    if(this.visible2){this.visible2 = !this.visible2}
    if(this.visible1){x.style.borderRadius = "8px 8px 2px 2px"}
    else{x.style.borderRadius = "8px"}
   }

   inputclicked2(e:any){
    var x = (e.target.parentNode);
    this.visible2 = !this.visible2
    if(this.visible){this.visible = !this.visible}
    if(this.visible2){x.style.borderRadius = "8px 8px 2px 2px"}
    else{x.style.borderRadius = "8px"}
   }
   
  issueclicked(e:any, cat:any){
    var x = (e.target.parentNode.previousElementSibling);
    x.style.borderRadius = "8px"
    // this.currentpage = str;
    this.currentcategory = cat;
    this.visible = !this.visible;
    this.currentsubcategory = this.currentcategory.subCategoryList[0];
    this.showcategories = this.categories.filter((item:any)=> item.catName !== this.currentcategory.catName)
    this.showsubcats = this.currentcategory.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentsubcategory.serviceSubcatName)
  }
  subcatclicked(e:any, scat:any){
    var x = (e.target.parentNode.previousElementSibling);
    x.style.borderRadius = "8px"
    // this.currentpage = str;
    this.currentsubcategory = scat;
    this.visible1 = !this.visible1  
    this.showsubcats = this.currentcategory.subCategoryList.filter((item:any)=> item.serviceSubcatName !== this.currentsubcategory.serviceSubcatName)
  }
  priorityclicked(e:any, priority:any){
    var x = (e.target.parentNode.previousElementSibling);
    x.style.borderRadius = "8px"
    // this.currentpage = str;
    this.currentpriority = priority;
    this.visible2 = !this.visible2;
  }
  priorityradio(){
    var x = <HTMLInputElement>document.querySelector('input[name="priority"]:checked');
    this.currentpriority = x.value;
    // console.log(x)
  }
  calldisabled = true;
  checkbox(e:any){
    if (document.querySelector('#call:checked')) {
      this.calldisabled = false;
    }else{
      this.calldisabled = true;
    }
  }

  focusout(e:any){
    console.log(e)
  }



  xOffset = 0;
  yOffset = 0;
  initialX: number
  initialY: number;
  canDrag: boolean;
  timeout:any;

  public hold(e:any) {
    this.timeout = setTimeout(()=>{
      var x = <HTMLElement>document.getElementById("chatpopup");
      x.style.position = "fixed";
      x.style.right = 220+"px";
    },1000)
    setTimeout(()=>{
      var x = <HTMLElement>document.getElementById("chatpopup");
      x.style.position = "fixed";
      x.style.right = 45+"px";
    },2500)
  }

  leave(e:any){
    clearTimeout(this.timeout)
    setTimeout(()=>{
      var x = <HTMLElement>document.getElementById("chatpopup");
      x.style.position = "fixed";
      x.style.right = 45+"px";
    },501)
  }

  opentimer(){
    var x = <HTMLInputElement>document.getElementById("date");
    // console.log(this.date.nativeElement)
    x.focus();
    x.click();
    this.date.nativeElement
    this.date.nativeElement.focus();
  }
  preftime(type:any){
    if(type == 'yes'){this.calldisabled = false}
    if(type == 'no'){this.calldisabled = true}
  }

  mindate(){
    var today:any = new Date();
    var dd:any = today.getDate();
    var mm:any = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    var min:any = today.getMinutes();
    let hh:any = today.getHours();
    if(dd<10){dd='0'+dd} 
    if(mm<10){mm='0'+mm} 
    if(min<10){min='0'+min} 
    if(min<50){min+10}
    if(min>50){min = 10; 
      if(hh<11){hh+1}else{hh=1}
    } 
    if(hh<10){hh='0'+hh} 
    today = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+min;
    return today;
  }



@ViewChild ("chatpopup") popupmodal:ElementRef;
@HostListener('document:mousedown', ['$event'])
onGlobalClick(e:any): void {
  var x = <HTMLElement>document.getElementById('warningmodal')
  if(x.style.display == "none"){
    if(this.visibility){
      if (!this.popupmodal.nativeElement.contains(e.target)) {
        this.visibility=!this.visibility;
        this.calldisabled = true;
        this.time = null;
     }
    }
  }
}


closealertModal(){
  var x = <HTMLElement>document.getElementById('warningmodal')
  x.style.display = "none";
}
openalertModal(){
  var x = <HTMLElement>document.getElementById('warningmodal')
  x.style.display = "block";
}

}
