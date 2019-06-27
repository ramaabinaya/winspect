import { NgModule, Type } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/home/nav-bar/nav-bar.component';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatomoModule } from 'ngx-matomo';
import { GMapModule } from 'primeng/gmap';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { DynamicFormsCoreModule, DYNAMIC_FORM_CONTROL_MAP_FN, DynamicFormControlModel, DynamicFormControl } from '@ng-dynamic-forms/core';
import { DynamicFormsPrimeNGUIModule } from '@ng-dynamic-forms/ui-primeng';
import { SiteService } from './services/site.service';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicFormGroupService } from './services/dynamic-form-group.service';
import { HeaderService } from './services/header.service';
import { CanDeactivateGuard } from './services/canDeactivate-guard.service';
import { TokenInterceptor } from './services/token.interceptor';
import { CustomFormControlComponent } from './components/custom-form-control/custom-form-control.component';
import { DynamicCustomFormControlComponent } from './components/dynamic-custom-form-control/dynamic-custom-form-control.component';
import { DYNAMIC_FORM_CONTROL_TYPE_IMAGE } from './models/dynamic-image.model';
import { MobileModule } from '../moblie/mobile.module';
import { SectionWizardComponent } from './components/section-wizard/section-wizard.component';
import { CustomFieldFormControlComponent } from './components/custom-field-form-control/custom-field-form-control.component';
// tslint:disable-next-line:max-line-length
import { DynamicCustomFieldFormControlComponent } from './components/dynamic-custom-field-form-control/dynamic-custom-field-form-control.component';
import { DYNAMIC_FORM_CONTROL_TYPE_FIELD } from './models/dynamic-field-model';
import { ExportService } from '../inspection/services/export.service';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { Geolocation } from '@ionic-native/geolocation';
import { DropdownDirective } from './directives/dropdown.directive';
import { CollapsedDirective } from './directives/collapsible.directive';
// tslint:disable-next-line:max-line-length
import { CustomSubcategoryFormControlComponent } from './components/custom-subcategory-form-control/custom-subcategory-form-control.component';
import { DYNAMIC_FORM_CONTROL_TYPE_SUBCATEGORY } from './models/dynamic-subcategory.model';
// tslint:disable-next-line:max-line-length
import { DynamicSubcategoryFormControlComponent } from './components/dynamic-subcategory-form-control/dynamic-subcategory-form-control.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputControlDirective } from './directives/inputControl.directive';
import { HighlightSearch } from '../inspection/pipe/highlight.pipe';
import { AddWindFarmComponent } from './components/add-wind-farm/add-wind-farm.component';
import { AddWindTurbineComponent } from './components/add-wind-turbine/add-wind-turbine.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { CustomTimepickerControlComponent } from './components/custom-timepicker-control/custom-timepicker-control.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
// tslint:disable-next-line:max-line-length
import { DynamicCustomTimepickerControlComponent } from './components/dynamic-custom-timepicker-control/dynamic-custom-timepicker-control.component';
import { DYNAMIC_FORM_CONTROL_TYPE_CUSTOMTIMEPICKER } from './models/dynamic-timepicker.model';
import { ToastModule } from 'primeng/toast';
import { GrowlModule } from 'primeng/growl';
import { CreateResourcesComponent } from './components/create-resources/create-resources.component';
import { CustomSignatureFormControlComponent } from './components/custom-signature-form-control/custom-signature-form-control.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DynamicSignatureFormControlComponent } from './components/dynamic-signature-form-control/dynamic-signature-form-control.component';
import { DYNAMIC_FORM_CONTROL_TYPE_CUSTOMSIGNATURE } from './models/dynamic-signature.model';
import { CreateGroupsComponent } from './components/create-groups/create-groups.component';
import { GroupService } from './services/group.service';
import { DeviceInfoComponent } from './components/device-info/device-info.component';
import { HttpRoutingService } from './services/httpRouting.service';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { SyncComponent } from './components/sync/sync.component';
import { AutoHeightDirective } from './directives/autoheight.directive';
import { SharedModule } from '../shared/shared.module';
import { MenuService } from './services/menu.service';
@NgModule({
  imports: [
    MobileModule,
    ToastModule,
    FileUploadModule,
    GrowlModule,
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    MatomoModule,
    GMapModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    StepsModule,
    CardModule,
    RadioButtonModule,
    ConfirmDialogModule,
    InputTextareaModule,
    OverlayPanelModule,
    CalendarModule,
    TooltipModule,
    AutoCompleteModule,
    FormsModule,
    RouterModule,
    DynamicFormsCoreModule.forRoot(),
    DynamicFormsPrimeNGUIModule,
    TableModule,
    AccordionModule,
    CardModule,
    NgbModule,
    AmazingTimePickerModule,
    SignaturePadModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    NavBarComponent,
    MapViewComponent,
    HomePageComponent,
    DynamicFormComponent,
    CustomFormControlComponent,
    DynamicCustomFormControlComponent,
    SectionWizardComponent,
    CustomFieldFormControlComponent,
    DynamicCustomFieldFormControlComponent,
    DropdownDirective,
    CollapsedDirective,
    AutoHeightDirective,
    HighlightSearch,
    CustomSubcategoryFormControlComponent,
    DynamicSubcategoryFormControlComponent,
    InputControlDirective,
    AddWindFarmComponent,
    AddWindTurbineComponent,
    TopNavbarComponent,
    FilterComponent,
    CustomTimepickerControlComponent,
    DynamicCustomTimepickerControlComponent,
    CreateResourcesComponent,
    CustomSignatureFormControlComponent,
    DynamicSignatureFormControlComponent,
    CreateGroupsComponent,
    DeviceInfoComponent,
    SyncComponent,
    BottomSheetComponent,
  ],
  providers: [
    Geolocation,
    Base64ToGallery,
    TokenInterceptor,
    ConfirmationService,
    ExportService,
    SQLite,
    StatusBar,
    SiteService,
    HeaderService,
    CanDeactivateGuard,
    HttpRoutingService,
    TitleCasePipe,
    DatePipe,
    GroupService,
    MenuService,
    DynamicFormGroupService,
    {
      provide: DYNAMIC_FORM_CONTROL_MAP_FN,
      useValue: (model: DynamicFormControlModel): Type<DynamicFormControl> | null => {

        switch (model.type) {

          case DYNAMIC_FORM_CONTROL_TYPE_IMAGE:
            return DynamicCustomFormControlComponent;
          case DYNAMIC_FORM_CONTROL_TYPE_FIELD:
            return DynamicCustomFieldFormControlComponent;
          case DYNAMIC_FORM_CONTROL_TYPE_SUBCATEGORY:
            return DynamicSubcategoryFormControlComponent;
          case DYNAMIC_FORM_CONTROL_TYPE_CUSTOMTIMEPICKER:
            return DynamicCustomTimepickerControlComponent;
          case DYNAMIC_FORM_CONTROL_TYPE_CUSTOMSIGNATURE:
            return DynamicSignatureFormControlComponent;
        }
      }
    }
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatomoModule,
    GMapModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    StepsModule,
    CardModule,
    RadioButtonModule,
    ConfirmDialogModule,
    TableModule,
    InputTextareaModule,
    OverlayPanelModule,
    CalendarModule,
    TooltipModule,
    AutoCompleteModule,
    FormsModule,
    RouterModule,
    DynamicFormsCoreModule,
    DynamicFormsPrimeNGUIModule,
    DynamicFormComponent,
    SectionWizardComponent,
    DropdownDirective,
    CollapsedDirective,
    TableModule,
    AccordionModule,
    CardModule,
    HighlightSearch,
    TopNavbarComponent,
    InputControlDirective,
    AutoHeightDirective,
    FilterComponent,
    SyncComponent,
    BottomSheetComponent,
  ],
})
export class CoreModule { }
