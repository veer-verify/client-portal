import { Component, ViewChild, ElementRef, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { jwtDecode } from "jwt-decode";
import { AuthService } from '../services/auth/authservice.service';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/auth/storage.service';

@Component({
  selector: 'app-googlelogin',
  templateUrl: './googlelogin.component.html',
  styleUrls: ['./googlelogin.component.css']
})
export class GoogleloginComponent {

  constructor(
    private ssoauthService: SocialAuthService,
    private router: Router,
      private authservice: AuthService,
      private alertService: AlertService,
      private apiService: ApiService,
      public storageService: StorageService,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.renderGoogleSignIn();
  }


  @ViewChild('googleSignInButton') googleSignInButton: ElementRef;
  renderGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: '948197311612-ijntk6d8patg7bvot4sengcvqt63of39.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

    window.google.accounts.id.renderButton(this.googleSignInButton.nativeElement, { size: "medium" });
    window.google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    const token = response.credential;
    const userData: any = jwtDecode(token);
    console.log(userData,token);

  // this.authservice.loginNew(userData?.email, "Baji@123#").subscribe((res: any) => {
  //   if(res.Status == 'Success') {
  //     this.storageService.storeEncrData('user', res);
  //     this.authservice.isLoggedin.next(true);
  //     this.authservice.getAuthStatus();

  //     if(res.Status == 'Success') {
  //       this.router.navigateByUrl('/guard');
  //     }
  //   }
  // })

  }


  signInWithFB(): void {
    this.ssoauthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signWithGoogle(): void{
    this.ssoauthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      this.router.navigateByUrl('/guard');
    });
  }

  signOut() :any{
    this.ssoauthService.signOut();
  }

  refreshToken(): void {
    this.ssoauthService.refreshAuthToken(FacebookLoginProvider.PROVIDER_ID);
  }


}
