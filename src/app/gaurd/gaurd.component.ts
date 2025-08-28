import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, catchError, fromEvent, map, Observable, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/storage.service';
import { SiteService } from '../services/site.service';


@Component({
  selector: 'app-gaurd',
  templateUrl: './gaurd.component.html',
  styleUrls: ['./gaurd.component.css']
})
export class GaurdComponent implements OnInit {
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

  // rtsp://admin:xx2317xx2317@10.0.2.242:559/cam/realmonitor?channel=6&subtype=1
  constructor(
    private apiService: ApiService,
    private changeDetection: ChangeDetectorRef,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private authSer: AuthService,
    private siteService: SiteService
  ) { }

  user: any;
  siteServices: any;

  resizeObservable: any;
  resizeSubscription: any;
  iframeHeight: any;
  currentInfo: any;
  ngOnInit(): void {
    document.body.style.backgroundImage = "linear-gradient(325deg, rgba(20, 31, 77, 0.9) 18%, rgba(90, 13, 3, 0.9) 66%), url('../../assets/icons/background.jpg'))";
    if (this.apiService.sessionstatus() == false) {
      this.storageService.deleteStoredEncrData('savedcams');
    }
    this.getSitename();
    this.user = this.storageService.getEncrData("user");
    this.siteServices = this.storageService.getEncrData('siteservices');
    this.currentInfo = this.storageService.getEncrData('navItem');
    this.user = this.storageService.getEncrData('user');

    // this.resizeObservable = fromEvent(window, 'resize');
    // this.resizeSubscription = this.resizeObservable.subscribe((evt: any) => {
    //   this.iframeHeight = evt.target.innerWidth - 1400;
    //   console.log(this.iframeHeight);
    // });
  }

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

  removeDuplicateSites() {
    var names_array_new = this.sites.siteList.reduceRight(function (r: any, a: any) {
      r.some(function (b: any) { return a.siteId === b.siteId; }) || r.push(a);
      return r;
    }, []);
    this.sites.siteList = names_array_new.reverse();
  }

  // for sites and data of cameras
  firstTimeout: any;
  errInfo: any = null;
  getSitename() {
    this.showLoader = true;
    this.apiService.getSites().subscribe((res: any) => {
      // console.log(res);
      if(res?.Status == "Failed") {
        if(res.Message == "Data not available") {
          this.sitedata = false;
          // this.showLoader = false;
          this.getSitesListForUserName();
        }
        if(res.Message == "Insufficient details") {
          this.apiService.onHTTPerror({ status: 404 });
        }
        if(res.Message == "Invalid user details") {
          this.apiService.refresh();
          this.firstTimeout = setTimeout(() => {
            this.getSitename();
          }, 2000)
        }
      } else {
        this.sites = res;
        var sitelist = this.sites.siteList
        // const sortAlphaNum = (a: any, b: any) => a.siteName.localeCompare(b.siteName, 'en', { numeric: true })
        sitelist = this.sites.siteList.sort((a: any, b: any) => (a.siteName ? a.siteName : a.siteName) > (b.siteName ? b.siteName :b.siteName) ? 1 : (a.siteName ? a.siteName : a.siteName) < (b.siteName ? b.siteName : b.siteName) ? -1 : 0);
        this.sites.siteList = sitelist;
        this.removeDuplicateSites();
        var user = this.storageService.getEncrData("user");
        if (user.UserName == 'sales@ivisecurity.com') {
          sitelist.forEach((item: any) => {
            if(item.siteId == 1001) {
              item.siteName = "Your Gas Station";
              item.siteShortName = "Gas Station";
            }
            if(item.siteId == 1016) {
              item.siteName = "Your Pharmacy";
              item.siteShortName = "Pharmacy";
            }
            if(item.siteId == 1014) {
              item.siteName = "Your Construction Company";
              item.siteShortName = "Construction";
            }
            if(item.siteId == 1015) {
              item.siteName = "Your Shopping Center";
              item.siteShortName = "Shopping Center";
            }
            if(item.siteId == 1035) {
              item.siteName = "Your Machinery Service";
              item.siteShortName = "Machinery Service";
            }
          });

          sitelist = sitelist.sort((a: any, b: any) => (a.siteName ? a.siteName : a.siteName) > (b.siteName ? b.siteName :b.siteName) ? 1 : (a.siteName ? a.siteName : a.siteName) < (b.siteName ? b.siteName : b.siteName) ? -1 : 0);
          this.sites.siteList = sitelist;
          this.removeDuplicateSites();
        } else {
          this.sites.siteList = sitelist;
          this.removeDuplicateSites();
        }

        this.storageService.storeEncrData('selectedsite', this.sites);
        this.storageService.storeEncrData('siteidfromgaurdpage', this.sites.siteList[0]);
        if(this.sites.siteList.length > 0) {
          this.firstAPiHitforCamdata()
          // var x = this.storageService.getEncrData('savedcams');
          // if (x != null) {
          //   this.firstLocalHitforCamdata();
          // } else {
          //   this.firstAPiHitforCamdata()
          // }
        } else {
          this.cameras = null;
          this.showLoader = false;
        }
      }
    }, (error) => {
      this.showLoader = false;
        if (error?.ok == false) {
          this.apiService.onHTTPerror(error);
        }
    })
  }

