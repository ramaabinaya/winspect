import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent, UserProfileViewComponent, AddUserComponent } from './user/user.module';
import { SigninComponent, LoginGuard, AuthGuard, AdminGuard } from './auth/auth.module';
import { HomeComponent } from './common/components/home/home.component';
import { ClientComponent } from './client/components/client/client.component';
import { HomePageComponent } from './common/components/home-page/home-page.component';
import { MapViewComponent } from './common/components/map-view/map-view.component';
import { CanDeactivateGuard } from './common/services/canDeactivate-guard.service';
import { AddWindFarmComponent } from './common/components/add-wind-farm/add-wind-farm.component';
import { AddWindTurbineComponent } from './common/components/add-wind-turbine/add-wind-turbine.component';
import { ChangepasswordComponent } from '../app/user/components/changepassword/changepassword.component';
import { CreateResourcesComponent } from './common/components/create-resources/create-resources.component';
import { CreateGroupsComponent } from './common/components/create-groups/create-groups.component';
import { DeviceInfoComponent } from './common/components/device-info/device-info.component';
import { AccessGuard } from './auth/services/AccessGuard.service';

const app_routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, canActivate: [LoginGuard] },
  {
    path: 'app', component: HomeComponent,
    canActivate: [AuthGuard], canActivateChild: [AccessGuard],
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'mapview', component: MapViewComponent },
      { path: 'client', component: ClientComponent },
      { path: 'users', component: UsersComponent },
      { path: 'profile', component: UserProfileViewComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
      { path: 'inspection', loadChildren: 'app/inspection/inspection.module#InspectionModule' },
      { path: 'adduser', component: AddUserComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'addwindfarm', component: AddWindFarmComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'addwindturbine', component: AddWindTurbineComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'addresource', component: CreateResourcesComponent },
      { path: 'groups', component: CreateGroupsComponent },
      { path: 'devices', component: DeviceInfoComponent }
    ]
  },
  {
    path: 'resetPassword', component: ChangepasswordComponent
  },
  {
    path: 'addcredentails/:token', component: ChangepasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(app_routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
