import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProximityService } from '../services/proximity.service';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLoader: any = false;
  showsessionerror: any;

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

  loginForm: FormGroup;
  signupForm: FormGroup;
  updatePasswordForm: FormGroup;
  errInfo: any = null;
  ngOnInit(): void {
    localStorage.clear();
  
    this.alertService.getMessage().subscribe((res: any) => {
      this.errInfo = res;
    });
  
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.signupForm = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });

    this.updatePasswordForm = this.fb.group({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/)]),
      confirmNewPassword: new FormControl('', Validators.required)
    });
  }

  get() {
    let arr= [3, 5, 2, 1];
    let max = Math.max(...arr);
    const result = [...new Array(max).keys()].map((item) => {
      return !arr.includes(item+1) ? (item+1) : null;
    })
    return result.filter((item) => item);
  }
  
  ngAfterViewInit() {
    // if (this.apiService.sessionstatus() == false) {
    //   localStorage.clear();
    // }
    if (this.apiService.error != '') {
      // this.errInfo = this.apiService.error;
      // this.showsessionerror = true;
      this.cdr.detectChanges();
    }

    // var x = this.storageService.getEncrData('user')
    // if(x){
    //   this.loadsites();
    // }
  }

  loadsites() {
    var x: any;
    x = this.storageService.getEncrData('user');
    if (x) {
      this.apiService.getSites().subscribe((res: any) => {
        if (res.Message == "Failed") {
          // this.authservice.logout();
          this.router.navigateByUrl('/login');
        } else {
          this.router.navigateByUrl('/guard');
        }
      }, (error) => {
        if (error.ok == false) {
          // this.alertService.warning('Session Expired');
          this.apiService.onHTTPerror(error);
        }
        console.log("Something went wrong");
      }
      )
    }
  }


  /* new api */
  verifiedUserdetail: any;
  loginNew() {
    if(this.loginForm.valid) {
      this.showLoader = true;
      let x: any = this.loginForm.value.userName;
      let y: any = this.loginForm.value.password;
      this.authservice.loginNew(x, y).subscribe((res: any) => {
        this.showLoader = false;
        this.userEmail.value = null;
        this.verifiedUserdetail = res;
        if(res.Status == 'Success') {
          this.storageService.storeEncrData('user', res);
          localStorage.setItem('acTok', JSON.stringify(res.AccessToken || ''));
          this.authservice.isLoggedin.next(true);
          this.authservice.getAuthStatus();
          this.manageUserSession();
          this.getMetadata();


          if(res.Status == 'Success' && res.firstTime == 'F') {
            this.router.navigateByUrl('/guard');
          } else if(res.Status == 'Success' && res.firstTime == 'T') {
            this.dialogType = 'firstTime';
          }
        } else {
          this.alertService.error("error", res.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertService.error("error", err.statusText);
      })
    } else {
      this.alertService.sweetError("Please enter details!");
    }
  }

  signup() {
    if(this.signupForm.valid) {
      this.authservice.signup(this.signupForm.value).subscribe({
        next: (res) => {
          if(res.Status === "Success") {
            this.storageService.storeEncrData('user', res);
            this.authservice.isLoggedin.next(true);
            this.authservice.getAuthStatus();
            this.manageUserSession();
            this.router.navigateByUrl('/support');
            this.alertService.sweetConfirm('Are you looking for video monitoring or assistance with upgrading your system').then((res) => {
              if(res.isConfirmed) {
                this.router.navigateByUrl('/user-profile');
              }
            })
          } else {
            this.alertService.sweetError(res.message);
          }
        }
      })
    } else {
      this.alertService.sweetError("Please enter details!");
    }
  }

  manageUserSession() {
    this.authservice.manageUserSession('logIn').subscribe({
      next: (res: any) => {
        localStorage.setItem('sId', JSON.stringify(res.sessionId ?? ''));
      }
    })
  };

  showPassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;
  togglePwd(type: any) {
    if(type == 'password') {
      this.showPassword = !this.showPassword;
    } else if(type == 'oldPassword') {
      this.showOldPassword = !this.showOldPassword;
    } else if(type == 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if(type == 'confirmNewPassword') {
      this.showConfirmNewPassword = !this.showConfirmNewPassword;
    }
  }

  dialogType: string = '';
  openFrogotpassDialog(type: string) {
    this.userEmail.value = null;
    this.signupForm.reset();
    this.dialogType = type;
  }

  userEmail: any = new FormControl('', Validators.required);
  forgotPass() {
    if(this.userEmail.valid) {
      this.showLoader = true;
      this.apiService.sendResetLink(this.userEmail.value).subscribe((res: any) => {
        // console.log(res);
        this.showLoader = false;
        if(res.Status == 'Success') {
          this.alertService.success("success", res.message);
          this.closeConfirmPassword();
        } else if(res.Status == 'Failed') {
          this.alertService.error('error', res.message);
        }
      },(err: any) => {
        this.showLoader = false;
        this.alertService.error("error", err?.statusText);
      })
    } else {
      this.alertService.error("error", "Please Enter Email");
    }
  }


  skipLogin() {
    this.showLoader = true;
    let x: any = this.loginForm.value.userName;
    let y: any = this.loginForm.value.password;
    this.authservice.loginNew(x, y).subscribe((res: any) => {
      this.showLoader = false;
      if(res?.Status == 'Success') {
        this.storageService.storeEncrData('user', res);
        this.authservice.isLoggedin.next(true);
        this.authservice.getAuthStatus();
        this.router.navigateByUrl('/guard');
      }
    }, (err: any) => {
      this.showLoader = false;
      this.alertService.error("error", err?.statusText);
    })
  }

  verifyEmail() {
    let x = this.storageService.getEncrData('user');
    this.updatePasswordForm.get('oldPassword')?.setValue(null);
    this.updatePasswordForm.get('newPassword')?.setValue(null);
    this.updatePasswordForm.get('confirmNewPassword')?.setValue(null);
    if(this.userEmail.valid) {
      this.showLoader = true;
      this.authservice.verifyEmail(this.userEmail.value, x?.UidToken).subscribe((res: any) => {
        // console.log(res);
        this.showLoader = false;
        if(res?.Status == 'Success') {
          this.updatePasswordForm.reset();
          this.dialogType = 'passwordRecovery';
        } else if(res?.Status == 'Failed') {
          this.alertService.error("error", res?.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertService.error("error", err?.statusText);
      })
    }
    else {
      this.alertService.error("error", "Please enter email");
    }
  }

  updatePassword() {
    let oldPwd = this.updatePasswordForm.value.oldPassword;
    let newPwd = this.updatePasswordForm.value.newPassword;
    let cnfmNewPwd = this.updatePasswordForm.value.confirmNewPassword;
    if(this.updatePasswordForm.valid) {
      if(newPwd === cnfmNewPwd) {
        this.showLoader = true;
        this.authservice.updatePassword({userName: this.verifiedUserdetail?.UserName, oldPassword: oldPwd, newPassword: newPwd}).subscribe((res: any) => {
          // console.log(res);
          this.showLoader = false;
          if(res?.Status == 'Success') {
            this.closeConfirmPassword();
            this.alertService.success("Success", res?.message);
            setTimeout(() => {this.reset()}, 3000);
          } else {
            this.alertService.error("error", res?.message);
          }
        }, (err: any) => {
          this.showLoader = false;
          this.alertService.error("error", err?.statusText);
        })
      } else if(newPwd !== oldPwd) {
        this.alertService.error("error", "New password and Confirm password are not matched!");
      }
    } else {
      this.alertService.error("error", "Please enter valid details!");
    }
  }

  getMetadata() {
    this.proxSer.getMetadata().subscribe((res: any) => {
      // localStorage.setItem('metaData', JSON.stringify(res));
      this.storageService.storeEncrData('metaData', res);
    })
  }

  reset() {
    this.loginForm.get('userName')?.setValue(null);
    this.loginForm.get('password')?.setValue(null);
  }

  showSkip: boolean = false;
  toggleSkip(type: string) {
    if(type == 'signin') {
      this.showSkip = true;
    } else {
      this.showSkip = false;
      this.dialogType = 'firstTime';
    }
  }

  closeConfirmPassword() {
    this.updatePasswordForm.reset();
    this.dialogType = '';
  }

}
