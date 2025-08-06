import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth/authservice.service';
import { SiteService } from '../services/site.service';
import { Observable, Subject, fromEvent, takeUntil, timer } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { VideoConfigService } from '../services/video-config.service';
import { AlertService } from '../services/alertservice/alert-service.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit {
  @ViewChild('grids') gridCont: ElementRef;
  @ViewChild('myGrids') myGrids: ElementRef;
  @ViewChild('title') cameraName: ElementRef;
  @ViewChild('status') status: ElementRef;
  @ViewChild('camerabox') camerabox: ElementRef;
  @ViewChild('optionlabel') optionlabel: ElementRef;
  @ViewChild('panel') panel: ElementRef;

  showLoader = false;
  sites: any | [];
  cameras: any | [];
  cameralist: any | [];
  viewPanelData: any;
  searchText: any;
  sitedata = true;

  constructor(
    private apiSer: ApiService,
    private siteSer: SiteService,
    private changeDetection: ChangeDetectorRef,
    public storageService: StorageService,
    private sanitizer: DomSanitizer,
    private authSer: AuthService,
    private http: HttpClient,
    private configSer: VideoConfigService,
    private alerSer: AlertService
  ) { }

  user: any;
  siteServices: any;
  resizeObservable: any;
  resizeSubscription: any;
  currentInfo: any;
  ngOnInit(): void {
    // this.userActivity();
    // this.myFun();
    document.body.style.backgroundImage = "linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%), url('../../assets/icons/background.jpg'))";
    this.user = this.storageService.getEncrData("user");
    this.storageService.site_sub.subscribe({
      next: (res) => {
        this.currentInfo = res;
      }
    })
    this.getSitename();

    // this.resizeObservable = fromEvent(window, 'resize');
    // this.resizeSubscription = this.resizeObservable.subscribe((evt: any) => {
    // let height = evt.target.innerWidth /2;
    // this.adjustGrid()
    // if(evt.target.innerWidth < 992) {
    //   this.closeSideNav = true;
    // } else {
    //   this.closeSideNav = false;
    // }
    // });
  }

  loadingTxt: string;
  // getUrl(camData: any) {
  //   this.apiSer.getVideoUrl(camData).subscribe({
  //     error: (err: HttpErrorResponse) => {
  //       // console.log(err);
  //       if (err.status === 200) {
  //         camData.videoUrl = err.url;
  //       } else if(err.status === 0) {
  //         camData.videoUrl = null;
  //       }
  //     }
  //   });
  // }

  @ViewChildren("vjs") vjs: QueryList<any>;
  checkError: any;
  ngAfterViewInit() {
    setTimeout(() => {
      this.checkError = setInterval(() => {
        this.vjs.forEach(el => {
          var errorpop = (el.player.error_);
          let app_vjs_player = el.target.nativeElement.parentNode.parentNode
          let snapshotimg = el.target.nativeElement.parentNode.parentNode.nextElementSibling;
          if (errorpop != null) {
            app_vjs_player.style.display = "none";
            snapshotimg.style.display = "block";
            var width = (snapshotimg.offsetWidth);
            snapshotimg.style.height = (width * 0.687) + "px";
          }
        });
      }, 1000);
    }, 1000);
    this.adjustGrid();
    this.changeDetection.detectChanges();
  }

  ngOnDestroy() {
    if (this.checkError) { clearInterval(this.checkError); }
  }

  serviceData: any;
  getsiteservices(site: any) {
    this.siteSer.listSiteServices(site).subscribe((res: any) => {
      this.serviceData = res.siteServicesList;
    })
  }

  firstTimeout: any;
  errInfo: any = null;
  getSitename() {
    this.loadingTxt = '';
    this.showLoader = true;
    this.siteSer.getSitesListForUserName(this.user).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if (res.Status == "Failed") {
        this.loadingTxt = 'No sites mapped to user id';
        if (res.Message == "Data not available") {
          this.sitedata = false;
        }
      } else {
        // if(res.sites.length === 1) {
        //   this.closeSideNav = true
        // }

        this.sites = res.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
        this.getsiteservices(this.sites[0]);
        if (!this.currentInfo) {
          this.storageService.site_sub1.next({ site: this.sites[0], index: 0 });
        }
        var user = this.storageService.getEncrData("user");
        if (user?.UserName == 'sales@ivisecurity.com') {
          this.sites.forEach((item: any) => {
            if (item.siteId == 36349) {
              item.siteName = "Your Shopping Center";
              item.siteShortName = "Machinery Service";
            }
            if (item.siteId == 36347) {
              item.siteName = "Your Pharmacy";
              item.siteShortName = "Machinery Service";
            }
            if (item.siteId == 36331) {
              item.siteName = "Your Machinery Service";
              item.siteShortName = "Machinery Service";
            }
          });
        }
        if (this.sites.length > 0) {
          this.firstAPiHitforCamdata();
        } else {
          this.cameras = null;
        }
      }
    }, (error) => {
      this.showLoader = false;
      if (error?.ok == false) {
        this.siteSer.onHTTPerror(error);
      }
    })
  }

  firstAPiHitforCamdata() {
    // this.currentInfo = this.storageService.getEncrData('navItem');
    if (this.currentInfo) {
      this.currentsite = this.currentInfo?.site.siteId;
      this.viewPanelData = this.currentInfo?.site;
    } else {
      this.currentsite = this.sites[0]?.siteId;
      this.viewPanelData = this.sites[0];
    }
    this.showLoader = true;
    this.siteSer.getCamerasForSiteId({ siteId: this.currentsite }).subscribe((res: any) => {
      this.showLoader = false;
      this.cameras = res;
      if (!this.currentInfo) {
        // this.storageService.storeEncrData('navItem', { site: this.currentInfo.site, index: this.currentInfo.index });
        // this.storageService.site_sub.next({site: this.currentInfo.site, index: this.sites.indexOf(this.currentInfo.index)});
        // this.storageService.site_sub.next({site: this.sites[0], index: 0});
      }

      // this.fixForSales(this.currentsite);
      // this.apiService.getServices(this.currentsite);
      this.commoncommands();
      const sortAlphaNum = (a: any, b: any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true });
      this.cameras = this.cameras.sort(sortAlphaNum);
      // this.firstTimeout = setTimeout(() => {
      //   this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
      //   if (this.cameras.length > 0) { this.optionlabel.nativeElement.click(); }
      // }, 2000);
    }, (error: any) => {
      if (error) {
        if (error.ok == false) {
          this.siteSer.onHTTPerror(error);
        }
      }
    })
  }

  fileExists(url: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    if (xhr.status == 404) { return false; }
    else { return true; }
  }

  showcams = true;
  currentsite: any;
  myNewData = [];
  getCameras(event: any, site: any, index: any) {
    this.loadingTxt = '';
    this.camIndex = -1;
    // this.storageService.storeEncrData('navItem', {site: site, index: this.sites.indexOf(site)});
    this.storageService.site_sub1.next({ site: site, index: this.sites.indexOf(site) });
    if (this.firstTimeout) { clearTimeout(this.firstTimeout) }
    this.getsiteservices(site);
    this.pagenumber = 1;
    // this.adjustGrid();
    this.viewPanelData = site;
    if (site.siteId != this.currentsite) {
      this.showLoader = true;
      this.siteSer.getCamerasForSiteId({ siteId: site.siteId }).subscribe((cams: any) => {
        this.showLoader = false;
        if (cams?.length !== 0 && cams !== 'No Cameras Found') {
          this.myNewData = cams;
          this.cameras = this.myNewData;
          this.myNewData.forEach((el: any) => {
            if (el.siteId == site.siteId) {
              this.currentsite = el.siteId;
            }
          });

          this.commoncommands();
          setTimeout(() => {
            if (event.target.nextElementSibling != null) {
              event.target.click();
            }
          }, 210);
        } else {
          this.loadingTxt = 'Sorry You dont have camera feeds at this location';
          this.cameras = [];
          this.paginatedCameraList = null;
          this.changeDetection.detectChanges();
          this.loadCameraList(event, site, index);
        }
      });

    } else {
      var x = event.target.nextElementSibling.style.maxHeight;
      if (x) { this.showcams = false } else { this.showcams = true }
      if (this.cameras.length > 0) { this.toggleAccordian(event, index); }
    }
  }

  commoncommands() {
    this.showLoader = false;
    this.pagination();
    this.changeDetection.detectChanges();
  }

  loadCameraList(event: any, site: any, index: any) {
    var siteId = site.siteId;
    this.currentsite = siteId;
  }

  toggleAccordian(event: any, index: any) {
    var element = event?.target;
    var panel = element?.nextElementSibling;
    if (panel?.style.maxHeight) {
      element.classList.remove("active");
      panel.style.maxHeight = null;
    } else {
      element.classList.add("active");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  gridClicked: any;
  cameraGridSettings(gridcount: any) {
    this.pagenumber = 1;
    this.gridClicked = gridcount;
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = `repeat(${gridcount}, 1fr)`;
    if (gridcount == 1) {
      x.style.paddingRight = 20 + "%";
    } else {
      x.style.paddingRight = 0 + "%";
    }
  }

  adjustGrid() {
    var x = window.innerWidth;
    var y = 2;
    // if (x < 426) { y = 1 };
    // if (x < 1023 && x > 426) { y = 2 }
    // if (x > 1023 && x < 1800) { y = 3 }
    // if (x > 1800) { y = 3 }
    this.gridCont.nativeElement.style.gridTemplateColumns = `repeat(${y}, 1fr)`;
    this.gridClicked = y;
    var a = this.gridCont.nativeElement;
    a.style.gridTemplateColumns = `repeat(${this.gridClicked}, 1fr)`;
    if (this.gridClicked == 1) {
      a.style.paddingRight = 30 + "%";
    } else {
      a.style.paddingRight = 0 + "%";
    }
    // this.pagination();
  }

  currentCam: any;
  cameraIdClicked(cam: any) {
    // let location = window.location.hostname;
    // if (location === "client.ivisecurity.com") {
    //   Swal.fire({
    //     icon: "info",
    //     title: "To move the camera, please use below link!",
    //     footer: `<a href="http://clientportal.ivisecurity.com:8421/clientPortalUs/" target="_blank">CLICK HERE!</a>`,
    //     showCloseButton: true,
    //     showConfirmButton: false,
    //   });
    // } else {
    this.currentCam = cam;
    this.gridClicked = 1;
    this.pagenumber = this.cameras.indexOf(cam) + 1;
    this.pagination();
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(1, 1fr)";
    x.style.paddingRight = 20 + "%";
    this.paginatedCameraList = [cam];
    this.closemodal();
    // }
  }

  pagenumber = 1;
  nextPage() {
    var x = Number(this.cameras.length);
    var y = Number(this.pagenumber);
    var z = Number(this.gridClicked * this.gridClicked);
    var a = Math.ceil(x / z);
    var p = (Number(this.pagenumber))
    if (this.pagenumber != a) {
      this.pagenumber = p += 1;
      this.pagination()
    }
  }

  previousPage() {
    var p = (Number(this.pagenumber))
    if (this.pagenumber != 1) {
      this.pagenumber = p -= 1;
    }
    this.pagination()
  }

  paginatedCameraList: any = [];
  selectNumbers: any | [];
  selector() {
    var x = Number(this.cameras?.length);
    var z = Number(this.gridClicked * this.gridClicked);
    var a = Math.ceil(x / z);
    this.selectNumbers = new Array(a).fill(0).map((x, i) => i + 1);
  }

  pagination() {
    if (this.gridClicked == 1) {
      this.currentCam = this.cameras[Number(this.pagenumber) - 1];
    }
    var cameras = this.cameras;
    this.selector();
    const sortAlphaNum = (a: any, b: any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true });
    cameras = cameras?.sort(sortAlphaNum);

    var x;
    var y = Number(this.pagenumber)
    var gc = this.gridClicked;
    x = y -= 1
    var z = x * (gc * gc);
    var a = z + (gc * gc);
    const slicedArray = cameras?.slice(z, a);
    this.paginatedCameraList = slicedArray;
    // if (this.cameras?.length == 1) {
    //   this.gridClicked = 1
    // }
  }


  // showOptions() { return this.apiService.showOptions() }
  showOptions1() { return this.siteSer.showOptions1() }
  closemodal() { return this.siteSer.closemodal(); }
  // toQRmodal() { return this.apiService.toQR() }
  imgRefresh: boolean = true;
  interval: any;


  cameraHovered(e: any) {
    var x = e.target;
    var y = (x.children[2].children[0]);
    y.style.visibility = 'visible'
  }

  hoverExit(e: any) {
    var x = e.target;
    var y = (x.children[2].children[0]);
    y.style.visibility = 'hidden'
  }

  showSave: boolean = false;
  valueChange(event: any) {
    if (this.newCamName != event) {
      this.showSave = true
    } else {
      this.showSave = false
    }
  }

  camIndex: number;
  newCamName: string;
  openRename(data: any) {
    this.showSave = false;
    this.newCamName = data.name
    this.currentCam = JSON.parse(JSON.stringify(data));
    this.camIndex = this.paginatedCameraList.indexOf(data);
  }

  confirmRename() {
    var x = <HTMLElement>document.getElementById('editCamModel');
    x.style.display = "block";
  }

  updateCameraName() {
    this.siteSer.updateCameraName({ cameraId: this.currentCam?.cameraId, cameraName: this.currentCam?.name }).subscribe((res: any) => {
      this.camIndex = -1;
      this.alerSer.success('success', res.message);
      this.closeModel()
      this.firstAPiHitforCamdata()
    }, (err: HttpErrorResponse) => {
      this.alerSer.error('error', 'Failed');
      this.closeModel()
    })
  }

  closeModel() {
    this.camIndex = -1;
    var x = <HTMLElement>document.getElementById('editCamModel')
    x.style.display = "none";
  }

  // playStatus: boolean = false;
  btnIndex: number;
  playSiren(data: any) {
    this.siteSer.siren_sub.next(true);

    this.btnIndex = this.cameras.indexOf(data);
    this.http.get(`${environment.sitesUrl}/audio/play_1_0/${data.cameraId}`).subscribe((res: any) => {
      this.siteSer.siren_sub.next(false);
      this.btnIndex = -1
      if (res.statusCode === 200) {
        this.alerSer.success('success', res.message);
      } else {
        this.alerSer.error('error', res.message)
      }
    }, (err: HttpErrorResponse) => {
      this.siteSer.siren_sub.next(false);
      this.btnIndex = -1
      this.alerSer.error('error', 'Failed')
    });
  }

  // btnIndex1: number;
  playSiren1(data: any) {
    this.siteSer.siren_sub.next(true);

    this.btnIndex = this.paginatedCameraList.indexOf(data);
    this.http.get(`${environment.sitesUrl}/audio/play_1_0/${data.cameraId}`).subscribe((res: any) => {
      this.siteSer.siren_sub.next(false);
      this.btnIndex = -1;
      if (res.statusCode === 200) {
        this.alerSer.success('success', res.message);
      } else {
        this.alerSer.error('error', res.message)
      }
    }, (err: HttpErrorResponse) => {
      this.siteSer.siren_sub.next(false);
      this.btnIndex = -1
      this.alerSer.error('error', 'Failed')
    });
  }

  @ViewChildren('videos') videos!: QueryList<any>;
  normalCapture(camera: any, index: any) {
    let videoComponents = this.videos.toArray();
    if (videoComponents[index]) {
      videoComponents[index].plainCapture(camera);
    }
  }

  closeSideNav: boolean = false;
  toggleSideNav() {
    this.closeSideNav = !this.closeSideNav;
  }

  // private idleTimer: Observable<number>;
  // private destroy$ = new Subject<void>();
  // restartTimer(): void {
  //   const timeoutPeriod = 0.1 * 60 * 1000;
  //   this.idleTimer = timer(timeoutPeriod).pipe(takeUntil(this.destroy$));
  //   this.idleTimer.subscribe((res: any) => {
  //     this.showSideNav = true
  //   });
  // }

  // userActivity(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  //   this.destroy$ = new Subject<void>();
  //   this.restartTimer();
  // }

  sideNavInterval: any;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: any) {
    // this.closeSideNav = false;
  }

  myFun() {
    this.sideNavInterval = setInterval(() => {
      this.closeSideNav = true;
    }, 30000)
  }

  // openConfig(data: any) {
  //   this.gridClicked = 1;
  //   this.pagenumber = this.cameras.indexOf(data) + 1;
  //   this.pagination();
  //   var x = this.gridCont.nativeElement;
  //   x.style.gridTemplateColumns = "repeat(1, 1fr)";
  //   x.style.paddingRight = 20 + "%";
  //   this.paginatedCameraList = [data];
  //   // this.closemodal();
  // }

  range: number = 10;
  move(x: any, y: any) {
    this.updateMsg = 'Please Wait...';
    this.configSer.move({ url: this.currentCam.camera_config_url, cam: this.currentCam.cameraId, x: x, y: y, steps: this.range }).subscribe({
      next: (res: any) => {
        this.createCameraControls({ ...this.currentsite, ...this.currentCam, ...{ operationName: 'move' } });
        this.updateMsg = res.message;
        setTimeout(() => this.updateMsg = null, 3000);
      },
      error: (err: any) => {
        this.updateMsg = 'Failed!';
        setTimeout(() => this.updateMsg = null, 3000);
      }
    })
  }

  zoom(x: any) {
    this.updateMsg = 'Please Wait...';
    this.configSer.zoom({ url: this.currentCam.camera_config_url, cam: this.currentCam.cameraId, x: x, steps: this.range }).subscribe({
      next: (res: any) => {
        this.createCameraControls({ ...this.currentsite, ...this.currentCam, ...{ operationName: 'zoom' } });
        this.updateMsg = res.message;
        setTimeout(() => this.updateMsg = null, 3000);
      },
      error: (err: any) => {
        this.updateMsg = 'Failed!';
        setTimeout(() => this.updateMsg = null, 3000);
      }
    })
  }

  focus(x: any) {
    this.updateMsg = 'Please Wait...';
    this.configSer.focus({ url: this.currentCam.camera_config_url, cam: this.currentCam.cameraId, x: x, steps: this.range }).subscribe({
      next: (res: any) => {
        this.createCameraControls({ ...this.currentsite, ...this.currentCam, ...{ operationName: 'focus' } });
        this.updateMsg = res.message;
        setTimeout(() => this.updateMsg = null, 3000);
      },
      error: (err: any) => {
        this.updateMsg = 'Failed!';
        setTimeout(() => this.updateMsg = null, 3000);
      }
    })
  }

  updateMsg: any;
  home() {
    this.updateMsg = 'Please Wait...';
    this.configSer.home({ url: this.currentCam.camera_config_url, cam: this.currentCam.cameraId }).subscribe({
      next: (res: any) => {
        this.updateMsg = res.message;
        setTimeout(() => this.updateMsg = null, 3000);
      },
      error: (err: any) => {
        this.updateMsg = 'Failed!';
        setTimeout(() => this.updateMsg = null, 3000);
      }
    })
  }


  createCameraControls(data: any) {
    this.configSer.createCameraControls(data).subscribe()
  }

}
