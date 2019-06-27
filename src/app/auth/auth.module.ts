import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { LoginGuard } from './services/login-guard.service';
import { AdminGuard } from './services/admin-guard.service';
import { SigninComponent } from './components/signin/signin.component';
import { CoreModule } from '../common/core.module';
import { AutoLogoutService } from './services/autoLogout.service';
import { AccessGuard } from './services/AccessGuard.service';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [
    SigninComponent
  ],
  exports: [
  ],
  providers: [
    AuthGuard,
    AuthService,
    LoginGuard,
    AdminGuard,
    AutoLogoutService,
    AccessGuard
  ],
  entryComponents: []
})
export class AuthModule {

}
export {
  SigninComponent,
  AuthGuard,
  LoginGuard,
  AdminGuard,
  AccessGuard
};
