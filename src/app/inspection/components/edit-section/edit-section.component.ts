// EditSectionComponent which is used to edit the already created sections.
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { InspectionStore } from '../../../shared/store/inspection/inspection.store';
import { InspectionSection } from '../../model/inspectionSection.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
/**
 * Component which is used to edit,delete or add sections in inspection header.
 */
@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css']
})
export class EditSectionComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the inspectionHeaderId  from the parent component.
   * @type {number}
   */
  @Input() inspectionHeaderId: number;
  /**
   * Variable which is used to define the inspection sections list  from the parent component.
   */
  @Input() sectionList = [];
  /**
   * Variable which is used to define the selected section id  from the parent component.
   * @type {number}
   */
  @Input() activeSectionId: number;
  /**
   * Variable which is used to emit the selected section id to the parent component.
   * @type {number}
   */
  @Output() navigationButtonClicked = new EventEmitter<number>();
  /**
   * Variable which is used to check whether the edit button is clicked or not.
   * @type {boolean}
   */
  editMode: boolean;
  /**
   * Variable which is used to check whether the add button is clicked or not.
   * @type {boolean}
   */
  addMode: boolean;
  /**
   * Variable which is used to define the selected section id.
   * @type {number}
   */
  selectedSectionId: number;
  /**
   * Variable which is used to define the selected  section name.
   * @type {string}
   */
  selectedSectionName: string;
  /**
  * Variable which is used to define edit section template
  * @type {string}
  */
  @ViewChild('editSectionModal') editSecModal: any;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Sections',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': false
  };
  /**
  * Variable which is used to store the subscription and unsubscribe the stored subscriptions.
  * @type {subscription}
  */
  subscriptionObject = {};
  /**
  * Variable which is used to define the edit section container.
  */
  editSectionContainer: any;
  /**
    * Variable which is used to display the admin mobile view.
    */
  mobileView: boolean;
  /**
   * Component constructor which is used to inject the required services.
   * @param inspectionStore To get the inspectiondetails.
   */
  constructor(private inspectionStore: InspectionStore,
    private modalService: NgbModal,
    private offlineStorage: OfflineStorageService) { }
  /**
    * Component OnInit lifecycle hook.
    */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlineStorage.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.leftheader = 'Back';
        this.navbarDetails.header = 'Sections';
        this.navbarDetails.rightheader = 'Edit';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['focusMode'] = this.offlineStorage.focusMode.subscribe((focused) => {
      this.editSectionContainer = focused;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.offlineStorage.focusMode.next('EditSectionContainer');
  }
  /**
   * Method which is used to edit the sectionName of the selected section.
   */
  editSectionName() {
    this.inspectionStore.editSectionName(this.inspectionHeaderId, this.selectedSectionId, this.selectedSectionName);
  }
  /**
   * Method which is used to navigate to edit question details in section.
   */
  onBackButtonClicked() {
    this.offlineStorage.focusMode.next('BottomInputlistContainer');
    this.navigationButtonClicked.emit(this.activeSectionId);
  }
  /**
   * Method which is used to select section from sections list.
   * @param sectionId To define the selected inspection section id.
   * @param sectionName To define the selected section name.
   */
  onSectionSelected(sectionId: number, sectionName: string) {
    if (!this.editMode) {
      this.offlineStorage.focusMode.next('BottomInputlistContainer');
      this.navigationButtonClicked.emit(sectionId);
    } else {
      this.selectedSectionId = sectionId;
      this.selectedSectionName = sectionName;
      this.openEditSectionModal(this.editSecModal);
    }
  }
  /**
   * Method which is used to add new sections in the custom inspection headers.
   * @param sectionName {string} The name to be added.
   */
  addNewSection(sectionName: string) {
    const section = new InspectionSection(this.inspectionHeaderId, sectionName, '', 0);
    // To add the sections for the newly created inspection header.
    this.inspectionStore.addInspectionSection(section);
    this.addMode = false;
  }
  /**
   * Method which is used to delete sections in the custom inspection headers.
   * @param event  Parameter defines the event that triggered when the section is deleted.
   * @param sectionId To define the selected inspection section id
   * @param index The index of the section.
   */
  deleteSection(event, sectionId: number, index: number) {
    event.stopPropagation();
    this.inspectionStore.deleteInspectionSection(sectionId);
    this.sectionList.splice(index, 1);
    if (sectionId === this.activeSectionId && index > 0) {
      this.activeSectionId = this.sectionList[index - 1].id;
    } else if (sectionId === this.activeSectionId && this.sectionList.length > 0) {
      this.activeSectionId = this.sectionList[index].id;
    }
  }
  /**
   * Method which is used to change the status of the Reports.
   * @param status local reference variable.
   */
  openAddNewSectionModal(addSectionModal) {
    this.modalService.open(addSectionModal, { centered: true });
  }
  /**
   * Method which is used to change the status of the Reports.
   * @param status local reference variable.
   */
  openEditSectionModal(editSectionModal) {
    this.modalService.open(editSectionModal, { centered: true });
  }
  /**
   * Method which is used to navigate to the desired routes.
   * @param key The key to decide whether the leftheaderClicked or the rightheaderClicked.
   */
  onEditMode(event) {
    if (event === 'Edit') {
      this.editMode = true;
      this.navbarDetails.rightheader = 'Done';
    } else if (event === 'Done') {
      this.editMode = false;
      this.navbarDetails.rightheader = 'Edit';
    }
  }
  /**
   * Component OnDestroy life cycle hook.
   * And the subscriptions done in the component's are unsubscribed.
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
