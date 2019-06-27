import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TableModule} from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CreateResourcesComponent } from './create-resources.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { ResourceStore } from '../../../shared/store/resource/resource.store';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


class MockDynamicInspectionService {
  addMoreOptionChoices() {}
  deleteOptionChoices() {}

}

class MockResourceStore {
  createOptionGroup() {}
  createOptionChoices() {}
  editOptionGroup() {}
  editOptionChoices() {}
  deleteOptionGroup() {}
  resources: Observable<any[]> = Observable.of([]);

}
describe('CreateResourcesComponent', () => {
  let component: CreateResourcesComponent;
  let fixture: ComponentFixture<CreateResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FormsModule,
        TableModule,
        DialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule],
      declarations: [ CreateResourcesComponent ],
      providers:[
        {provide: DynamicInspectionService, useClass: MockDynamicInspectionService},
        { provide: ResourceStore, useClass: MockResourceStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
