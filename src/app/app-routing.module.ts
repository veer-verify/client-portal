import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { ClientServicesComponent } from './client-services/client-services.component';
import { GaurdComponent } from './gaurd/gaurd.component';
import { InsightComponent } from './insight/insight.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResearchComponent } from './research/research.component';
import { AuthGuard } from './services/auth/auth.guard';
import { ErrorpageComponent } from './services/errorpage/errorpage.component';
import { SupportComponent } from './support/support.component';
import { TrendsComponent } from './trends/trends.component';
import { LiveViewComponent } from './live-view/live-view.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { TimelapseComponent } from './timelapse/timelapse.component';
import { SensorsComponent } from './sensors/sensors.component';
import { LiveEventsComponent } from './live-events/live-events.component';
import { SimCardsComponent } from './sim-cards/sim-cards.component';
import { DeviceHealthComponent } from './device-health/device-health.component';
import { HelpdeskrequestComponent } from './support/helpdeskrequest/helpdeskrequest.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NvrComponent } from './nvr/nvr.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'login', data: {routeName: "login"},  component: LoginComponent},
    { path: 'login', data: {routeName: "login"},  component: SigninComponent},
  // { path: 'guard', data: {routeName: "Gaurd"}, component: GaurdComponent, canActivate:[AuthGuard] },
  { path: 'guard', data: {routeName: "live"}, component: LiveViewComponent, canActivate:[AuthGuard] },
  { path: 'insight', data: {routeName: "insights"}, component: InsightComponent, canActivate:[AuthGuard] },
  { path: 'trends', data: {routeName: "insights"}, component: TrendsComponent, canActivate:[AuthGuard] },
  // { path: 'research', data: {routeName: "research"}, component: ResearchComponent, canActivate:[AuthGuard] },
  { path: 'alerts', data: {routeName: "alerts"}, component: IncidentsComponent, canActivate:[AuthGuard] },
  // { path: 'live-events', data: {routeName: "incident"}, component: LiveEventsComponent, canActivate:[AuthGuard] },
  { path: 'timelapse', data: {routeName: "timeLapse"}, component: TimelapseComponent, canActivate:[AuthGuard] },
  { path: 'advertisement', data: {routeName: "advertisements"}, component: AdvertisementsComponent, canActivate:[AuthGuard] },
  { path: 'sensors', data: {routeName: "sensors"}, component: SensorsComponent, canActivate:[AuthGuard] },
  { path: 'support', data: {routeName: ""},  component: HelpdeskrequestComponent, canActivate:[AuthGuard] },
  // { path: 'services', data: {routeName: "services"},  component: ClientServicesComponent, canActivate:[AuthGuard] },
  { path: 'profile', data: {routeName: "profile"},  component: ProfileComponent, canActivate:[AuthGuard] },
  { path: 'admin', data: {routeName: "admin"},  component: AdminpanelComponent, canActivate:[AuthGuard] },
  { path: 'error', data: {routeName: "error"},  component: ErrorpageComponent},
  { path: 'sim-cards', data:{routeName:"simDetails"}, component:SimCardsComponent, canActivate:[AuthGuard]},
  { path: 'device-health', data:{routeName:"deviceHealth"}, component:DeviceHealthComponent, canActivate:[AuthGuard]},
  { path: 'user-profile', data: {routeName: ""}, component: UserProfileComponent, canActivate:[AuthGuard] },
  { path: 'nvr', data:{routeName:"nvr"}, component:NvrComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
