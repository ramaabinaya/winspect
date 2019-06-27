import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionComponent } from './components/inspection/inspection.component';
// tslint:disable-next-line:max-line-length
import { TechSafetyInspectionComponent } from './components/tech-assigned-inspection/tech-assigned-mapview/tech-safety-inspection/tech-safety-inspection.component';
import { TechViewReportsComponent } from './components/tech-view-reports/tech-view-reports.component';
import { EditInspectionComponent } from './components/edit-inspection/edit-inspection.component';
import { TechReportsComponent } from './components/tech-reports/tech-reports.component';
import { TechAssignedInspectionComponent } from './components/tech-assigned-inspection/tech-assigned-inspection.component';
import { ListAllReportsComponent } from './components/list-all-reports/list-all-reports.component';
import { AssignSafetyInspectionComponent } from './components/inspection/assign-safety-inspection/assign-safety-inspection.component';
// tslint:disable-next-line:max-line-length
import { ThumbnailImageViewComponent } from './components/thumbnail-image-view/thumbnail-image-view.component';
import { ReportTemplateComponent } from './components/report-template/report-template.component';
import { CanDeactivateGuard } from '../common/services/canDeactivate-guard.service';
import { TechAssignedMapviewComponent } from './components/tech-assigned-inspection/tech-assigned-mapview/tech-assigned-mapview.component';
import { CreateChildReportComponent } from './components/create-child-report/create-child-report.component';
import { CreateInspectionTemplateComponent } from './components/create-inspection-template/create-inspection-template.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ArchivedReportComponent } from './components/archived-report/archived-report.component';
import { ArchivedUsersComponent } from './components/archived-users/archived-users.component';

const inspection_routes: Routes = [
  {
    path: '', component: InspectionComponent, children: [
      { path: 'assign', component: AssignSafetyInspectionComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'assignedinspection', component: TechAssignedInspectionComponent },
      { path: ':assignedInspectionId/techmapview', component: TechAssignedMapviewComponent, canDeactivate: [CanDeactivateGuard] },
      { path: ':reportid/childreport', component: CreateChildReportComponent },
    ]
  },
  { path: 'createtemplate', component: CreateInspectionTemplateComponent },
  { path: ':inspectionId/createsection/:preview', component: CreateInspectionTemplateComponent, canDeactivate: [CanDeactivateGuard] },
  // { path: 'techsafetyinspection', component: TechSafetyInspectionComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'technicianreports', component: TechViewReportsComponent },
  {
    path: ':report_id/report/:archived', component: TechReportsComponent, children: [
      { path: ':sectionName/:imgId/image', component: ThumbnailImageViewComponent },
    ]
  },
  { path: 'reporttemplate', component: ReportTemplateComponent },
  { path: 'archived_template', component: ReportTemplateComponent },
  { path: 'edit_inspections', component: EditInspectionComponent },
  { path: ':inspectionId/:report_id/editinspection', component: TechSafetyInspectionComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'reports', component: ListAllReportsComponent },
  { path: 'archived_report', component: ArchivedReportComponent },
  { path: 'archived_user', component: ArchivedUsersComponent },
  { path: 'notification', component: NotificationComponent },
];


@NgModule({
  imports: [RouterModule.forChild(inspection_routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {

}
