// Component which is used to create the group of users.
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserStore } from '../../../user/store/user/user.store';
import { TitleCasePipe } from '@angular/common';
import { GroupsStore } from '../../../shared/store/groups/groups.store';
import { User } from '../../../user/model/user.model';
import { Groups } from '../../models/groups.models';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { Router } from '@angular/router';
import { SortingService } from '../../../shared/services/sorting.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * Component which is used to create the group of users.
 */
@Component({
  selector: 'app-create-groups',
  templateUrl: './create-groups.component.html',
  styleUrls: ['./create-groups.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class CreateGroupsComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to define the create group form.
   * @type {FormGroup}
   */
  createGroupForm: FormGroup;
  /**
   * Variable which is used to define the edit group form.
   * @type {FormGroup}
   */
  editGroupForm: FormGroup;
  /**
  * Variable which is used to subscribe or unsubscribe the user from the database.
  * @type {Subscription}
  */
  subscriptionObject = {};
  /**
   * Variable which is used to store the groups details.
   */
  groups: Groups[] = null;
  /**
   * Variable which is used to decide the existing members page or not.
   */
  profileView: boolean;
  /**
   * Variable which is used to define the technicians list.
   * @type {any[]}
   */
  technicians = [];
  /**
   * Variable which is used to define the selected groupId.
   */
  selectedGroup;
  /**
   * Variable which is used to define the all users.
   */
  users: User[];
  /**
   * Variable which is used to define the group name.
   */
  adminName: string;
  /**
   * Variable which is used to display the screen in admin mobile view.
   */
  mobileView: boolean;
  /**
   * Variable which is used to display contents on the mobile view top nav bar.
   */
  navbarDetails = {
    'leftIcon': '', 'leftheader': '', 'header': '', 'navMenu': 'Users',
    'rightIcon': '', 'rightheader': '', 'placeholder': '', 'searchbox': true
  };
  /**
   * Variable which is used to define type of sorting.
   */
  sortingDetails = [
    { 'label': 'Name', 'value': 'Name' },
  ];
  /**
   * Variable which is used define the currently selected group id.
   */
  groupId: number;
  /**
   * Variable which is used to store user search value.
   */
  searchedValue: string;
  /**
   * Variable which is used to store the groups details to refer it locally.
   */
  filteredReport = null;
  /**
   * Variable which is used to display search results exists or not.
   */
  resultNotExist: boolean;
  /**
   * Variable which is used to define the current row selected for the bottom sheet action implementation.
   */
  currentActionRow;
  /**
 * Variable which is used to define the currently selected row index.
 */
  bottomSheetIndex: number;
  /**
   * Variable which is used to define the bottom menu action.
   */
  bottomSheetDetails = [];
  /**
   * Variable which is used to refer the editgroup modal box.
   */
  @ViewChild('editgroup') editgroupModal;
  /**
   * Variable which is used to refer the info modal box.
   */
  @ViewChild('info') infoModal;
  /**
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to display a Success message dialog box when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to define the dialog box details.
   */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: []
  };
  /**
   * Variable which is used to define the selected technicianId for remove the member from group.
   */
  technicianId: number;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'GROUPS';
  /**
   * Component Constructor which is used to inject the required services.
   * @param modalService To made the dialog box display.
   * @param userStore To get and update the user details on the store.
   * @param titlecasePipe To display the username with the TitleCase.
   * @param groupsStore To get the group details from the database.
   * @param offlineStorageService To find the app running in devices or not.
   * @param matomoService to perform metric operation on this component.
   * @param router To navigate the user to the desired component.
   * @param sortService To sort the group name list.
   */
  constructor(private modalService: NgbModal,
    private userStore: UserStore,
    private titlecasePipe: TitleCasePipe,
    private groupsStore: GroupsStore,
    private offlineStorageService: OfflineStorageService,
    private matomoService: MatomoService,
    private router: Router,
    private sortService: SortingService,
    private authService: AuthService
  ) { }
  /**
    * Component OnInit life cycle hook.
    */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.createGroupForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null)
    });
    this.subscriptionObject['applicationMode'] = this.offlineStorageService.applicationMode.subscribe((value) => {
      this.mobileView = value;
      if (this.mobileView) {
        this.navbarDetails.header = 'User Groups';
        this.navbarDetails.leftIcon = 'assets/symbol-defs.svg#icon-chevron-left';
        this.navbarDetails.rightIcon = 'assets/symbol-defs.svg#icon-add';
        this.navbarDetails.placeholder = 'Search Groupname';
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['groups'] = this.groupsStore.groups.subscribe((res) => {
      if (res) {
        this.groups = res ? res : [];
        this.filteredReport = [];
        this.filteredReport = this.groups;
        if (this.selectedGroup && this.selectedGroup.id) {
          this.groupsMap(this.selectedGroup.id);
        }
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Get the userlist details in the userstore subscription.
    this.subscriptionObject['user'] = this.userStore.users.subscribe((user) => {
      if (user) {
        this.users = user ? user : [];
        const userCopy = user.filter((item) => {
          return (item && item.userRoleId === 1 && item.active === 1);
        }).map((item) => {
          const name = this.titlecasePipe.transform(item.firstName + ' ' + item.lastName);
          this.technicians.push({ name: name, id: item.id });
        });
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is used to display a model for create the group.
   * @param group local reference variable.
   */
  openGroupModel(group) {
    const buttonName = 'Create New Group';
    this.matomoService.addEvent(MatomoCategories.Page, MatomoActions.Click, buttonName);
    this.modalService.open(group, { centered: true });
  }
  /**
   * Method which is used to display a model for remove the group.
   * @param event Which is used for stopPropagation.
   * @param groupId Which is used to define the selected groupId.
   */
  openRemoveGroupModel(event, groupId) {
    const buttonName = 'Remove';
    this.matomoService.addEvent(MatomoCategories.List, MatomoActions.Delete, buttonName);
    if (!this.mobileView) {
      event.stopPropagation();
    }
    this.groupId = null;
    this.groupId = groupId;
    this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onRemoveGroup' }, { label: 'No' });
    this.dialogBoxDetails.content = this.messages.REMOVE_GROUP;
    this.display = true;
  }
  /**
   * Method which is used to display a model for display group member details.
   * @param event Which is used for stopPropagation.
   * @param info local reference variable.
   * @param group Which is used to define the selected group.
   */
  openInfoGroupModel(event, info, group) {

    if (!this.mobileView) {
      event.stopPropagation();
    }
    this.technicians.forEach((technician) => {
      technician.isMember = false;
    });
    this.selectedGroup = group;
    this.users.find((item) => {
      if (item.id === group.creatorId) {
        this.adminName = this.titlecasePipe.transform(item.firstName + ' ' + item.lastName);
        return true;
      }
    });
    this.profileView = true;
    this.groupsMap(group.id);
    this.modalService.open(info, { centered: true });
  }
  /**
   * Method which is used to display a model for edit group details.
   * @param event Which is used for stopPropagation.
   * @param i Which is used to define the selected groupId.
   * @param editgroup local reference variable.
   */
  openEditGroupModel(event, i: number, editgroup) {
    const buttonName = 'Edit';
    this.matomoService.addEvent(MatomoCategories.List, MatomoActions.Edit, buttonName);
    if (!this.mobileView) {
      event.stopPropagation();
    }
    let editGroup;
    this.groupId = i;
    this.groups.find((item) => {
      if (item.id === i) {
        editGroup = item;
        return true;
      }
    });
    this.editGroupForm = new FormGroup({
      'name': new FormControl(editGroup.name, Validators.required),
      'description': new FormControl(editGroup.description)
    });
    this.modalService.open(editgroup, { centered: true });
  }
  /**
   * Method which is used to display a model for remove group member.
   * @param removemember local reference variable.
   */
  openRemoveMemberModel(technicianId) {
    this.technicianId = technicianId;
    this.dialogBoxDetails.header = this.messages.HEADER_CONFIRMATION;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onRemoveMember' }, { label: 'No' });
    this.dialogBoxDetails.content = this.messages.REMOVE_MEMBER;
    this.display = true;
  }
  /**
   * Method which is used to create the new group.
   */
  onCreate() {
    const buttonName = 'Create';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Submit, buttonName);
    this.groupsStore.createGroup(this.createGroupForm.value);
    this.createGroupForm.reset();
  }
  /**
   * Method which is used to remove the group.
   */
  onRemoveGroup() {
    const buttonName = 'Yes';
    this.matomoService.addEvent(MatomoCategories.Dialog, MatomoActions.Yes, buttonName);
    this.groupsStore.removeGroup(this.groupId);
  }
  /**
   * Method which is used to edit the already created group.
   */
  onEditGroup() {
    const buttonName = 'Edit';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Submit, buttonName);
    this.groupsStore.editGroup(this.groupId, this.editGroupForm.value);
  }
  /**
   * Method which is used to add a new technician into group.
   * @param technicianId Which is define the technician id.
   */
  onAddToGroup(technicianId) {
    this.technicians.find((user) => {
      if (technicianId === user.id) {
        user.isMember = true;
        return true;
      }
    });
    this.groupsStore.addToGroup(this.selectedGroup.id, technicianId);
  }
  /**
   * Method which is used to remove the member from the group.
   * @param technicianId Which is define the selected technician id.
   */
  onRemoveMember() {
    this.technicians.find((user) => {
      if (this.technicianId === user.id) {
        user.isMember = false;
        return true;
      }
    });
    this.groupsStore.removeMember(this.selectedGroup.id, this.technicianId);
  }
  /**
   * Method whic is used to decide who will already exist in this group or not.
   * @param groupId Which is define the selected group id.
   */
  groupsMap(groupId) {
    this.groups.find(group => {
      if (group.id === groupId && group.groupMembers) {
        group.groupMembers.forEach((member) => {
          this.technicians.find((user) => {
            if (member.memberId === user.id) {
              user.isMember = true;
              return true;
            }
          });
        });
        return true;
      }
    });
  }
  /**
   *  Method which is used to sort the completed reports table.
   * @param key Variable which is used to select the sortService column of the table.
   */
  sortReport(key) {
    this.sortService.sortReport(this.groups, key);
  }
  /**
   * Method which is used to clear the search input.
   */
  onClear() {
    this.searchedValue = undefined;
    this.resultNotExist = false;
    this.filteredReport = this.groups;
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
      this.filteredReport = this.groups;
    } else {
      this.filteredReport = this.groups.filter((group) => {
        return (group['name'] && group['name'].toLocaleLowerCase().indexOf(this.searchedValue.toLowerCase()) !== -1);
      });
      if (this.filteredReport.length === 0) {
        this.resultNotExist = true;
      }
    }
  }
  /**
   * Method which is used to navigate to the desired routes.
   */
  onNavigate() {
    this.router.navigate(['app/adduser']);
  }
  /**
   * Method which is used to display a model for open a bottom sheet
   * @param i local reference variable.
   */
  openBottomSheet(i) {
    this.bottomSheetIndex = i;
    this.bottomSheetDetails = ['Delete', 'Edit', 'Information'];
  }
  /**
   * Method which is used to display a model for close a bottom sheet
   * @param event local reference variable.
   */
  closeBottomSheet(event) {
    this.bottomSheetIndex = event;
  }
  /**
   * Method which is used to select the which action is triggered
   * @param event event {any} To define the event value.
   * @param inspection Which is define the currently selected row.
   */
  bottomSheetMenuAction(event, group) {
    this.currentActionRow = group;
    if (event === 'Delete') {
      this.openRemoveGroupModel(event, this.currentActionRow.id);
    } else if (event === 'Edit') {
      this.openEditGroupModel(event, this.currentActionRow.id, this.editgroupModal);
    } else if (event === 'Information') {
      this.openInfoGroupModel(event, this.infoModal, this.currentActionRow);
    }
  }
  /**
   * Method which is used to define which action is triggered.
   * @param event event {any} To define the event value.
   */
  dialogBoxAction(event) {
    this.display = false;
    this[event]();
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    const buttonName = 'No';
    this.matomoService.addEvent(MatomoCategories.Dialog, MatomoActions.No, buttonName);
    this.display = event;
    this.dialogBoxDetails.action = [];
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
