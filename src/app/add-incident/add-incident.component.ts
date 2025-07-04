import { animate, style, transition, trigger } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alertservice/alert-service.service';
import { EventService } from 'src/app/services/event.service';
import { ProximityService } from 'src/app/services/proximity.service';
import { StorageService } from '../services/auth/storage.service';
import { SiteService } from '../services/site.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddIncidentComponent implements OnInit {

  @Input({required: true}) questions: any;
  @Output() newItemEvent: any = new EventEmitter();
  @Output() resetEmitter: any = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private apiSer: UserServiceService,
    private alertSer: AlertService,
    private router: Router,
    private siteSer: SiteService,
    public storageService: StorageService,
  ) {}

  form: FormGroup = new FormGroup({});
  user: any;
  ngOnInit() {
    this.user = this.storageService.getEncrData("user");
    this.initilizeForm();
  }

  resetForm() {
    this.resetEmitter.emit(this.form);
  }

  initilizeForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.questions.forEach((question: any) => {
      if(question.templateOptions.required) {
        formGroupConfig[question.key] = new FormControl('', Validators.required);
      } else {
        formGroupConfig[question.key] = new FormControl('');
      }
    });
    this.form = this.fb.group(formGroupConfig);
  }

  uploadFile(event: any) {
    let file = event?.target?.files[0];
  }

  submit() {
    if(this.form.valid) {
      this.newItemEvent.emit(this.form.value);
    } else {
      this.alertSer.error('error', 'Please fill all fields');
    }
    this.resetForm();
  }

  fillShortName(event: any) {
    let name = event.target.name;
    if(name === 'userName') {
      this.form.get('emailId')!.setValue(event.target.value + '@gmail.com');
    }
  }

  // generate(question: any) {
  //   console.log(question)
  //   this.questions.push(question)
  // }

  // onDateChange(event: any) {
  //   let x = this.UserForm.value.eventFromTime;
  //   let y = this.UserForm.value.eventToTime;
  //   if(y.month == x.month) {
  //     if(y.day < x.day) {
  //       alert('From date is grater than from date');
  //       this.UserForm.get('eventFromTime').setValue('');
  //       this.UserForm.get('eventToTime').setValue('');
  //     }
  //   } else if(y.month < x.month) {
  //       alert('From date is grater than from date');
  //       this.UserForm.get('eventFromTime').setValue('');
  //       this.UserForm.get('eventToTime').setValue('');
  //   }
  // }

title: any = `Member (Default): Has view-only access to the sites assigned to them.
Site/Support Admin: Has administrative privileges for the sites assigned. Can also create and manage users within their allocated scope.
Client Admin: Has full administrative access to all sites under their respective client account.`;


// openInfo(){

//   this.alertSer.info("Roles Info", `Member (Default): Has view-only access to the sites assigned to them.

// Site/Support Admin: Has administrative privileges for the sites assigned. Can also create and manage users within their allocated scope.

// Client Admin: Has full administrative access to all sites created under their respective client account.`
//   )
// }

}
