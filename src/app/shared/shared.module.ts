import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReportService } from './services/report.service';
import { InspectionEffects } from './store/inspection/inspection.effects';
import { InspectionReducer } from './store/inspection/inspection.reducer';
import { InspectionService } from './services/inspection.service';
import { InspectionStore } from './store/inspection/inspection.store';
import { ReportStore } from './store/report/report.store';
import { ReportEffects } from './store/report/report.effects';
import { ReportReducer } from './store/report/report.reducer';
import { CommonReportDataService } from './services/common-report-data.service';
import { DynamicInspectionService } from './services/dynamicInspection.service';

import { SortingService } from './services/sorting.service';
import { GroupsReducer } from './store/groups/groups.reducer';
import { GroupsEffects } from './store/groups/groups.effects';
import { GroupsStore } from './store/groups/groups.store';
import { ResourceStore } from './store/resource/resource.store';
import { ResourceReducer } from './store/resource/resource.reducer';
import { ResourceEffects } from './store/resource/resource.effects';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { CommonModule } from '@angular/common';
import { CustomAsyncValidatorService } from './services/customAsyncValidator.service';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('SharedModule', {
      Inspection: InspectionReducer, Report: ReportReducer, Resource: ResourceReducer,
      Groups: GroupsReducer
    }),
    EffectsModule.forFeature([InspectionEffects, ReportEffects, ResourceEffects, GroupsEffects]),
    PaginatorModule
  ],
  declarations: [DialogBoxComponent, PaginatorComponent],
  providers: [
    CustomAsyncValidatorService,
    ReportService,
    InspectionService,
    InspectionStore,
    ReportStore,
    DynamicInspectionService,
    CommonReportDataService,
    SortingService,
    ResourceStore,
    GroupsStore],
  exports: [DialogBoxComponent, PaginatorComponent],
})
export class SharedModule { }
