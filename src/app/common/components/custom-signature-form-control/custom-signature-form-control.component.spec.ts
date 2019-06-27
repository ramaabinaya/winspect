import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSignatureFormControlComponent } from './custom-signature-form-control.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ReportService } from '../../../shared/services/report.service';
class MockReportService {

}

describe('SignatureFieldComponent', () => {
  let component: CustomSignatureFormControlComponent;
  let fixture: ComponentFixture<CustomSignatureFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SignaturePadModule
      ],
      declarations: [ CustomSignatureFormControlComponent ],
      providers: [
        { provide: ReportService, useClass: MockReportService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSignatureFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
