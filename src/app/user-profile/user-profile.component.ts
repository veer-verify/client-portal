import {
  Component,
  ViewChildren,
  QueryList,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ElementRef } from '@angular/core';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { StorageService } from '../services/storage.service';
import { SearchPipe } from '../services/pipes/search-pipe.pipe';
import { SiteService } from '../services/site.service';
import { createUserFields } from './create-user-fields';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  userRoles: any[] = [];

  constructor(
    private router: Router,
    public storageService: StorageService,
    private apiservice: ApiService,
    private alertservice: AlertService,
    private authservice: AuthService,
    private userSer: UserServiceService,
    private searchPipe: SearchPipe,
    private siteService: SiteService
  ) { }

  activeIndex: number = 0;
  highlightedSection: string | null = null;
  menuItems = [
    {
      name: 'Profile',
      icon: 'assets/icons/person_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
      sectionId: 'profile',
      call: (data: any) => true,
    },
    {
      name: 'Password',
      icon: 'assets/icons/key_vertical_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
      sectionId: 'password',
      call: (data: any) => true,
    },
    // {
    // name: 'Installation Forms',
    // icon: 'assets/icons/key_vertical_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
    // sectionId: 'form'
    // },
    {
      name: 'User Management',
      icon: 'assets/icons/key_vertical_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
      sectionId: 'user',
      call: (data: any) => (this.storageService.isSuperAdmin() || this.storageService.isAdmin()) ? true : false
    }
  ];

  userData: any;
  currentInfo: any;
  questionList: any;
  ngOnInit(): void {
    this.userData = this.storageService.getEncrData('user');
    this.questionList = createUserFields;
    this.storageService.site_sub.subscribe((res) => {
      this.currentInfo = res;
    });
    // if (!this.currentInfo) {
    //   this.storageService.site_sub.next({ index: 0, site: site });
    // }
    this.getUser();

  }

  userinfo: any = null;
  getUser() {
    this.showLoader = true;
    this.storageService.loading_text = 'loading...';
    this.apiservice.getUserInfoForId(this.userData?.UserId).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.Status !== 'Failed') {
          this.storageService.loading_text = '';
          this.userinfo = res;
          this.user = { ...this.userinfo };
          this.getSitesListForUserName();
        } else {

        }
      },
      error: (err) => {
        this.storageService.loading_text = 'failed to get user!';
        this.showLoader = false;
      }
    })
  }

  siteData: any = [];
  getSitesListForUserName() {
    // this.showLoader = true;
    this.siteService.getSitesListForUserName(this.userData).subscribe(
      (sites: any) => {
        this.showLoader = false;
        if (sites.Status === 'Success') {
          this.siteData = sites?.sites.sort((a: any, b: any) =>
            a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0
          );
          if (!this.currentInfo) {
            this.storageService.site_sub1.next({
              site: this.siteData[0],
              index: 0,
            });
          }
        }
      },
      (err: any) => {
        this.showLoader = false;
      }
    );
  }

  @ViewChildren('profile, account,Subscription, Address, password')
  sections!: QueryList<ElementRef>;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.navigateDown();
    } else if (event.key === 'ArrowUp') {
      this.navigateUp();
    }
  }

  // Navigate to the next item (down)
  navigateDown() {
    if (this.activeIndex < this.menuItems.length - 1) {
      this.activeIndex++;
      this.setActive(this.activeIndex);
    }
  }

  // Navigate to the previous item (up)
  navigateUp() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.setActive(this.activeIndex);
    }
  }

  setActive(index: number): void {
    this.activeIndex = index;
    const sectionId = this.menuItems[index].sectionId;
    this.scrollToSection(sectionId);
    this.highlightSection(sectionId);

    if (index == 2) {
      this.getUserNamesByUserName();
      this.userDetailslistRoles();
    } else if(index == 0) {
          this.getUser();

    }
  }

  scrollToSection(sectionId: string): void {
    const section = this.sections
      .toArray()
      .find((el) => el.nativeElement.id === sectionId);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  highlightSection(sectionId: string): void {
    this.highlightedSection = sectionId; // Set the section to be highlighted
    setTimeout(() => {
      this.highlightedSection = null; // Remove the highlight after 5 seconds
    }, 5000);
  }

  ngAfterViewInit(): void {
    if (this.sections && this.sections.length) {
      this.scrollToSection(this.menuItems[0].sectionId);
    }
  }

  isZoomed = false;
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }

  pic: File | null = null;

  @ViewChild('profileinput') profileinput!: ElementRef;
  collapseInstance: any | undefined;

  update() {
    this.profileinput.nativeElement.click();
  }

  // @ViewChild('collapseExample') collapseExample: any;

  updateProfilePicture() {
    var userUpdate = this.storageService.getEncrData('user');

    let obj = {
      file: this.pic,
      userId: userUpdate.UserId,
    };
    this.apiservice.updateProfilePicture(obj).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.alertservice.success('success', `Profile image updated successfully for ${userUpdate.FirstName} ${userUpdate.LastName}`);
        // this.collapseInstance = new Collapse(this.collapseExample.nativeElement);
        // this.collapseInstance.hide()
        this.getUser();
      } else {
        this.alertservice.error('error', res.message);
      }
    }, (err) => {
      this.alertservice.error('error', 'Request Entity Too Large');
    });
  }
  // closecollapse() {
  //   this.collapseInstance = new Collapse(this.collapseExample.nativeElement);
  //   this.collapseInstance.hide()
  // }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.size < 2048000) {
          this.pic = file;
          this.updateProfilePicture();
        } else {
          this.alertservice.warning(
            'Error',
            'Image size should not be more than 2mb'
          );
        }
      };
    }
  }

  editaddress: boolean = false;
  user: any = null;
  editAddress() {
    this.editaddress = !this.editaddress;
    this.user = { ...this.userinfo };
  }

  updateUser() {
    this.apiservice.updateUser(this.user).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.getUser();
        this.editaddress = false;
        this.editId = -1;
        this.alertservice.success('success', res.message);
      } else {
        this.alertservice.error('error', res.message);
      }
    });
  }

  editId: any;
  editDetails(i: any) {
    switch (i) {
      case 0:
        this.editId = i;
        this.user = { ...this.userinfo };

        break;
      case 1:
        this.editId = i;

        this.user = { ...this.userinfo };

        break;
      case 2:
        this.editId = i;
        this.user = { ...this.userinfo };

        break;
      case 3:
        this.editId = i;
        this.user = { ...this.userinfo };

        break;
      default:
        this.editId = i;
        this.user = { ...this.userinfo };
        break;
    }
  }

  editpassword: boolean = false;
  updatePassword() {
    this.editpassword = true;
  }

  closeUpdatepwd() {
    this.editpassword = false;
    this.oldpassword = null;
    this.newPassword = null;
    this.confirmPassword = null;
    this.showoldpassword = false;
    this.shownewpassword = false;
    this.showconfirmpassword = false;
  }

  passwordPattern =
    /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\d))(?=(.*[\W_]))[A-Za-z\d\W_]{6,10}$/;

  oldpassword: any = null;
  newPassword: any = null;
  confirmPassword: any = null;
  showLoader = false;

  submitPassword() {
    const oldPassword = this.oldpassword;
    const newPassword = this.newPassword;
    const confirmPassword = this.confirmPassword;

    if (!this.passwordPattern.test(newPassword)) {
      this.alertservice.error(
        'error',
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be between 6 and 10 characters long.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      this.alertservice.error(
        'error',
        'New password and confirm password do not match.'
      );
      return;
    }

    if (
      this.passwordPattern.test(newPassword) &&
      newPassword == confirmPassword
    ) {
      this.showLoader = false;
      this.authservice
        .updatePassword({
          userName: this.userData?.UserName,
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
        .subscribe(
          (res: any) => {
            this.showLoader = false;
            if (res?.Status == 'Success') {
              this.alertservice.success('Success', res?.message);
              this.closeUpdatepwd();
              setTimeout(() => {
                this.logout();
              }, 3000);
            } else {
              this.alertservice.error('error', res?.message);
            }
          },
          (err: any) => {
            this.showLoader = false;
            this.alertservice.error('error', err?.statusText);
          }
        );
    }
  }

  showoldpassword: boolean = false;
  shownewpassword: boolean = false;
  showconfirmpassword: boolean = false;
  togglePassword(i: any) {
    switch (i) {
      case 1:
        this.showoldpassword = !this.showoldpassword;
        break;
      case 2:
        this.shownewpassword = !this.shownewpassword;
        break;
      case 3:
        this.showconfirmpassword = !this.showconfirmpassword;
        break;
      default:
        break;
    }
  }

  createdUser: any;
  getFormData(data: any) {
    this.showLoader = true;
    this.createdUser = null;
    this.apiservice.createUserWithShortDetails(data).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.closeCreateUser()

        if (res.statusCode == 200) {
          this.createdUser = res.userId;
          // this.alertservice.success('success', res.message);
          this.getUserNamesByUserName();

          this.alertservice
            .sweetConfirm(
              res.message + '\n Do you want to assign sites for this user!'
            )
            .then((response) => {
              if (response.isConfirmed) {
                this.openSiteMapping(null);
              }
            });
        } else {
          this.alertservice.error('error', res.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        this.alertservice.error('error', 'Failed!');
      },
    });
  }

  userSearch: any;
  siteSearch: any;
  usersList: any = [];
  getUserNamesByUserName() {
    this.showLoader = true;
    this.storageService.loading_text = 'loading...'
    this.apiservice.getUserNamesByUserName().subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.statusCode == 200) {
          this.usersList = res.data;
          this.storageService.loading_text = '';
        } else {
          this.storageService.loading_text = 'no users found!';
        }
      },
      error: (err) => {
        this.storageService.loading_text = 'failed!'
        this.showLoader = false;
      },
    });
  }

  filters = [
    {
      id: 1,
      value: null,
      label: 'All',
    },
    {
      id: 2,
      value: true,
      label: 'Assigned',
    },
    {
      id: 3,
      value: false,
      label: 'Not Assigned',
    },
  ];

  selectAllSites: boolean = false;
  userSites: any = [];
  currentUser: any;
  filter: any;
  userIndex: any;

  showSiteMapping: boolean = false;
  openSiteMapping(data: any) {
    this.showSiteMapping = true;
    // this.toggleAllIndividual();
    this.currentUser = data;
    this.filter = 1;
    if (!data) {
      this.filter = -1;
    }
    
    // this.userIndex = this.usersList.indexOf(data);
    // this.userSites = [];
    this.getSitesForGlobal({
      userId: this.createdUser ? this.createdUser : data?.userId,
      loginId: this.userData?.UserId,
      assigned: null,
    });
  }

  closeSiteMapping() {
    this.showSiteMapping = false
  }

  showCreateUser: boolean = false;
  openCreateUser() {
    this.showCreateUser = true;
  }

  closeCreateUser() {
    this.showCreateUser = false;
  }

  getSitesForGlobal(data: any) {
    this.showLoader = true;
    this.apiservice.getSitesListForGlobalAccountId(data).subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.Status == 'Success') {
          this.userSites = res.sitesList;
          this.toggleAllIndividual();
        }
      },
      error: (err) => {
        this.showLoader = false;
      },
    });
  }

  toggleSites() {
    for (var i = 0; i < this.userSites.length; i++) {
      this.selectAllSites ? this.searchPipe.transform(this.userSites, this.siteSearch)[i].assigned = true : this.userSites[i].assigned = false;
    }
  }

  toggleAllIndividual() {
    this.selectAllSites = this.userSites.every((item: any) => item.assigned == true);
  }

  // currentFilter: any;
  filterSites(data: any) {
    // this.currentFilter = data;
    this.getSitesForGlobal({
      userId: this.createdUser ? this.createdUser : this.currentUser?.userId,
      loginId: this.userData?.UserId,
      assigned: data?.value,
    });
  }

  applyMapping() {
    let isChecked = this.userSites.some((item: any) => item.assigned);
    if (this.filter == 2) {
      if (!isChecked) {
        this.alertservice.sweetError('Please select atleast one site!');
        return;
      };

      this.showLoader = true;
      this.apiservice.unassignSiteForUser({
        userId: this.createdUser ? this.createdUser : this.currentUser?.userId,
        loginId: this.userData?.UserId,
        siteId: Array.from(this.userSites.filter((el: any) => el['assigned']), (item: any) => item.siteId),
      }).subscribe({
        next: (res: any) => {
          this.showLoader = false;
          this.createdUser = null;
          if (res.statusCode === 200) {
            this.closeSiteMapping();
            this.alertservice.success('success', res.message);
            // this.getSitesForGlobal({
            //   userId: this.currentUser?.userId,
            //   assigned: false,
            // });
          } else {
            this.alertservice.error('error', res.message);
          }
        },
        error: (err: any) => {
          this.showLoader = false;
          this.alertservice.error('error', 'Failed');
        },
      });
    } else if (this.filter == 3 || this.filter == -1) {
      if (!isChecked) {
        this.alertservice.sweetError('Please select atleast one site!');
        return;
      };

      this.showLoader = true;
      this.apiservice.applySitesMapping({
        userId: this.createdUser ? this.createdUser : this.currentUser?.userId,
        loginId: this.userData?.UserId,
        siteList: Array.from(this.userSites.filter((el: any) => el['assigned']), (item: any) => item.siteId),
      }).subscribe({
        next: (res: any) => {
          this.showLoader = false;
          if (res.status === 'Success') {
            this.closeSiteMapping();
            this.createdUser = null;
            this.alertservice.success('success', res.message);
            // this.getSitesForGlobal({
            //   userId: this.currentUser?.userId,
            //   assigned: true,
            // });
          } else {
            this.alertservice.error('error', res.message);
          }
        },
        error: (err: any) => {
          this.showLoader = false;
          this.alertservice.error('error', 'Failed');
        },
      });
    }
  }

  logout() {
    localStorage.clear();
    this.authservice.isLoggedin.complete();
    this.router.navigateByUrl('/login');
  }

  accountEdit: boolean = true;
  accountupdate() {
    this.accountEdit = !this.accountEdit;
  }

  userDetailslistRoles() {
    this.userSer.listRoles().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.userRoles = res.roleList;
        let obj: any = createUserFields.filter((item: any) => item.key === 'roleList')[0];
        obj.questionOptions = this.userRoles;
      } else {
        this.alertservice.error('error', res.message);
      }
    },
      (err: any) => {
        this.alertservice.error('error', err);
      }
    );
  }

}
