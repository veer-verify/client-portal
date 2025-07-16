import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alertservice/alert-service.service';
import { ApiService } from 'src/app/services/api.service';
import { ProximityService } from 'src/app/services/proximity.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-advertisement',
  templateUrl: './add-advertisement.component.html',
  styleUrls: ['./add-advertisement.component.css'],
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
export class AddAdvertisementComponent implements OnInit {

  // @Input() data: any;
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

  addAssetForm: any = FormGroup;
  searchText: any;
  currentDate = new Date();
  showLoader: boolean = false;


  /* Asset Object */
  assetData: any = {
    file: null,
    asset: {
      deviceId: '',
      deviceModeId: '',
      name: null,
      playOrder: 1,
      createdBy: null,
      splRuleId: 0,
      fromDate: '',
      toDate: ''
    },

    nameParams: {
      timeId: 3,
      tempId: 4,
      maleKids: 0,
      femaleKids: 0,
      maleYouth: 0,
      femaleYouth: 0,
      maleAdults: 0,
      femaleAdults: 0,
      persons: null,
      vehicles: null,
    }
  }

  object= 0;
  person_vehicle= 0

  adFor: any = null;
  enableDemo: boolean = false;

  siteFromStorage: any;
  userData: any;
  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'file': new FormControl('', Validators.required),
      'deviceId': new FormControl('', Validators.required),
      'deviceModeId': new FormControl(''),
      'name': new FormControl('', Validators.required),
      'playOrder': new FormControl(''),
      'createdBy': new FormControl(''),
      'splRuleId': new FormControl(''),
      'fromDate': new FormControl(''),
      'toDate': new FormControl(''),
      'adFor': new FormControl(''),
      'enableDemo': new FormControl(''),
      'timeId': new FormControl(''),
      'tempId': new FormControl(''),
      'maleKids': new FormControl(''),
      'femaleKids': new FormControl(''),
      'maleYouth': new FormControl(''),
      'femaleYouth': new FormControl(''),
      'maleAdults': new FormControl(''),
      'femaleAdults': new FormControl(''),
      'vehicles': new FormControl(''),
      'persons': new FormControl(''),

      'object': new FormControl(''),
      'person_vehicle': new FormControl('')
    });

    this.addAssetForm.get('deviceModeId').valueChanges.subscribe((val: any) => {
      if(val == 2 || val == 3) {
        this.addAssetForm.get('timeId').setValidators(Validators.required);
        this.addAssetForm.get('tempId').setValidators(Validators.required);
      } else {
        this.addAssetForm.get('timeId').clearValidators();
        this.addAssetForm.get('tempId').clearValidators();
      }
      this.addAssetForm.get('timeId').updateValueAndValidity();
      this.addAssetForm.get('tempId').updateValueAndValidity();
    });

    this.siteFromStorage = JSON.parse(localStorage.getItem('site_temp')!);
    this.userData = this.storageService.getEncrData('user');
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

  addNewAsset() {
    this.submit = true;
    if(this.addAssetForm.valid) {
      this.showLoader = true;
      if(this.assetData.nameParams.timeId == 3 && this.assetData.nameParams.tempId == 4 && this.object == 0) {
        this.assetData.asset.deviceModeId = 1;
      } else if(this.object == 1) {
        this.assetData.asset.deviceModeId = 3;
      } else {
        this.assetData.asset.deviceModeId = 2;
      }
      this.assetData.asset.createdBy = this.userData?.UserId;
      this.proximitySer.createAssetforDevice(this.assetData, this.selectedFile).subscribe((res: any) => {
        this.showLoader = false;
        this.alertService.success('success', res?.message);
        this.newItemEvent.emit();
        }, (err: any) => {
          this.showLoader = false;
            this.alertService.error('error', err?.error?.message);
        });
    }
    // console.log(this.assetData);
  }

  onDateChange() {
    let x = this.addAssetForm.value.fromDate;
    let y = this.addAssetForm.value.toDate;

    if(y < x) {
      alert('From date is grater than from date');
      this.addAssetForm.get('fromDate').setValue('');
      this.addAssetForm.get('toDate').setValue('');
    }
  }

}
