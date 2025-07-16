import { Component, ElementRef, OnInit, Renderer2, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, finalize, Subject, take } from 'rxjs';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { menuItems } from './menu-items';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // @Input() serviceDataFromParent: any;
  profileopened$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private authservice: AuthService,
    private storageService: StorageService,
    private apiservice: ApiService,
    private alertservice: AlertService,
    private renderer1: Renderer2,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private fb: FormBuilder,
    private siteSer: SiteService,
    public storageSer: StorageService
  ) { }


  @ViewChild("myTopnav", { static: false }) topnav: ElementRef;
  @ViewChild("sidenav", { static: false }) sidenav: ElementRef;
  @ViewChild('profile') profile: ElementRef;
  @ViewChild('profilebtn') profilebtn: ElementRef;

  isloggedin: any;
  opened = true;
  advertisements = false;
  liveview = true;
  b_intelli = false;
  alarms = false;
  showLoader = false;
  openprofile = false;
  editpro = false;
  newpass = false;

  userData: any;
  updatePasswordForm: FormGroup;
  serviceInformation: any;
  isAdmin: boolean = false;
  navItems: Array<any> = new Array();

  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.listSiteServices();
    // this.getUser();
    this.updateUserFormControl();
    this.check();

    // if (this.userData.roleList.length !== 0) {
    //   let a: Array<any> = Array.from(this.userData?.roleList, (item: any) => item.category);
    //   if (a.includes('Admin')) {
    //     this.isAdmin = true;
    //   }
    // }

    this.isAdmin = this.storageSer.isAdmin();
  }

  ngAfterViewInit() {
    this.startlistenForProfile();
  }

  serviceData: any;
  listSiteServices(): void {
    this.storageService.site_sub.subscribe({
      next: (res) => {
        if (!res) return;
        this.siteSer.listSiteServices(res?.site).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this.serviceData = response.siteServicesList;
              this.navItems = menuItems;
            }
          }
        })
      }
    })
  }

  startlistenForProfile() {
    this.renderer1.listen('window', 'click', (e: Event) => {
      if (this.openprofile == true) {
        if (!this.profilebtn.nativeElement.contains(e.target) && !this.profile.nativeElement.contains(e.target)) {
          this.openprofile = false;
        }
      }
    });
  }

  updateUserFormControl() {
    this.updatePasswordForm = this.fb.group({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/)]),
      confirmNewPassword: new FormControl('', Validators.required)
    });
  }

  check() {
    var x = this.authservice.getAuthStatus();
    if (x == false) {
      this.authservice.logout();
    }
  }

  burgerIcon() {
    var x = this.topnav.nativeElement;
    if (x.className === "topnav") {
      x.className += " responsive1";
    } else {
      x.className = "topnav";
    }
  }

  closeMenu() {
    this.burgerIcon();
  }

  routeTo(url: string) {
    this.router.navigateByUrl('/' + url);
    this.burgerIcon();
  }

  openmenu() {
    var x = this.sidenav.nativeElement;
    x.style.display = "block";
    x.style.animation = "slideIn 500ms forwards";
    var y = (document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>);
    (y[0]).style.display = "block";
  }

  closemenu() {
    var x = this.sidenav.nativeElement;
    x.style.animation = "slideOut 500ms forwards";
    x.style.transition = "display 1200ms"
    var y = (document.getElementsByClassName('backdrop') as HTMLCollectionOf<HTMLElement>);
    (y[0]).style.display = "none";
  }

  logout() {
    this.showLoader = true;
    this.authservice.manageUserSession('logOut').subscribe({
      error: (err: any) => {
        this.showLoader = false;
        this.router.navigateByUrl('/error');
        localStorage.clear();
        this.storageService.site_sub.complete();
        this.authservice.isLoggedin.complete();
        window.location.reload();
      },
      complete: () => {
        this.showLoader = false;
        this.router.navigateByUrl('/login');
        localStorage.clear();
        this.storageService.site_sub.complete();
        this.authservice.isLoggedin.complete();
        window.location.reload();
      }
    })
  }

  toQRmodal() {
    this.apiservice.toQR();
  }

  username: any;
  errormsg: any
  forgotPass() {
    this.closeresetModal();
    let x: any = this.userData.UserName;
    // if(x == '' || x == null){this.errormsg =('Please enter username'); this.alertservice.success("Error",this.errormsg)}
    // else if(x != '' && x!= this.data.UserName){this.errormsg =('Username is invalid'); this.alertservice.success("Error",this.errormsg)}
    // else{
    this.showLoader = true;
    this.authservice.forgotPassword(x).subscribe((res: any) => {
      this.showLoader = false;
      this.newpass = false;
      this.username = '';
      if (res.Status == "Success") {
        this.alertservice.success("Success", "Your password reset link has been sent to your Email.");
      }
      if (res.Status == "Failed") {
        this.errormsg = res.Message;
        this.alertservice.success("Failed", "Something went wrong. Please contact support@ivisecurity.com");
      }
      // if(res.Status == "Failed"){this.errormsg = 'Username is invalid'; this.alertservice.success(this.errormsg)}
    })
    // }
  }

  forgotPass1() {
    this.closeresetModal();
    let x: any = this.userData.UserName;
    // if(x == '' || x == null){this.errormsg =('Please enter username'); this.alertservice.success("Error",this.errormsg)}
    // else if(x != '' && x!= this.data.UserName){this.errormsg =('Username is invalid'); this.alertservice.success("Error",this.errormsg)}
    // else{
    this.showLoader = true;
    this.authservice.forgotPassword(x).subscribe((res: any) => {
      this.showLoader = false;
      this.newpass = false;
      this.username = '';
      if (res.Status == "Success") {
        this.alertservice.success("Success", "Your password reset link has been sent to your Email.");
      }
      if (res.Status == "Failed") {
        this.errormsg = res.Message;
        this.alertservice.success("Failed", "Something went wrong. Please contact support@ivisecurity.com");
      }
      // if(res.Status == "Failed"){this.errormsg = 'Username is invalid'; this.alertservice.success(this.errormsg)}
    })
    // }
  }

  submitprofile() {
    this.alertservice.success("Information", "Profile edit is coming soon");
    this.editpro = false;
  }

  visible1 = false
  openModal() {
    var x = <HTMLElement>document.getElementById('editmodal1')
    // x.style.display = "block";
    this.alertservice.success('Edit Profile', 'Coming Soon!')
  }

  closeModal() {
    var x = <HTMLElement>document.getElementById('editmodal1')
    x.style.display = "none";
  }

  inputclicked1(e: any) {
    this.visible1 = !this.visible1
  }

  resetpassconfirm() {
    this.closemenu();
    this.openprofile = false;
    this.verifyBody.email = null;
    var x = <HTMLElement>document.getElementById('resetpassmodal')
    x.style.display = "block";
  }

  verifyBody = {
    email: null,
    UidToken: null
  }

  verifyEmail() {
    this.verifyBody.UidToken = this.userData?.UidToken;
    if (this.verifyBody.email != null && this.verifyBody.email != '') {
      this.showLoader = true;
      this.openUpdatePassword();
      this.authservice.verifyEmail(this.verifyBody.email, this.verifyBody.UidToken).subscribe((res: any) => {
        // console.log(res);
        this.showLoader = false;
        if (res?.Status == 'Success') {
          this.closeresetModal();
        } else if (res?.Status == 'Failed') {
          this.alertservice.error("error", res?.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertservice.error("error", err?.statusText);
      })
    }
    else {
      this.alertservice.error("error", "Please enter email");
    }
  }

  openUpdatePassword() {
    this.closemenu();
    this.closeresetModal();
    this.openprofile = false;
    this.updatePasswordForm.get('oldPassword')?.setValue(null);
    this.updatePasswordForm.get('newPassword')?.setValue(null);
    this.updatePasswordForm.get('confirmNewPassword')?.setValue(null);
    var x = <HTMLElement>document.getElementById('updatePasswordModal');
    x.style.display = "block";
    this.updatePasswordForm.reset();
  }

  updatePassword() {
    let oldPwd = this.updatePasswordForm.value.oldPassword;
    let newPwd = this.updatePasswordForm.value.newPassword;
    let cnfmNewPwd = this.updatePasswordForm.value.confirmNewPassword;
    if (this.updatePasswordForm.valid) {
      if (newPwd === cnfmNewPwd) {
        this.showLoader = true;
        this.closeUpdatePassword();
        this.authservice.updatePassword({ userName: this.userData?.UserName, oldPassword: oldPwd, newPassword: newPwd }).subscribe((res: any) => {
          this.showLoader = false;
          if (res?.Status == 'Success') {
            this.alertservice.success("Success", res?.message);
            setTimeout(() => { this.logout() }, 3000);
          } else {
            this.alertservice.error("error", "Failed");
          }
        }, (err: any) => {
          this.showLoader = false;
          this.alertservice.error("error", err?.statusText);
        })
      } else if (newPwd !== cnfmNewPwd) {
        this.alertservice.error("error", "New password and Confirm password are not matched!");
      }
    } else {
      this.alertservice.error("error", "Please enter details to verify!");
    }
  }

  closeresetModal() {
    var x = <HTMLElement>document.getElementById('resetpassmodal')
    x.style.display = "none";
  }

  closeUpdatePassword() {
    var x = <HTMLElement>document.getElementById('updatePasswordModal')
    x.style.display = "none";
  }

  showPassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;
  togglePwd(type: any) {
    if (type == 'password') {
      this.showPassword = !this.showPassword;
    } else if (type == 'oldPassword') {
      this.showOldPassword = !this.showOldPassword;
    } else if (type == 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type == 'confirmNewPassword') {
      this.showConfirmNewPassword = !this.showConfirmNewPassword;
    }
  }

  userinfo: any = null;
  getUser() {
    this.apiservice.getUserInfoForId(this.userData?.UserId).subscribe((res: any) => {
      this.userinfo = res;
    });


    // this.router.events.subscribe((ev) => {
    //   if(ev instanceof NavigationEnd) {
    //     if(this.router.url == '/gaurd') {
    //     }
    //   }
    // });
  }

  updateUser() {
    this.apiservice.updateUser(this.userinfo).subscribe((res: any) => {
      // console.log(res);
      if (res.statusCode == 200) {
        this.editpro = false;
        this.getUser();
        this.alertservice.success('success', res.message);
      } else {
        this.editpro = false;
        this.alertservice.error('error', res.message);
      }
    })
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.data.parentForm.patchValue({
        //   tso: reader.result
        // });
        if (file.size < 2048000) {
          this.pic = file;
          // need to run CD since file load runs outside of zone
          // this.cd.markForCheck();
          // this.updatePic('');
          this.updateProfilePicture();
        } else {
          this.alertservice.warning("Error", "Image size cannot be more than 2mb");
        }
      };
    }
  }


  pic: File;
  updatePic(type: any) {
    if (type == 'delete') {
      this.pic == null;
      this.closeupdateModal();
    }
    this.apiservice.updateProfilePic(this.pic).subscribe((res: any) => {
      if (res.Status == 'Success') {
        var userUpdate = (this.storageService.getEncrData('user'));
        userUpdate.image = res.image;
        this.storageService.storeEncrData('user', userUpdate);
        this.userData = (userUpdate);
        var x = <HTMLInputElement>document.getElementById('profileinput');
        x.value = "";
        if (window.innerWidth >= 1307) {
          this.openprofile = true;
        } else {
          this.openmenu();
        }
      }

      //this is temporary arrangement for delete profile pic, please change after api completion handle the case as delete carefully
      if (res.Status == 'Failed' && res.Message == "Insufficent Details") {
        var userUpdate = (this.storageService.getEncrData('user'));
        userUpdate.image = 'blah';
        this.storageService.storeEncrData('user', userUpdate);
        this.userData = (userUpdate);
        if (window.innerWidth >= 1307) {
          this.openprofile = true;
        } else {
          this.openmenu();
        }
      }
    })
  }

  updateProfilePicture() {
    var userUpdate = (this.storageService.getEncrData('user'));
    let obj = {
      file: this.pic,
      userId: userUpdate.UserId
    }
    this.apiservice.updateProfilePicture(obj).subscribe((res: any) => {
      // console.log(res);
      if (res.status_code == 200) {
        this.alertservice.success('success', res.message);
        this.getUser();
      } else {
        this.alertservice.error('error', res.message);
      }
    })
  }

  saveProfileEditOption(type: string) {
    this.editpro = true;
    localStorage.setItem('edittype', type);
    // this.router.navigateByUrl('/support');
    // this.openprofile = false;
    this.apiservice.editProfile$.next('added');
    this.closemenu();
  }

  tnc() {
    localStorage.setItem('tnc', 'active');
    this.router.navigateByUrl('/support');
    this.openprofile = false;
  }

  update(type: string) {
    if (type == 'update') {
      var x = <HTMLElement>document.getElementById('profileinput');
      x.click();
      this.closeupdateModal();
    }
    if (type == 'delete') {
      this.updatePic('delete')
    }
  }

  openupdateModal() {
    var x = <HTMLElement>document.getElementById('updateprofile')
    x.style.display = "block";
    this.closemenu();
    this.openprofile = false;
  }

  closeupdateModal() {
    var x = <HTMLElement>document.getElementById('updateprofile')
    x.style.display = "none";
  }

}
