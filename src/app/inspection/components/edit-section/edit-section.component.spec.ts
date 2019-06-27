import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule } from '../../../../../node_modules/primeng/dialog';
import { EditSectionComponent } from './edit-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockInspectionStore {
  editSectionName() {}
}
describe('EditSectionComponent', () => {
  let component: EditSectionComponent;
  let fixture: ComponentFixture<EditSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [ EditSectionComponent ],
      providers: [
        { provide: InspectionStore, useClass: MockInspectionStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
