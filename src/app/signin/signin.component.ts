import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/storage.service';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private alertService: AlertService,
    private apiService: ApiService,
    private router: Router,
    public storageService: StorageService,
    private cdr: ChangeDetectorRef
    ) { }

  loginForm!: FormGroup;
  ngOnInit() {

    this.loginForm = this.fb.group({
      userName: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });

    const formatter = new Intl.DateTimeFormat([], {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }

    manageUserSession() {
    this.authservice.manageUserSession('logIn').subscribe({
      next: (res: any) => {
        localStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''));
      }
    })
  };

  showLoader: boolean = false;
  login() {

    if (!this.loginForm.valid) return;
    this.showLoader = true;
    this.authservice.loginNew(this.loginForm.value.userName, this.loginForm.value.password).subscribe({
      next: (res: any) => {
            this.showLoader = false;
        if (res.Status === 'Success') {
          this.storageService.storeEncrData('user', res);
          localStorage.setItem('acTok', JSON.stringify(res.AccessToken || ''));
          this.authservice.isLoggedin.next(true);
          this.authservice.getAuthStatus();
          this.manageUserSession();
                    if(res.Status == 'Success' && res.firstTime == 'F') {
            this.router.navigateByUrl('/guard');
          } else if(res.Status == 'Success' && res.firstTime == 'T') {
            // this.dialogType = 'firstTime';
          }
        } else {
          this.alertService.error("error", res.message);
        }
      },
      error: (err: any) => {
        this.alertService.error("error", err.message);
      }
    })
  }

  // manageUserSession() {
  //   this.loginSer.manageUserSession('logIn').subscribe({
  //     next: (res) => {
  //       sessionStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''));
  //       this.storageSer.session_sub.next(res.sessionId ?? '');
  //     }
  //   })
  // }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // getMetadata() {
  //   this.metadata_service.getMetadata().subscribe({
  //     next: (res: any) => {
  //       this.storageSer.metadat_sub = res
  //     }
  //   })
  // }

}
