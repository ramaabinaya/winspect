import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AccordionModule, DropdownModule, CalendarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { MockSortingService } from '../../../inspection/components/report-template/report-template.component.spec';
import { SortingService } from '../../../shared/services/sorting.service';

export class MockSorting {
  selectedDetails = [];
}
describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AccordionModule,
        DropdownModule,
        CalendarModule,
        FormsModule
      ],
      declarations: [ FilterComponent ],
      providers: [
        { provide: SortingService, useClass: MockSorting }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
