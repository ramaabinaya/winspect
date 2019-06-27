// Component which is used to create new resources
import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { DynamicInspectionService } from '../../../shared/services/dynamicInspection.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourceStore } from '../../../shared/store/resource/resource.store';
import * as _ from 'lodash';
import { Resource } from '../../models/create-resources-model';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortingService } from '../../../shared/services/sorting.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
/**
 * Create Resource component, is used to create new resources.
 */
@Component({
  selector: 'app-create-resources',
  templateUrl: './create-resources.component.html',
  styleUrls: ['./create-resources.component.css']
})
export class CreateResourcesComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to refers the resourceTable.
   */
  @ViewChild('resourceTableRef') resourceTable;
  /**
   * Variable which is used to decide the new resource created or not.
   */
  resourceCreated: boolean;
  /**
   * Variable which is used to decide whether to display upload dialog box or not.
   */
  uploadDialog: boolean;
  /**
   * Variable which is used to get the current user information.
   * @type {User}
   */
  display: boolean;
  /**
   * Variable which is used to define the optionGroupId.
   */
  optionGroupId: number;
  /**
   * Variable which is used to define the current selected resource.
   */
  selectedResource = null;
  /**
   * Variable which is used to define the current selected resource.
   */
  optionSelected;
  /**
   * Variable which is used as a reference to store the resource details.
   */
  resources: Resource[];
  /**
   * Variable which is used to sort table columns in ascending descending order.
   */
  cols = [
    { 'field': 'optionGroupName', 'header': 'optionGroupName' },
    { 'field': 'modified', 'header': 'modified' }
  ];
  /**
   * Variable which is used to subscribe or unsubscribe the resource details.
   */
  subscriptionObject = {};
  /**
   * Variable which is used to display the screen in admin mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Templates',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Resource Name', 'value': 'optionGroupName' },
  ];
  /**
   * Variable which is used to store the groups details to refer it locally.
   */
  filteredReport = null;
  /**
   * Variable which is used to display search results exists or not.
   */
  resultNotExist: boolean;
  /**
   * Variable which is used to store user search value.
   */
  searchedValue: string;
  /**
   * Variable which is used to define the resource name details.
   */
  createResourceForm: FormGroup;
  /**
   * Variable which is used to define the inputFile control.
   */
  @ViewChild('file') file: ElementRef;
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: [
      { label: 'Okay' }
    ]
  };
  /**
   * Component Constructor which is used to inject the required services.
   * @param dynamicInspectionService To store the resource details using CSV file.
   * @param resourceStore To get optionGroup and option choices from database.
   * @param offlineStorageService To find the app running in devices or not.
   * @param modalService To made the dialog box display.
   * @param sortService To sort the resource name list.
   * @param router To navigate the user to the desired routes
   * @param authService To get current user details.
   */
  constructor(private dynamicInspectionService: DynamicInspectionService,
    private resourceStore: ResourceStore,
    private offlineStorageService: OfflineStorageService,
    private modalService: NgbModal,
    private sortService: SortingService,
    private router: Router,
    private authService: AuthService) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'Resources';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
        this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-add';
        this.navbarDetails.placeholder = 'Search Resource';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      if (this.messages) {
        this.dialogBoxDetails.header = this.messages.HEADER_MESSAGE;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['resource'] = this.resourceStore.resources.subscribe((res) => {
      if (res) {
        this.resources = res ? _.cloneDeep(res) : [];
        this.filteredReport = [];
        this.filteredReport = this.resources;
        if (this.resources && this.resources[this.resources.length - 1]) {
          this.optionGroupId = this.resources[this.resources.length - 1].id;
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to display a model for create the group.
   * @param resource local reference variable.
   */
  openResourceModel(resource) {
    this.createResourceForm = new FormGroup({
      'optionGroupName': new FormControl(null, Validators.required),
    });
    this.modalService.open(resource, { centered: true });
  }
  /**
   * Method which is used to add the new resource.
   */
  onAddResource() {
    this.createResourceForm.value.isResource = 1;
    this.resourceStore.createOptionGroup(this.createResourceForm.value);
    this.resourceCreated = true;
  }
  /**
   * Method which is used to add the resource options from CSV File.
   * @param event {Event} Which have the form data that triggered when the button clicked.
   */
  onUploadFileData(event) {
    const input = event.target;
    const filename = event.target.files[0].name;
    const file = filename.split('.');
    if (file[1] === 'csv') {
      const that = this;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = function (e) {
        const target: any = e.target;
        const content: string = target.result;
        const csvRecordsArray = content.split(/\r\n|\n/);
        if (csvRecordsArray && csvRecordsArray.length > 0) {
          // tslint:disable-next-line:max-line-length
          that.subscriptionObject['addOptionChoices'] = that.dynamicInspectionService.addMoreOptionChoices(csvRecordsArray).subscribe((res) => {
            if (res && res['optionChoices']) {
              that.resourceStore.addMoreOptionChoices(res['optionChoices']);
              that.uploadDialog = false;
              that.dialogBoxDetails.content = that.messages.IMPORT_SUCCESS;
              that.resourceCreated = false;
              that.display = true;
            }
          }, (err) => {
            that.dialogBoxDetails.content = that.messages.DATA_FAILURE;
            that.display = true;
            that.resourceCreated = false;
          });
        }
      };
    } else {
      this.dialogBoxDetails.content = this.messages.INVALID_FILE;
      this.display = true;
    }
    this.file.nativeElement.value = '';
  }
  /**
   * Method Which is used search reports in global.
   * @param event {any} To get the values entered in the search box.
   */
  filterGlobal(event) {
    this.resourceTable.filter(event, 'global', 'contains');
  }
  /**
   * Method which is used to display the selected resource options list.
   * @param resourceSelected Which is used to define the selected resource data.
   */
  showResourceData(resourceSelected) {
    this.selectedResource = resourceSelected;
  }
  /**
   * Method which is used to edit the selected resource option choices.
   * @param option Which is define the selected options.
   */
  onEdit(option) {
    this.optionSelected = option;
    if (this.optionSelected) {
      this.optionSelected.isEdited = true;
    }
  }
  /**
   * Method which is used for update the options.
   */
  updateOptions() {
    const editedOptions = [];
    const newOptions = [];
    const deletedOptions = [];
    this.selectedResource.optionChoices.forEach((option) => {
      if (option && option.isEdited === false) {
        editedOptions.push(option);
      } else if (option && option.isNew === false) {
        newOptions.push(option);
      } else if (option && option.isDeleted === true) {
        deletedOptions.push(option);
      }
    });
    if (this.selectedResource && this.selectedResource.editedName) {
      const optionGroup = {
        id: this.selectedResource.id,
        optionGroupName: this.selectedResource.optionGroupName,
        isResource: this.selectedResource.isResource
      };
      this.resourceStore.editOptionGroup(optionGroup);
    }
    if (editedOptions && editedOptions.length > 0) {
      this.resourceStore.editOptionChoices(editedOptions);
    }
    if (newOptions && newOptions.length > 0) {
      this.resourceStore.createOptionChoices(newOptions);
    }
    if (deletedOptions && deletedOptions.length > 0) {
      const optionChoiceId = [];
      deletedOptions.forEach((item, index) => {
        optionChoiceId.push(deletedOptions[index].id);
      });
      if (optionChoiceId && optionChoiceId.length > 0) {
        this.resourceStore.deleteOptionChoices(optionChoiceId, this.selectedResource.id);
      }
    }
    this.selectedResource = null;
    this.optionSelected = null;
  }
  /**
   * Method which is used to delete the selected resource option.
   * @param optionSelected Which is define the selected options.
   */
  onDeleteClicked(optionSelected) {
    optionSelected.optionChoiceName = null;
    optionSelected.isDeleted = true;
  }
  /**
   * Method which is used to delete the existing option group.
   * @param event {Event} Which have the form data that triggered when the button clicked.
   * @param selectedResourceId Which is used to define the selected resource Id.
   */
  deleteOptionGroup(event: Event, selectedResourceId) {
    event.stopPropagation();
    this.subscriptionObject['delete'] = this.dynamicInspectionService.deleteOptionGroup(selectedResourceId).subscribe((res) => {
      if (res['optionGroups']) {
        this.resourceStore.deleteOptionGroup(selectedResourceId);
      }
    }, (err) => {
      if (err.error && err.error.error) {
        this.dialogBoxDetails.content = err.error.error;
        this.display = true;
      }
    });
  }
  /**
   * Method which is used for both edit and add new options.
   * @param editedName Which is define the edited name.
   * @param option Which is define the selected option choice.
   */
  assignEditedName(editedName, option) {
    option.optionChoiceName = editedName.value;
    option.optionChoicesValue = option.optionChoiceName;
    option.optionGroupId = this.selectedResource.id;
    this.optionSelected = null;
  }
  /**
   * Method which is used to close the edited dialog box.
   * @param index Which is define the Index value.
   */
  onClose(index) {
    this.selectedResource.optionChoices.splice(index);
  }
  /**
   * Method which is used to add new option.
   */
  addNewOptions() {
    this.selectedResource.optionChoices.push({
      isNew: true,
      optionChoiceName: ''
    });
  }
  /**
   * Method which is used to edit the resource name.
   */
  editGroupName() {
    this.optionSelected = null;
    if (this.selectedResource.optionGroupName !== this.selectedResource.editedName) {
      this.selectedResource.optionGroupName = this.selectedResource.editedName;
    } else {
      this.selectedResource.editedName = null;
    }
  }
  /**
   * Method which is used to display the text for edit the resource name.
   */
  displayTextForEdit() {
    this.optionSelected = this.selectedResource;
    this.selectedResource.editedName = this.selectedResource.optionGroupName;
  }
  /**
   *  Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.filteredReport, key);
  }
  /**
   * Method which is used to clear the search input.
   */
  onClear() {
    this.searchedValue = undefined;
    this.resultNotExist = false;
    this.filteredReport = this.resources;
  }
  /**
   * Method which is used to search the report, related to the value entered in the searchbox.
   * @param event {any} To get the values entered in the search box.
   */
  searchValue(event) {
    this.searchedValue = event;
    this.filteredReport = [];
    this.resultNotExist = false;
    if (this.searchedValue === undefined) {
      this.filteredReport = this.resources;
    } else {
      this.filteredReport = this.resources.filter((resource) => {
        return (resource['optionGroupName'] && resource['optionGroupName'].toLowerCase().indexOf(this.searchedValue.toLowerCase()) !== -1);
      });
      if (this.filteredReport.length === 0) {
        this.resultNotExist = true;
      }
    }
  }
  /**
   * Method which is used to navigate the user to the desired routes.
   */
  onNavigate() {
    this.router.navigate(['/app/inspection/reporttemplate']);
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
  }
  /**
   * Component OnDestroy life cycle hook
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
