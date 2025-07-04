import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AlertService } from 'src/app/services/alertservice/alert-service.service';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/auth/storage.service';
import { ProximityService } from 'src/app/services/proximity.service';


@Component({
  selector: 'app-add-sim',
  templateUrl: './add-sim.component.html',
  styleUrls: ['./add-sim.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddSimComponent {
//  @Input() data: any;

@Input() currentSite:any;

 @Output() newItemEvent = new EventEmitter<any>();
 @Output() dataAdded = new EventEmitter<any>();

 // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
   //   var x = <HTMLElement>document.getElementById(`camera`);
   //   if (x != null) {
   //     if (!x.contains(e.target)) {
   //       this.closeAddCamera(false);
   //     }
   //   }
   // }

 constructor(
   private router: Router,
   private fb: FormBuilder,
   private apiSer: ApiService,
   private alertService: AlertService,
   private storageService: StorageService,
   private proximitySer: ProximityService
   // private dropDown: MetadataService,
   // private siteService: SiteService,
   // private devService: DeviceService
 ) {}

 create: any = FormGroup;
 searchText: any;
 currentDate = new Date();
 showLoader: boolean = false;

 object= 0;
 person_vehicle= 0

 adFor: any = null;
 enableDemo: boolean = false;

 siteFromStorage: any;
 userData: any;

 simData = {
  simType: null,
  planName: null,
  simIMEno: null,
  uploadSpeed: null,
  downloadSpeed: null,
  simAc: null,
  createdBy: null,
  remarks: null,
  siteId:null,
  GatewayName:null,
  SerialNumber:null
}
 ngOnInit(): void {
   this.create = this.fb.group({
     'simType': new FormControl('', Validators.required),
     'planName': new FormControl('', Validators.required),
     'simIMEno': new FormControl('', Validators.required),
     'uploadSpeed': new FormControl(null),
     'downloadSpeed': new FormControl(null),
     'createdBy': new FormControl(1),
     'simAc': new FormControl(''),
     'remarks': new FormControl(''),
     'siteId': new FormControl(null),
     'deviceId':new FormControl('', Validators.required),
     'GatewayName':new FormControl(''),
     'SerialNumber':new FormControl('', Validators.required)
   });

   this.siteFromStorage = JSON.parse(localStorage.getItem('site_temp')!);
   this.userData = this.storageService.getEncrData('user');
   this.getCentralBox();
 };

 deviceData: any = [];
 getDevices() {
   this.proximitySer.listDevicesBySite(this.siteFromStorage?.siteId).subscribe((res: any) => {
     // console.log(res);
     this.deviceData = res[0]?.adsDevices;
   });
 }


 selectedFile: any;
 onFileSelected(event: any) {
   if(typeof(event) == 'object') {
     this.selectedFile = event.target.files[0] ?? null;
     // console.log(this.selectedFile);
   }
 }

 closeForm() {
   this.newItemEvent.emit();
 }


 /* Add Asset */
 submit: boolean = false;
 personshow : boolean = false;
 toggleShowOnOff() {
   this.personshow = !this.personshow;
 }

 deviceIds: any = [];
 getCentralBox() {
  this.proximitySer.getCentralBox(this.currentSite).subscribe((res: any) => {
    this.deviceIds = res.centralBox
  })
 }


createForm() {
  this.submit = true
  if(this.create.valid) {
    this.create.value.siteId = this.currentSite.siteId
    this.proximitySer.addSimCardDetails(this.create.value).subscribe((res:any)=> {
      if(res.statusCode === 200) {
        this.newItemEvent.emit();
        this.alertService.success('success' ,res.message);
      } else {
        this.alertService.error('error' ,res.message);
      }
      
    }, (err)=> {
      this.alertService.error('error',err.error.message);
    })
  }
}

//  onDateChange() {
//    let x = this.addAssetForm.value.fromDate;
//    let y = this.addAssetForm.value.toDate;

//    if(y < x) {
//      alert('From date is grater than from date');
//      this.addAssetForm.get('fromDate').setValue('');
//      this.addAssetForm.get('toDate').setValue('');
//    }
//  }

}
