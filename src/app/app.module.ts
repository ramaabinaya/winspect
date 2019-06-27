import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './common/core.module';
import { MobileModule } from './moblie/mobile.module';
import { ClientModule } from './client/client.module';
import { DynamicFormsCoreModule, Validator, ValidatorFactory, DYNAMIC_VALIDATORS } from '@ng-dynamic-forms/core';
import { DynamicFormsPrimeNGUIModule } from '@ng-dynamic-forms/ui-primeng';
import { customvalidator } from './app.validator';
import { NG_VALIDATORS } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './common/services/token.interceptor';
import { DynamicCustomFormControlComponent } from './common/components/dynamic-custom-form-control/dynamic-custom-form-control.component';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
// tslint:disable-next-line:max-line-length
import { DynamicCustomFieldFormControlComponent } from './common/components/dynamic-custom-field-form-control/dynamic-custom-field-form-control.component';
import { OfflineStorageService } from './common/services/offlineStorage.service';
import { MatomoService } from './common/services/matomo.service';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
// tslint:disable-next-line:max-line-length
import { DynamicSubcategoryFormControlComponent } from './common/components/dynamic-subcategory-form-control/dynamic-subcategory-form-control.component';
import { NgbModule } from '../../node_modules/@ng-bootstrap/ng-bootstrap';
// tslint:disable-next-line:max-line-length
import { DynamicCustomTimepickerControlComponent } from './common/components/dynamic-custom-timepicker-control/dynamic-custom-timepicker-control.component';
// tslint:disable-next-line:max-line-length
import { DynamicSignatureFormControlComponent } from './common/components/dynamic-signature-form-control/dynamic-signature-form-control.component';
import { rootReducer, metaReducers } from './data-reset.reducer';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    UserModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsPrimeNGUIModule,
    // StoreModule.forRoot({
    // dataResetReducer
    // }),
    StoreModule.forRoot(rootReducer, { metaReducers }),
    EffectsModule.forRoot([
    ]),
    AuthModule,
    CoreModule,
    MobileModule,
    ClientModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: TokenInterceptor,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useValue: customvalidator,
      multi: true
    },
    {
      provide: DYNAMIC_VALIDATORS,
      useValue: new Map<string, Validator | ValidatorFactory>([
        ['customvalidator', customvalidator]
      ])
    },
    Network,
    MatomoService,
    OfflineStorageService,
    File,
    DocumentViewer,
    SpinnerDialog,
    SQLite
  ],
  exports: [],
  entryComponents: [
    DynamicCustomFormControlComponent,
    DynamicCustomFieldFormControlComponent,
    DynamicCustomTimepickerControlComponent,
    DynamicSubcategoryFormControlComponent,
    DynamicSignatureFormControlComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
