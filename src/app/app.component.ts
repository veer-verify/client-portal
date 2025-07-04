import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { AuthService } from './services/auth/authservice.service';
import { StorageService } from './services/auth/storage.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  title = 'IVIS_security';

  showHead: boolean = false;
  currentpage:any;
  constructor(
    private router: Router,
    private authSer: AuthService,

    ) {
    router.events.subscribe((event)=>{
      if ( event instanceof RoutesRecognized ) {
        this.currentpage = (event.state.root.firstChild?.data['routeName']);
      }
    });
  }

  ngOnInit() {
    this.login1();
  }

  login1(){
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/error') {
          this.showHead = false;
        } else {
          // console.log("NU")
          this.showHead = true;
        }
      }
    });
  }

  @HostListener('document:mousemove')
  @HostListener('document:keyup')
  @HostListener('document:click')
  onUserActivity(): void {
    this.authSer.userActivity();
  }

}
























