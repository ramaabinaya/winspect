import { Component, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class DialogBoxComponent implements AfterViewInit {
  /**
   * Variable which is used to refers the modal dialog box.
   */
  @ViewChild('dialogbox') myModal;
  /**
   * Variable which is used to emit the clicked value to the parant component.
   */
  @Output() dialogBoxClosed = new EventEmitter<any>();
  /**
   * Variable which is used to emit the clicked value to the parant component.
   */
  @Output() dialogBoxEventEmitter = new EventEmitter<any>();
  /**
   * Variable which is used to define the bottomModalDetails in mobile view from the parent component.
   */
  @Input() dialogBoxDetails;
  /**
   * Component constructor to inject the required services.
   * @param modalService To made the dialog box display.
   * @param config customize default values of modals used by this component tree
   */
  constructor(private modalService: NgbModal,
    config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onOpen(this.myModal);
    }, 500);
  }
  /**
   * Method which is used to display a model for table row actions.
   * @param dialogbox local reference variable.
   */
  onOpen(dialogbox) {
    this.modalService.open(dialogbox, { centered: true, windowClass: 'common-dialog-box' });
  }
  /**
   * Method which is used to emit the button clicken event to the parent component
   * @param event {any} To define the event value.
   */
  onDialogBoxEvent(event?) {
    if (event) {
      this.dialogBoxEventEmitter.emit(event);
    }
    this.dialogBoxClosed.emit(undefined);
  }
}
