import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchComponent } from './sketch.component';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';

describe('SketchComponent', () => {
  let component: SketchComponent;
  let fixture: ComponentFixture<SketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
       CanvasWhiteboardModule
      ],
      declarations: [ SketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onCanvasSave', () => {
    component.onCanvasSave(event);
    expect(component.onCanvasSave).toBeDefined();
  });
  it('should call sendBatchUpdate', () => {
    const updates = [];
    component.sendBatchUpdate(updates);
    expect(component.sendBatchUpdate).toBeDefined();
  });
  it('should call onCanvasClear', () => {
    component.onCanvasClear();
    expect(component.onCanvasClear).toBeDefined();
  });
  it('should call onCanvasDraw', () => {
    component.onCanvasDraw(event);
    expect(component.onCanvasDraw).toBeDefined();
  });
  it('should call onCanvasImageLoaded', () => {
    component.onCanvasImageLoaded(event);
    expect(component.onCanvasImageLoaded).toBeDefined();
  });
  it('should call resizeCanvas', () => {
    component.resizeCanvas();
    expect(component.resizeCanvas).toBeDefined();
  });
});