  firstLocalHitforCamdata() {
    var x: any = this.storageService.getEncrData('savedcams');
    this.currentsite = x[0].siteId;
    this.cameras = x[0].data;
    // this.apiService.getServices(this.currentsite);
    this.commoncommands();
    this.firstTimeout = setTimeout(() => {
      this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
      if (this.cameras.length > 0) { this.optionlabel.nativeElement.click(); }
    }, 1500);
  }

  firstAPiHitforCamdata() {
    let user = this.storageService.getEncrData('user');
    this.apiService.getCameras(this.sites?.siteList[0]?.siteId).subscribe((res: any) => {
      if (res.Status == "Failed") {
        if(res.Message == "Invalid accessToken") {
          this.apiService.refresh();
          setTimeout(() => { this.savecams() }, 1000)
          }
        if(res.Message == "Sorry no cameras found. Try again later.") {
          this.cameras = [];
          this.showLoader = false;
          this.savecams();
        }
      }
      if (res.Status == "Success") {
        if(this.currentInfo) {
          this.currentsite = this.currentInfo.site.siteId;
        } else {
          this.currentsite = this.sites?.siteList[0]?.siteId;
        }
        // this.apiService.getServices(this.currentsite); //this was required once check ones to be removed
        if(user?.UserId == 1641) {
          // this.cameras = this.myNewData;
          this.siteService.getCamerasForSiteId({siteId: this.currentsite}).subscribe((cams: any) => {
            this.cameras = cams;
            this.commoncommands();
            this.firstTimeout = setTimeout(() => {
              this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
              if (this.cameras.length > 0) { this.optionlabel.nativeElement.click(); }
            }, 2000);
          });
        } else {
          this.cameras = res.CameraList;
        }

        //  for sales team this code is generated
        this.fixForSales(this.currentsite);
        //  code for sales team ends
        this.commoncommands();
        this.savecams();
        // this.apiService.getServices(this.currentsite);
        const sortAlphaNum = (a: any, b: any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
        this.cameras = this.cameras.sort(sortAlphaNum)
        this.firstTimeout = setTimeout(() => {
          this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
          if (this.cameras.length > 0) { this.optionlabel.nativeElement.click(); }
        }, 2000);
      }
    }, (error) => {
      if (error) {
        if (error.ok == false) {
          // console.log(error, 'camlist')
          this.apiService.onHTTPerror(error);
        }
      }
    })
  }

  savedcams: any[] = [];
  async savecams() {
    const a: { siteId: any; data: any; }[] = [];
    this.savedcams.push({ siteId: this.currentsite, data: this.cameras });
    this.storageService.storeEncrData('savedcams', this.savedcams);
    this.sites?.siteList.forEach((el: any) => {
      if (el.siteId != this.currentsite) {
        this.savedcams.push({ siteId: el.siteId, data: [] });
        this.apiService.getCameras(el.siteId).subscribe((res: any) => {
          if (res.Status == "Success" || res.Message == "Sorry no cameras found. Try again later.") {
            if (res.Message == "Sorry no cameras found. Try again later.") {
              // this.savedcams.push({siteId : el.siteId, data : []});
              this.savedcams.forEach((item: any) => {
                if (item.siteId == el.siteId) {
                  item.data = [];
                }
                this.storageService.storeEncrData('savedcams', this.savedcams)
              });
            }
            else {
              const sortAlphaNum = (a: any, b: any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
              var sortedcamdata = res.CameraList.sort(sortAlphaNum)
              this.savedcams.forEach((item: any) => {
                if (item.siteId == el.siteId) {
                  item.data = sortedcamdata

                  /* Dummy user code */
                  var user = this.storageService.getEncrData("user");
                  if (item.siteId == 1015 && user?.UserName == 'sales@ivisecurity.com') {
                    sortedcamdata.forEach((a: any) => {
                      // console.log(a);
                      var i = sortedcamdata.indexOf(a) + 1;
                      if (i < 10) { i = "0" + i }
                      let j=sortedcamdata.indexOf(a) + 1;
                      // a.snapShotUrl = `http://usmgmt.iviscloud.net:444/ivis-us-allsiteimages/tempdata/CAM${i}.png`;
                      a.snapShotUrl = `assets/cam/CAM${j}.jpg`;
                      a.streamingUrl = "1s122";
                      a.cameraId = "IVISUSA"
                      a.cameraStatus = 'Connected';
                    });
                    sortedcamdata.splice(6, 1);
                    sortedcamdata.splice(11, 1);
                    sortedcamdata.splice(16, 1);
                    sortedcamdata.splice((sortedcamdata.length - 1), 1);
                  }
                };
                this.storageService.storeEncrData('savedcams', this.savedcams)
              });
            }
            // this.storageService.storeEncrData('savedcams', this.savedcams)
          }
          if (res.Status == "Failed") {
            if (res.Message == "Invalid accessToken") { this.apiService.refresh(); setTimeout(() => { this.savecams() }, 1000) }
          }
        }, (error) => {
          if (error.ok == false) {
            // this.alertService.warning('Session Expired');
            this.apiService.onHTTPerror(error);
          }
          // console.log("Something went wrong");
        }
        );
      }
    });
  }

  fileExists(url: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    if (xhr.status == 404) { return false; }
    else { return true; }
  }

  fixForSales(site: any) {
    var user = this.storageService.getEncrData("user");
    if(user.UserName == 'sales@ivisecurity.com') {
      // if(user.UserName == 'ivisus'){
      this.cameras.forEach((a: any) => {
        var i = this.cameras.indexOf(a) + 1;
        if (i < 10) { i = "0" + i; }
        a.snapShotUrl = `http://usmgmt.iviscloud.net:444/ivis-us-allsiteimages/sales-portal-images/salesconsulting-Cam${i}.jpg`;
        // a.snapShotUrl = `http://usmgmt.iviscloud.net:444/ivis-us-allsiteimages/tempdata/CAM${i}.png`;
        // a.snapShotUrl=`assets/stone/CAM${i}.png`;
        a.cameraId = "IVISUSA"
        a.streamingUrl = "1s122";
        a.cameraStatus = 'Connected';
      });
      this.cameras.splice(6, 1);
      this.cameras.splice(11, 1);
      this.cameras.splice(16, 1);
      this.cameras.splice((this.cameras.length - 1), 1);
    }
  }


  showcams = true;
  currentsite: any;
  myNewData = [];
  getCameras(event: any, site: any, index: any) {
    // this.storageService.storeEncrData('navItem', {site: site, index: index});
    this.storageService.site_sub.next({site: site, index: this.sites.indexOf(site)});
    if (this.firstTimeout) { clearTimeout(this.firstTimeout) }
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    this.pagenumber = 1;
    this.adjustGrid();
    this.viewPanelData = site;
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    if (site.siteId != this.currentsite) {
      if(site.siteId > 36000) {
        this.siteService.getCamerasForSiteId({siteId: site.siteId}).subscribe((cams: any) => {
          // console.log(cams);
          this.myNewData = cams;
          this.cameras = this.myNewData;
          this.myNewData.forEach((el: any) => {
            if(el.siteId == site.siteId) {
              this.currentsite = el.siteId;
            }
          });
          this.commoncommands();
          setTimeout(() => {
            if (event.target.nextElementSibling != null) {
              event.target.click();
            }
          }, 210);
        });

      } else {
        // this.apiService.getServices(site.siteId);
        var x: any = this.storageService.getEncrData('savedcams');
        if(x) {
          x.forEach((el: any) => {
            if(el.siteId == site.siteId) {
              this.cameras = el.data,
              this.currentsite = el.siteId;
            }
          });

          if(event.target.nextElementSibling == null) {
            this.showcams = false
          } else {
            var xl = event.target.nextElementSibling.style.maxHeight
            if (xl) { this.showcams = false } else { this.showcams = true }
            if (this.cameras.length != 0) {
              setTimeout(() => {
                if (this.cameras.length > 0) { this.toggleAccordian(event, index); }
                setTimeout(() => {
                  this.optionlabel.nativeElement.click();
                }, 200);
              }, 200)
            }
          }
          this.commoncommands();
          setTimeout(() => {
            if (event.target.nextElementSibling != null) {
              event.target.click();
            }
          }, 210);
          if (site.siteId == 1045) {
            var cams: any[] = [];
            this.cameras.forEach((el: any) => {
              el.cameraStatus = "Connected";
              el.snapShotUrl = `http://usmgmt.iviscloud.net:444/ivis-us-allsiteimages/${el.cameraId}.png?`;
              cams.push(el);
            });
            this.cameras = cams;
          }
        } else {
          this.cameras = null;
          this.paginatedCameraList = null;
          this.changeDetection.detectChanges();
          this.loadCameraList(event, site, index);
        }
      }
    } else {
      var x = event.target.nextElementSibling.style.maxHeight
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
    this.storageService.storeEncrData('siteidfromgaurdpage', site);
    var siteId = site.siteId;
    this.currentsite = siteId;
    this.apiService.getCameras(siteId).subscribe((res: any) => {
      if (res.Status == "Failed") {
        if(res.Message == "Invalid accessToken") {
          this.apiService.refresh(); setTimeout(() => { this.savecams() }, 1000)
        }
        if(res.Message == "Sorry no cameras found. Try again later.") {
          this.cameras = []
        }
      }
      if (res.Status == "Success") {
        this.cameras = res.CameraList;
        const sortAlphaNum = (a: any, b: any) => a.cameraId.localeCompare(b.cameraId, 'en', { numeric: true })
        this.cameras = this.cameras.sort(sortAlphaNum)
        this.commoncommands();
        if (this.cameras.length > 0) { this.toggleAccordian(event, index); }

        // console.log(siteId)
        if (siteId == 1045) {
          // console.log(this.cameras)
        }
      }
    }, (error) => {
      // console.log(error, 'camlist')
      if (error.ok == false) {
        // this.alertService.warning('Session Expired');
        this.apiService.onHTTPerror(error);
      }
      // console.log("Something went wrong");
    })
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
      x.style.paddingRight = 30 + "%";
    } else {
      x.style.paddingRight = 0 + "%";
    }
  }

  adjustGrid() {
    var x = window.innerWidth;
    var y;
    if (x < 426) { y = 1 };
    if (x < 1023 && x > 426) { y = 2 }
    if (x > 1023 && x < 1800) { y = 3 }
    if (x > 1800) { y = 4 }
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

  cameraIdClicked(cam: any) {
    // this.pagenumber = 1;
    this.gridClicked = 1;
    this.pagenumber = this.cameras.indexOf(cam) + 1;
    this.pagination();
    var x = this.gridCont.nativeElement;
    x.style.gridTemplateColumns = "repeat(1, 1fr)";
    x.style.paddingRight = 30 + "%";
    this.paginatedCameraList = [cam];
    this.closemodal();
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

  paginatedCameraList: any;
  selectNumbers: any | [];
  selector() {
    var x = Number(this.cameras?.length);
    var z = Number(this.gridClicked * this.gridClicked);
    var a = Math.ceil(x / z);
    this.selectNumbers = new Array(a).fill(0).map((x, i) => i + 1);
  }

  pagination() {
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
    if (this.cameras?.length == 1) {
      this.gridClicked = 1
    }
  }

  // on search events hide dislay irrelevent
  onInput(e: any) {
    this.showcams = false;
    var x = e.target.value;
    var items = this.sites.siteList
    this.adjustGrid();
    var a: any[] = items.filter((item: any) => JSON.stringify(item).toLowerCase().indexOf(x.toLowerCase()) !== -1);
    if (a.length == 0) { this.showcams = false }
    if (a.length > 0) {
      if (a[0].siteId != this.currentsite) {
        var x: any = this.storageService.getEncrData('savedcams');
        x.forEach((el: any) => {
          if (el.siteId == a[0].siteId) {
            this.cameras = el.data;
            this.currentsite = el.siteId;
            // this.apiService.getServices(el.siteId);
          }
        });
        setTimeout(() => {
          if (a.length != 0) {
            this.commoncommands();
            if (this.cameras.length > 0) { this.optionlabel.nativeElement.click(); }
            // this.panel.nativeElement.style.maxHeight = this.panel.nativeElement.style.scrollHeight + 'px';
          }
        }, 1000);
      } else {
        this.showcams = true;
        if (a.length == 0) { this.showcams = false }
      }
    }
  }


  showOptions() { return this.apiService.showOptions() }
  showOptions1() { return this.apiService.showOptions1() }
  closemodal() { return this.apiService.closemodal(); }
  toQRmodal() { return this.apiService.toQR() }
  imgRefresh: boolean = true;
  interval: any;

  // refresh2(e:any, timeout:any) {
  //   var x  = this.storageService.getEncrData('siteidfromgaurdpage');
  //   var img = e.target;
  //   console.log(x);
  //     clearInterval(this.interval);
  //     this.imgRefresh=true;
  //     setTimeout(() => {
  //       var d = new Date();
  //       var http = img.src;
  //       if (http.indexOf("&d=") != -1) {
  //           http = http.split("&d=")[0];
  //       }
  //       img.src = http + '&d=' + d.getTime();
  //   }, timeout);
  // }

  refresh1(e: any, timeout: any) {
    var x = this.storageService.getEncrData('siteidfromgaurdpage');
    var img = e.target;
    if (x?.siteId != 1045) {
      clearInterval(this.interval);
      this.imgRefresh = true;
      setTimeout(() => {
        var d = new Date;
        var http = img.src;
        if (http.indexOf("&d=") != -1) {
          http = http.split("&d=")[0];
        }
        img.src = http + '&d=' + d.getTime();
      }, timeout);
    } else {
      this.imgRefresh = false;
      setTimeout(() => {
        this.imgRefresh = true;
        img.src = img.src + "t" + new Date().getTime();
      }, timeout);
    }
    // console.log(e.target.src + '&d=' + new Date().getTime());
  }

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


  /* other sites */
  otherSiteIds: any = [];
  otherCameras: any = [];
  getSitesListForUserName() {
    this.showLoader = true;
    this.siteService.getSitesListForUserName(this.user).subscribe((sites: any) => {
      // console.log(sites);
      this.showLoader = false;
      sites.sites.forEach((siteItem: any) => {
        siteItem.first = false;
      })
      this.otherSiteIds = sites?.sites.sort((a: any, b: any) => a.siteName > b.siteName ? 1 : a.siteName < b.siteName ? -1 : 0);
      // this.otherSiteIds[0].first = true;
      if(this.currentInfo) {
        this.getCamerasForSiteId(this.currentInfo?.site, this.currentInfo?.index);
      } else {
        this.getCamerasForSiteId(this.otherSiteIds[0], 0);
      }

      this.gridClicked = 3;
    }, (err: any) => {
      this.showLoader = false;
      this.errInfo = 'Unknown error!';
    })
  }

  isClick: boolean = false;
  currentSite1: any;
  currentIndex: number = 0;
  previousIndex: number = 0;
  getCamerasForSiteId(sitee: any, index: any) {
    // this.storageService.storeEncrData('navItem', {site: sitee, index: index});
    this.storageService.site_sub.next({site: sitee, index: this.sites.indexOf(sitee)});
    sitee.first = !sitee.first;
    if(this.currentInfo) {
      this.currentInfo.site.first = true;
    }
    this.previousIndex = this.currentIndex;
    this.currentIndex = index;
    if(this.previousIndex != index) {
      this.otherSiteIds[this.previousIndex].first = false;
    }
    
    if(sitee.first) {
      this.currentSite1 = sitee;
      this.showLoader = true;
      this.currentCamera1 = [];
      this.siteService.getCamerasForSiteId(sitee).subscribe((cams: any) => {
        this.showLoader = false;
        if(cams.length > 0) {
          this.otherCameras = cams;
          this.firstAPiHitforCamdata();
        } else if(cams.length == 0) {
          this.otherCameras = [];
          this.errInfo = 'No Cameras';
        }
      }, (err: any) => {
        this.showLoader = false;
        this.errInfo = 'Unknown error!';
      });
    } else {
      this.otherCameras = [];
    }
  }

  sanitizedUrls: Map<string, SafeResourceUrl> = new Map();
  sanitizeUrl(url: string | undefined): SafeResourceUrl | null {
    if (url === undefined) {
      return null;
    } else {
      let sanitizedUrl = this.sanitizedUrls.get(url);
      if (!sanitizedUrl) {
        sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.sanitizedUrls.set(url, sanitizedUrl);
      }
      return sanitizedUrl;
    }
  }


  itemsPerPage: number = 9;
  currentPage: number = 1;
  selectedCamera: any;
  gridClicked1: any = 3
  changeItemsForPage(items: number) {
    this.currentCamera1 = [];
    this.currentPage = 1;
    this.gridClicked1 = Math.sqrt(items)
    this.itemsPerPage = items;
    var x = this.myGrids.nativeElement;
    x.style.gridTemplateColumns = `repeat(${Math.sqrt(items)}, 1fr)`;
    if(Math.sqrt(items) == 1) {
      x.style.paddingRight = 30 + "%";
    } else {
      x.style.paddingRight = 0 + "%";
    }
  }

  // ngDoCheck() {
  //   console.log(this.currentCamera1.length)
  // }

  get totalPages(): number {
    return Math.ceil(this.otherCameras.length / this.itemsPerPage);
  }

  currentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.otherCameras.slice(startIndex, endIndex);
  }

  onPageSelectChange() {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (x, index) => index + 1);
  }

  nextPage1() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage1() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  currentCamera1: any = [];
  openCurrentCamera(id: any) {
    this.currentCamera1 = []
    this.gridClicked1 = 1;
    this.changeItemsForPage(1)
    this.currentCamera1.push(id);
  }

}
