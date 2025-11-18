import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/storage.service';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { ProximityService } from '../services/proximity.service';

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
    private cdr: ChangeDetectorRef,
    private proxSer: ProximityService
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
          this.getMetadata();
          this.router.navigateByUrl('/guard');
        } else {
          this.alertService.sweetError(res.message);
        }
      },
      error: (err: any) => {
        this.alertService.sweetError(err.message);
      }
    })
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getMetadata() {
    this.proxSer.getMetadata().subscribe((res: any) => {
      // localStorage.setItem('metaData', JSON.stringify(res));
      this.storageService.storeEncrData('metaData', res);
    })
  }

}
