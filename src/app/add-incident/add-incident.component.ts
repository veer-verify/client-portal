import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alertservice/alert-service.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-add-incident',
  templateUrl: './add-incident.component.html',
  styleUrls: ['./add-incident.component.css'],
  animations: [
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }),
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddIncidentComponent implements OnInit {

  @Input({ required: true }) questions: any;
  @Output() newItemEvent: any = new EventEmitter();
  @Output() resetEmitter: any = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private alertSer: AlertService,
    public storageService: StorageService,
  ) { }

  form: FormGroup = new FormGroup({});
  user: any;
  ngOnInit(): void {
    // this.form.reset();
    this.initilizeForm();
    this.user = this.storageService.getEncrData("user");
  }

  initilizeForm() {
    const formGroupConfig: { [key: string]: any } = {};
    this.questions.forEach((question: any) => {
      if (question.templateOptions.required) {
        formGroupConfig[question.key] = this.fb.control('', Validators.required);
      } else {
        formGroupConfig[question.key] = this.fb.control('');
      }
    });
    this.form = this.fb.group(formGroupConfig);
  }

  uploadFile(event: any) {
    let file = event?.target?.files[0];
  }

  is_submitted: boolean = false;
  submit() {
    this.is_submitted = true
    if (this.form.valid) {
      this.newItemEvent.emit(this.form.value);
    }
  }

  fillShortName(event: any) {
    let name = event.target.name;
    if (name === 'userName') {
      this.form.get('emailId')!.setValue(event.target.value + '@gmail.com');
    }
  }

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

}
