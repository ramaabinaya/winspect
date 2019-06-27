// Sketch component, which is used to edit the images before upload with the sketch options.
import { Component, OnInit, Output, EventEmitter, ViewChild, Input, AfterViewInit } from '@angular/core';
import { CanvasWhiteboardOptions, CanvasWhiteboardUpdate, CanvasWhiteboardComponent } from 'ng2-canvas-whiteboard';
/**
 * variable which is used to define the window screen
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to edit the uploaded images with the paint options.
 */
@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css']
})
export class SketchComponent implements OnInit, AfterViewInit {
  /**
   * Variable which is used to get the imageData from the parent component as input.
   */
  @Input() imageToEdit: any;
  /**
   * Variable which is used to emit the edited image data to the parent component.
   */
  @Output() imageEdited = new EventEmitter<any>();
  /**
   * Variable which is used to refer the canvas whiteboard from the html element.
   */
  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;
  /**
   * Variable which is used to calculate the width of the canvas responsive to the device.
   */
  displayableWidth: number;
  /**
    * Component constructor used to inject the required services and stores.
    * And here we calculated the canvas width corresponding to the screenwidth of the device.
    */
  constructor() {
    const screenWidth = window.screen.width;
    this.displayableWidth = screenWidth;
  }
  /**
   * Variable which is used to gave the user defined options to the canvaswhiteboard.
   */
  canvasOptions: CanvasWhiteboardOptions = {
    drawButtonEnabled: true,
    drawButtonClass: 'drawButtonClass',
    drawButtonText: 'Draw',
    clearButtonEnabled: true,
    clearButtonClass: 'clearButtonClass',
    clearButtonText: 'Clear',
    // undoButtonText: 'Undo',
    undoButtonEnabled: false,
    shouldDownloadDrawing: false,
    // redoButtonText: 'Redo',
    redoButtonEnabled: false,
    colorPickerEnabled: true,
    saveDataButtonEnabled: true,
    saveDataButtonText: 'Save',
    lineWidth: 2,
    aspectRatio: 0.5,
    imageUrl: this.imageToEdit,
    strokeColor: 'rgba(208,255,20,1)',
    scaleFactor: 0.7
  };
  /**
   * Component OnInit lifecycle hook.
   */
  ngOnInit() {
  }
  /**
   * Component AferViewInit lifecycle hook, Called after the view has been initialised.
   * And here we adjust the display of the image corresponding to the canvas.
   */
  ngAfterViewInit() {
    const obj = this.canvasWhiteboard.canvas.nativeElement.imageElement;
    console.log('w&h calc', obj);
    setTimeout(() => {
      this.resizeCanvas();
    }, 300);
  }
  /**
   * The method which is used to capture the onSave event and save the edited image in the
   * required format. The edited image saved as an base64 string here..
   */
  onCanvasSave(event) {
    const generatedString = this.canvasWhiteboard.generateCanvasDataUrl('image/jpeg', 0.99);
    this.imageEdited.emit(generatedString);
  }
  /**
   * The method which is used to capture the onBatchUpdate event and update the
   * changes in the canvas regularly.
   * @param updates {CanvasWhiteboardUpdate} Hold the updates with the provided canvasOptions.
   */
  sendBatchUpdate(updates: CanvasWhiteboardUpdate[]) {
    console.log(updates);
  }
  /**
   * Method which is used to capture the onClear event and clear the canvas,
   * emits an UUID (string) for the continuous shape redrawn.
   */
  onCanvasClear() {
    this.resizeCanvas();
  }
  /**
   * Method which is used to capture every draw events in the canvas.
   */
  onCanvasDraw(event) {
    console.log('drawn');
  }

  /**
   * Method which is used to capture the event of imageloaded in the canvas, imageLoaded was emited
   * while the image loaded properly in the canvas with the imageurl or with the base64 string.
   * @param event emits the value of true or false.
   */
  onCanvasImageLoaded(event) {
    console.log('image loaded', event);
  }
  /**
   * Method whish is used to resize the image in the canvas
   * responsive to that canvas whiteboard and device screen.
   * And also emit the image data after the image edition was done.
   */
  resizeCanvas() {
    const element = document.createElement('img');
    this.canvasWhiteboard.context.canvas.width = this.displayableWidth;
    this.canvasWhiteboard.context.canvas.height = 420;
    const width = this.canvasWhiteboard.context.canvas.width;
    const height = this.canvasWhiteboard.context.canvas.height;
    if (this.imageToEdit) {
      element.setAttribute('src', this.imageToEdit);
    }
    this.canvasWhiteboard.context.drawImage(element, 0, 0, width, height);
  }

}
