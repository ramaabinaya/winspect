import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Camera } from '@ionic-native/camera';
import { CameraComponent } from './camera.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { KeyUpListenerDirective } from '../../directives/keyUpListener.directive';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-sketch',
  template: 'app-sketch'
})
export class SketchComponent {
  @Input() imageToEdit: any;
}
export class MockOfflineStorageService {
  
  networkDisconnected = new BehaviorSubject<boolean>(false);
  
}
export class MockReportService {
  convertImageToBase64String() {
    return Observable.of({});
  }
}
describe('CameraComponent', () => {
  let component: CameraComponent;
  let fixture: ComponentFixture<CameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DialogModule,
        BrowserAnimationsModule
      ],
      declarations: [ CameraComponent,
        SketchComponent, SafePipe, KeyUpListenerDirective ],
        providers: [
          { provide: Camera,useClass: Camera },
          { provide: OfflineStorageService, useClass: MockOfflineStorageService },
          { provide: ReportService, useClass: MockReportService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call openCamera', () => {
    component.openCamera();
    expect(component.openCamera).toBeDefined();
  });
  it('should call openCamera', () => {
    component.onSave();
    expect(component.onSave).toBeDefined();
  });
  it('should call fileSelected', () => {
    component.fileSelected(event);
    expect(component.fileSelected).toBeDefined();
  });
  it('should call openGallery', () => {
    component.openGallery();
    expect(component.openGallery).toBeDefined();
  });
  it('should call onClose', () => {
    component.onClose();
    expect(component.onClose).toBeDefined();
  });
  it('should call onAddCaption', () => {
    component.onAddCaption();
    expect(component.onAddCaption).toBeDefined();
  });
  it('should call onDeleteClicked', () => {
    const index = 1;
    const imgId = 12;
    component.onDeleteClicked(index,imgId);
    expect(component.onDeleteClicked).toBeDefined();
  });
  it('should call findImageId', () => {
    component.findImageId();
    expect(component.findImageId).toBeDefined();
  });
  it('should call onImageEditWithPaint', () => {
    const sectionId = 9;
    const imgIndex = 1;
    component.onImageEditWithPaint(sectionId, imgIndex);
    expect(component.onImageEditWithPaint).toBeDefined();
  });

  
});
