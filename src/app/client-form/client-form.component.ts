import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from '../services/alertservice/alert-service.service';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { SiteService } from '../services/site.service';
import { StorageService } from '../services/auth/storage.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {

  constructor(
    private fb: FormBuilder,
    private apiSer: UserServiceService,
    private alertSer: AlertService,
    private router: Router,
    private siteSer: SiteService,
    public storageService: StorageService,
  ) {}

  formTypes = [
    {
      label: 'Customer Information Form',
      id: 1,
      name: 'customerInfo'
    },
    {
      label: 'Defender Client Form',
      id: 2,
      name: 'clientInfo'
    },
    {
      label: 'Site Information Form',
      id: 3,
      name: 'siteInfo'
    }
  ]

  form: FormGroup = new FormGroup({});
  user: any;
  ngOnInit() {
    this.user = this.storageService.getEncrData("user");
    this.questionnaireList(1);
  }

  formMethod() {
    const formGroupConfig: { [key: string]: any } = {};
    this.questions.forEach((question: any) => {
      formGroupConfig[question.key] = new FormControl('');
    });
    this.form = this.fb.group(formGroupConfig);
  }

  showLoader: boolean = false;
  sites: any = [];
  getSitename() {
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.user).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == "Failed") {

      } else {
        this.sites = res.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
      }
    }, (error) => {
        this.showLoader = false;
        if (error?.ok == false) {
          this.siteSer.onHTTPerror(error);
        }
    })
  }

  uploadFile(event: any) {
    let file = event?.target?.files[0];
    this.apiSer.uploadFile(file, this.formId).subscribe((res: any) => {
      // console.log(res);
    })
  }

  selectedForm: any
  questions: any = [];
  formId!: string;
  questionnaireList(type: number) {
    this.selectedForm = type;
    this.apiSer.questionnaireList(type).subscribe({
      next: (res: any) => {
        // console.log(res);
        res.fields.map((item: any) => item.no = 0)
        this.questions = res.fields;
        this.formId = res.formId;
        this.formMethod();
        this.getSitename();

        this.getInstallationForm({ formType: type });
      },
      error: (err: HttpErrorResponse) => {
        this.questions = [];
      }
    })
  }

  formsData: any = [];
  draft: any;
  getInstallationForm(data?: any) {
    this.apiSer.getInstallationForm(data).subscribe({
      next: (res: any) => {
        this.draft = res.drafts;
        this.formsData = res.submitted;
      }
    })
  }
  
  copyForm(data: any) {
    // this.getRepetativeArr({no: 2});
    if(Object.keys(data).length === 0) {
      this.form.reset();
    } else {
      const formGroupConfig: any = {};
      Object.keys(data.formData).map((item: any) => {
        formGroupConfig[item] = data.formData[item];
      })
      this.form = this.fb.group(formGroupConfig);
    }
  }

  getLatestDraft() {
    this.apiSer.getLatestDraft(this.selectedForm).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }

  currentInput: any;
  getRepetativeArr(question: any) {
    // console.log(question)
    let x = new Array(Number(question.no)).fill(0).map((item, index) => ({no: index + 1, newQuest: null}));
    return x.map((item: any) => item.newQuest = this.getQuestionById(question.questionId)?.key + 0)

    // console.log(x.map((item: any) => item));
    // console.log(this.getQuestionById(question.questionId))
    // console.log(x)
    // if(question.repetitive) {
    //   this.arr = new Array(Number(question.target.value)).fill(0).map((item, index) => index + 1);
    // } else {
    //   this.arr =  new Array()
    // }
  }

  setNo(event: any, question: any) {
    question.no = Number(event.target.value);
  }
  
  // getNo(question: any) {
  //   return question;
  // }

  setFormControl(question: any, event: any) {
    this.form.addControl(question, new FormControl(event.target.value));
    this.form.get(question)!.setValue(event.target.value);
  }

  getQuestionById(id: string): any {
    return this.questions.find((question: any) => question.questionId === id);
  }

  // getQuestionByKeyValue(key: any) {
  //   return key;
  // }

  submit(status: string) {
    this.apiSer.addInstallationForm({formType: this.selectedForm, formId: this.formId, data: this.form.value, status: status}).subscribe({
      next: (res) => {
        // console.log(res);
        if(res.statusCode === 200) {
          this.alertSer.sweetSuccess(res.message);
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.alertSer.sweetError(res.message)
        }
      },
    })
  }

}
