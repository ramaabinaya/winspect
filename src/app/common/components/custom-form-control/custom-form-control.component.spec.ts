import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormControlComponent } from './custom-form-control.component';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

describe('CustomFormControlComponent', () => {
  let component: CustomFormControlComponent;
  let fixture: ComponentFixture<CustomFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        CardModule],
      declarations: [ CustomFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
