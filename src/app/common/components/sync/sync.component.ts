// Sync Component which is used to display the sync progress bar.
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { OnDestroy } from '@angular/core';
/**
* Variable which is used to define the window screen.
* @type {any}
*/
declare let window: any;
/**
 * Component which is used to display the Sync progress bar in mobile view.
 */
@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Variable which is used to refers the modal dialog box.
   */
  @ViewChild('sync') mySyncModal;
  /**
   * Variable which is used to subscribe and unsubscribe.
   * @type {Subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to display sync button when value is true.
   * @type {boolean}
  */
  isSyncAvailable: boolean;
  /**
   * Variable which is used to define the syncronization completed value.
   @type {number}
  */
  progress: number;
  /**
   * Variable which is used to refer the bootstrap modal dialog box.
   */
  modalReference = null;
  /**
   * Variable which is used to define the sync progress is complete or not.
   */
  isCompleted: boolean;
  /**
   * Constructor which is used to inject the required services.
   * @param modalService To made the dialog box display.
   * @param config customize default values of modals used by this component tree
   * @param offlineStoageService To get and store form details in offline.
   */
  constructor(private modalService: NgbModal,
    config: NgbModalConfig,
    private offlineStoageService: OfflineStorageService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  /**
   * Component onInit life cycle hook.
   */
  ngOnInit() {
    if (window && window.cordova) {
      // To get changed synchronized Percentage
      this.subscriptionObject['synced'] = this.offlineStoageService.changedsyncedPercentage.subscribe((value) => {
        this.progress = value;
        if (this.progress === 100) {
          setTimeout(() => {
            if (this.modalReference) {
              this.modalReference.close();
              this.isCompleted = true;
            }
            this.offlineStoageService.syncButtonPressed.emit(false);
            this.offlineStoageService.syncedPercentage = null;
          }, 1000);
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.onOpen(this.mySyncModal);
    }, 100);
  }
  /**
   * Method which is used to open the sync modal box.
   * @param sync local reference variable.
   */
  onOpen(sync) {
    this.modalReference = this.modalService.open(sync, { windowClass: 'modal-sync-holder' });
  }
  /**
  * Component ondestroy life cycle hook.
  * All subscriptions are unsubscribe here.
  */
  ngOnDestroy() {
    if (this.subscriptionObject) {
      for (const subscriptionProperty in this.subscriptionObject) {
        if (this.subscriptionObject[subscriptionProperty]) {
          this.subscriptionObject[subscriptionProperty].unsubscribe();
        }
      }
    }
  }
}
