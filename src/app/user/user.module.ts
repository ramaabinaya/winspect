import { NgModule } from '@angular/core';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserProfileViewComponent } from './components/user-profile-view/user-profile-view.component';
import { UsersComponent } from './components/users/users.component';
import { UserService } from './services/users.service';
import { UserStore } from './store/user/user.store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { CoreModule } from '../common/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangepasswordComponent } from '../user/components/changepassword/changepassword.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    StoreModule.forFeature('UserModule', { User: UserReducer }),
    EffectsModule.forFeature([UserEffects]),
    CoreModule,
    NgbModule,
    SharedModule
  ],
  declarations: [
    UsersComponent,
    AddUserComponent,
    UserProfileViewComponent,
    ChangepasswordComponent
  ],
  providers: [
    UserService,
    UserStore,
  ],
  exports: [],
})
export class UserModule { }
export {
  UsersComponent,
  UserProfileViewComponent,
  AddUserComponent
};
