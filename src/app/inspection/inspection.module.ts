import { NgModule } from '@angular/core';
import { InspectionComponent } from './components/inspection/inspection.component';
import { DatePipe } from '@angular/common';
import { ListAllReportsComponent } from './components/list-all-reports/list-all-reports.component';
import { TechAssignedInspectionComponent } from './components/tech-assigned-inspection/tech-assigned-inspection.component';
// tslint:disable-next-line:max-line-length
import { TechSafetyInspectionComponent } from './components/tech-assigned-inspection/tech-assigned-mapview/tech-safety-inspection/tech-safety-inspection.component';
import { TechAssignedMapviewComponent } from './components/tech-assigned-inspection/tech-assigned-mapview/tech-assigned-mapview.component';
import { TechViewReportsComponent } from './components/tech-view-reports/tech-view-reports.component';
import { TechReportsComponent } from './components/tech-reports/tech-reports.component';
// tslint:disable-next-line:max-line-length
import { EditInspectionComponent } from './components/edit-inspection/edit-inspection.component';
import { ArchivedReportComponent } from './components/archived-report/archived-report.component';
import { MobileModule } from '../moblie/mobile.module';
import { CoreModule } from '../common/core.module';
import { File } from '@ionic-native/file';
import { InspectionRoutingModule } from './inspection-routing.module';
import { DataService } from './services/data.service';
// tslint:disable-next-line:max-line-length
import { AssignSafetyInspectionComponent } from './components/inspection/assign-safety-inspection/assign-safety-inspection.component';
// tslint:disable-next-line:max-line-length
import { DragDropModule } from 'primeng/dragdrop';
import { ThumbnailImageViewComponent } from './components/thumbnail-image-view/thumbnail-image-view.component';
import { ReportTemplateComponent } from './components/report-template/report-template.component';
import { CreateChildReportComponent } from './components/create-child-report/create-child-report.component';
import { CreateInspectionTemplateComponent } from './components/create-inspection-template/create-inspection-template.component';
import { CustomInspectionTemplateComponent } from './components/custom-inspection-template/custom-inspection-template.component';
import { AccordionModule } from 'primeng/accordion';

import { GrowlModule, MultiSelectModule, CheckboxModule } from '../../../node_modules/primeng/primeng';
import { NgbModule } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './components/notification/notification.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { EditSectionComponent } from './components/edit-section/edit-section.component';
import { ArchivedUsersComponent } from './components/archived-users/archived-users.component';

@NgModule({
  imports: [
    CoreModule,
    CalendarModule,
    MobileModule,
    DragDropModule,
    AccordionModule,
    InspectionRoutingModule,
    NgbModule,
    InspectionRoutingModule,
    GrowlModule,
    SharedModule,
    MultiSelectModule,
    FileUploadModule,
    CheckboxModule
  ],
  declarations: [
    InspectionComponent,
    TechAssignedInspectionComponent,
    ListAllReportsComponent,
    AssignSafetyInspectionComponent,
    TechSafetyInspectionComponent,
    TechAssignedMapviewComponent,
    TechViewReportsComponent,
    TechReportsComponent,
    EditInspectionComponent,
    ArchivedReportComponent,
    ThumbnailImageViewComponent,
    ReportTemplateComponent,
    CreateChildReportComponent,
    CustomInspectionTemplateComponent,
    CreateInspectionTemplateComponent,
    NotificationComponent,
    EditSectionComponent,
    ArchivedUsersComponent
  ],
  providers: [DatePipe,
    File,
    DataService],
  exports: []

})

export class InspectionModule {

}

