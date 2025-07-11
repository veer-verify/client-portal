import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsightComponent } from './insight/insight.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './services/loader/loader.component';
import { SearchPipe } from './services/pipes/search-pipe.pipe';
import { VjsPlayerComponent } from './services/vjs-player/vjs-player.component';
import { ResearchComponent } from './research/research.component';
import { GaurdComponent } from './gaurd/gaurd.component';
import { ChatpopupComponent } from './chatpopup/chatpopup.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { SupportComponent } from './support/support.component';
import { TrendsComponent } from './trends/trends.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,  ReactiveFormsModule  } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './services/alertservice/alert/alert.component';
import { DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SitePipe } from './insight/sitePipe.pipe';
import { SortPipe } from './services/pipes/sorting-pipe.pipe';
// import { ChartsModule } from 'ng2-charts';
import { ClientServicesComponent } from './client-services/client-services.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { ErrorpageComponent } from './services/errorpage/errorpage.component';
import { ProfileComponent } from './profile/profile.component';
import { FieldPipe } from './trends/fieldPipe.pipe';
import { DraggingDirective } from './services/charts/draggable.directive';
import { HelpdeskrequestComponent } from './support/helpdeskrequest/helpdeskrequest.component';
import { AddAdvertisementComponent } from './advertisements/add-advertisement/add-advertisement.component';
import { ToasterComponent } from './services/alertservice/toaster/toaster.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { TimelapseComponent } from './timelapse/timelapse.component';
import { RemoveDuplicatesPipe } from './services/pipes/remove-duplicates.pipe';
import { KeysPipe } from './services/pipes/keys.pipe';
import { SensorsComponent } from './sensors/sensors.component';
import { LiveEventsComponent } from './live-events/live-events.component';
import { SimCardsComponent } from './sim-cards/sim-cards.component';
import { AddSimComponent } from './sim-cards/add-sim/add-sim.component';
import { DummyVideoComponent } from './utilities/dummy-video/dummy-video.component';
import { NgxPrintElementModule } from 'ngx-print-element';
import { UniquePipe } from './services/pipes/unique.pipe';
import { DeviceHealthComponent } from './device-health/device-health.component';
import { GoogleloginComponent } from './googlelogin/googlelogin.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { ErrorInterceptor } from './services/auth/error.interceptor';
import { NvrComponent } from './nvr/nvr.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ErrInfoComponent } from './utilities/err-info/err-info.component';
import { CreateFormComponent } from './utilities/create-form/create-form.component';
import { VideoPlayerComponent } from './utilities/video-player/video-player.component';
import { ClientFormComponent } from './client-form/client-form.component';

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig
} from 'angularx-social-login';
import { AddIncidentComponent } from './add-incident/add-incident.component';
import { ImagePipe } from './services/pipes/image.pipe';
import { SanitizePipe } from './services/pipes/sanitize.pipe';




@NgModule({
  declarations: [
    AppComponent,
    InsightComponent,
    NavbarComponent,
    GaurdComponent,
    ResearchComponent,
    TrendsComponent,
    AdvertisementsComponent,
    SupportComponent,
    ChatpopupComponent,
    LoaderComponent,
    SearchPipe,
    SitePipe,
    FieldPipe,
    SortPipe,
    VjsPlayerComponent,
    LoginComponent,
    AlertComponent,
    ClientServicesComponent,
    AdminpanelComponent,
    ErrorpageComponent,
    ProfileComponent,
    DraggingDirective,
    HelpdeskrequestComponent,
    AddAdvertisementComponent,
    ToasterComponent,
    LiveViewComponent,
    IncidentsComponent,
    TimelapseComponent,
    RemoveDuplicatesPipe,
    KeysPipe,
    VideoPlayerComponent,
    SensorsComponent,
    LiveEventsComponent,
    SimCardsComponent,
    AddSimComponent,
    DummyVideoComponent,
    UniquePipe,
    DeviceHealthComponent,
    GoogleloginComponent,
    UserProfileComponent,
    NvrComponent,
    ErrInfoComponent,
    CreateFormComponent,
    ClientFormComponent,
    AddIncidentComponent,
    ImagePipe,
    SanitizePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    NgbModule,
    SocialLoginModule
    // SocialLoginModule
    // ChartsModule,
    // NgxPrintElementModule
  
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    provideCharts(withDefaultRegisterables()),
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          // {
          //   id: GoogleLoginProvider.PROVIDER_ID,
          //   provider: new GoogleLoginProvider('654230831370-a114u4r22ehgpfrods4irbj91eoerq9a.apps.googleusercontent.com',
          //   {
          //    // scopes : environment.auth.scopes,
          //     prompt : 'none'
          //   }),
          // },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1442566939524545')
          }
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports:[DraggingDirective]
})
export class AppModule { }
