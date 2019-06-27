// Component which is used to add a new wind farm.
import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { SiteService } from '../../services/site.service';
import { FormCanDeactivate } from '../../services/formCanDeactivate-guard.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { CustomAsyncValidatorService } from '../../../shared/services/customAsyncValidator.service';
import { MatomoService } from '../../../common/services/matomo.service';
import { MatomoCategories } from '../../../common/enum/categories';
import { MatomoActions } from '../../../common/enum/actions';
/**
 * Component which is used to add a new wind farm.
 */
@Component({
  selector: 'app-add-wind-farm',
  templateUrl: './add-wind-farm.component.html',
  styleUrls: ['./add-wind-farm.component.css']
})
export class AddWindFarmComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  /**
   * Variable which is used to display a Success message dialog box when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to decide whether to display upload dialog box or not.
   */
  uploadDialog: boolean;
  /**
   * Variable which is used to define the wind farm details.
   */
  windFarmForm: FormGroup;
  /**
   * Variable which is used to subscribe or unsubscribe the wind farm details.
   */
  subscriptionObject = {};
  /**
   * Variable which is used to define the inputFile control.
   */
  @ViewChild('file') file: ElementRef;
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
   * Variable which is used to display the message like error, success etc.,
   */
  messages: any;
  /**
   * Variable which is used to set the title of the page in metric tool.
   */
  pageTitle = 'ADD WIND FARM';
  /**
   * Component constructor to inject the required services
   * @param siteService To get the windFarm details from the database.
   * @param authService To get current user details.
   * @param matomoService to perform metric operation on this component.
   */
  constructor(private siteService: SiteService,
    private authService: AuthService,
    private matomoService: MatomoService) {
    super();
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
    this.windFarmForm = new FormGroup({
      'name': new FormControl(null, [Validators.required],
        CustomAsyncValidatorService.asyncWindFarmValidator(this.siteService)),
      'country': new FormControl(null, [Validators.required, Validators.maxLength(2), Validators.pattern(/^[a-zA-Z]/)]),
      'state': new FormControl(null, [Validators.required, Validators.maxLength(2), Validators.pattern(/^[a-zA-Z]/)])
    });
    this.subscriptionObject['messages'] = this.authService.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      this.dialogBoxDetails.header = this.messages ? this.messages.HEADER_MESSAGE : null;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Method which is triggered when the button clicked in the dynamic forms.
   * And used to decide what action should happen on the particular button click.
   * @return {void}
   */
  addWindFarm() {
    const buttonName = 'Add Wind Farm';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Submit, buttonName);
    if (this.windFarmForm) {
      this.subscriptionObject['windSite'] = this.siteService.addWindFarm(this.windFarmForm.value).subscribe((data) => {
        if (data && data['success']) {
          this.dialogBoxDetails.content = this.messages.WINDFARM_SUCCESS;
          this.display = true;
          this.windFarmForm.reset();
        }
      }, (err) => {
        this.dialogBoxDetails.content = this.messages.DATA_FAILURE + err.error.error;
        this.display = true;
      });
    }
  }

  /**
   * Method which is used to log the button click in matomo metric tool.
   * @return {void}
   */
  importCSV() {
    const buttonName = 'Import as CSV';
    this.matomoService.addEvent(MatomoCategories.Form, MatomoActions.Click, buttonName);
  }
  /**
   * Method which is used to alert the user when they navigates to the page
   * without saving the current page data's.
   */
  canDeactivate(): boolean {
    return this.windFarmForm && !this.windFarmForm['dirty'];
  }
  /**
   * Method which is used to upload a csv file which contains wind farm details.
   * @param event triggered when the file upload is performed.
   */
  onFileUploaded(event) {
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
          that.subscriptionObject['addWindFarm'] = that.siteService.addMoreWindFarms(csvRecordsArray).subscribe((res) => {
            if (res['success']) {
              that.uploadDialog = false;
              that.dialogBoxDetails.content = that.messages.IMPORT_SUCCESS;
              that.display = true;
            }
          }, (err) => {
            that.dialogBoxDetails.content = that.messages.DATA_FAILURE + err.error.error;
            that.display = true;
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
