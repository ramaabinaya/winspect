// BottomSheet Component which is used to display the mobile view table row action details.
import { Component, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
/**
 * Component which is used to display the BottomSheet in mobile view.
 */
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  providers: [NgbModalConfig, NgbModal],
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements AfterViewInit {
  /**
   * Variable which is used to emit the clicked value to the parant component.
   */
  @Output() bottomSheetClosed = new EventEmitter<any>();
  /**
   * Variable which is used to emit the clicked value to the parant component.
   */
  @Output() bottomSheetEventEmitter = new EventEmitter<any>();
  /**
   * Variable which is used to define the bottomModalDetails in mobile view from the parent component.
   */
  @Input() bottomModalDetails;
  /**
   * Variable which is used to refers the modal dialog box.
   */
  @ViewChild('bottom') myModal;
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
    }, 1000);
  }
  /**
   * Method which is used to display a model for table row actions.
   * @param bottom local reference variable.
   */
  onOpen(bottom) {
    this.modalService.open(bottom, { windowClass: 'modal-holder' });
  }
  /**
   * Method which is used to close the model.
   * @param bottom local reference variable.
   */
  onClose() {
    this.bottomSheetClosed.emit(undefined);
  }
  /**
   * Method which is used to emit the button clicken event to the parent component
   * @param event {any} To define the event value.
   */
  onBottomSheetEvent(event) {
    this.bottomSheetEventEmitter.emit(event);
    this.bottomSheetClosed.emit(undefined);
  }
}
