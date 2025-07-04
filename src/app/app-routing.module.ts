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

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', data: {routeName: "Login"},  component: LoginComponent},
  // { path: 'guard', data: {routeName: "Gaurd"}, component: GaurdComponent, canActivate:[AuthGuard] },
  { path: 'guard', data: {routeName: "Gaurd"}, component: LiveViewComponent, canActivate:[AuthGuard] },
  { path: 'insight', data: {routeName: "Insight"}, component: InsightComponent, canActivate:[AuthGuard] },
  { path: 'trends', data: {routeName: "Trends"}, component: TrendsComponent, canActivate:[AuthGuard] },
  { path: 'research', data: {routeName: "Research"}, component: ResearchComponent, canActivate:[AuthGuard] },
  { path: 'alerts', data: {routeName: "Incident"}, component: IncidentsComponent, canActivate:[AuthGuard] },
  { path: 'live-events', data: {routeName: "Incident"}, component: LiveEventsComponent, canActivate:[AuthGuard] },
  { path: 'timelapse', data: {routeName: "Timelapse"}, component: TimelapseComponent, canActivate:[AuthGuard] },
  { path: 'advertisement', data: {routeName: "Advertisement"}, component: AdvertisementsComponent, canActivate:[AuthGuard] },
  { path: 'sensors', data: {routeName: "Gaurd"}, component: SensorsComponent, canActivate:[AuthGuard] },
  { path: 'support', data: {routeName: "Support"},  component: HelpdeskrequestComponent, canActivate:[AuthGuard] },
  { path: 'services', data: {routeName: "Services"},  component: ClientServicesComponent, canActivate:[AuthGuard] },
  { path: 'profile', data: {routeName: "Profile"},  component: ProfileComponent, canActivate:[AuthGuard] },
  { path: 'admin', data: {routeName: "Admin"},  component: AdminpanelComponent, canActivate:[AuthGuard] },
  { path: 'error', data: {routeName: "Error"},  component: ErrorpageComponent},
  { path: 'sim-cards', data:{routeName:"Sim-cards"}, component:SimCardsComponent, canActivate:[AuthGuard]},
  { path: 'device-health', data:{routeName:"Device-Health"}, component:DeviceHealthComponent, canActivate:[AuthGuard]},
  { path: 'user-profile', data: {routeName: "Gaurd"}, component: UserProfileComponent, canActivate:[AuthGuard] },
  { path: 'nvr', data:{routeName:"Device-Health"}, component:NvrComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
