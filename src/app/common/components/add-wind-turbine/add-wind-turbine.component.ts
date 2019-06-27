// Add new Wind Turbine Component which is used to add new wind turbines.
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormCanDeactivate } from '../../services/formCanDeactivate-guard.service';
import { SiteService } from '../../services/site.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
/**
 * Component which is used to add a new wind turbines.
 */
@Component({
  selector: 'app-add-wind-turbine',
  templateUrl: './add-wind-turbine.component.html',
  styleUrls: ['./add-wind-turbine.component.css']
})
// Component which is used to add new wind turbines.
export class AddWindTurbineComponent extends FormCanDeactivate implements OnInit, OnDestroy {
  /**
   * Variable which is used to display a Success message dialog box when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
  * Variable which is used to decide whether to display upload dialog box or not.
  * @type {boolean}
  */
  uploadDialog: boolean;
  /**
   * Variable which is used to define the wind turbine details.
   */
  windTurbineForm: FormGroup;
  /**
   * Variable which is used as a reference to store the wind farm details.
   */
  windFarms = [];
  /**
   * Variable which is used to subscribe or unsubscribe the wind farm details.
   */
  subscriptionObject = {};
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
   * Component constructor to inject the required services
   * @param siteService To get the windFarm details from the database.
   * @param authService To get current user details.
   */
  constructor(private siteService: SiteService,
    private authService: AuthService) {
    super();
  }
  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    this.subscriptionObject['windSite'] = this.siteService.getAllWindFarms().subscribe((response) => {
      if (response && response['windFarms']) {
        this.windFarms = response['windFarms'];
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.windTurbineForm = new FormGroup({
      'latitude': new FormControl(null, [Validators.required]),
      'longitude': new FormControl(null, [Validators.required]),
      'windFarm': new FormControl(null, [Validators.required]),
      'buildYear': new FormControl(null, [Validators.required, Validators.min(1850), Validators.max(new Date().getFullYear())])
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
   */
  buttonClicked() {
    if (this.windTurbineForm) {
      this.subscriptionObject['windTurbine'] = this.siteService.addWindTurbine(this.windTurbineForm.value).subscribe((data) => {
        if (data && data['success']) {
          this.dialogBoxDetails.content = this.messages.WINDTURBINE_SUCCESS;
          this.display = true;
          this.windTurbineForm.reset();
        }
      }, (err) => {
        this.dialogBoxDetails.content = this.messages.DATA_FAILURE + err.error.error;
        this.display = true;
      });
    }
  }
  /**
   * Method which is used to alert the user when they navigates to the page
   * without saving the current page data's.
   */
  canDeactivate(): boolean {
    console.log('add wind turbine candeactivate');
    return this.windTurbineForm && !this.windTurbineForm.dirty;
  }
  /**
   * Method which is used to upload a csv file which contains wind turbine details.
   * @param event triggered when the file upload is performed.
   */
  onUploadFileData(event) {
    let input;
    let filename;
    if (event && event.target) {
      input = event.target;
      filename = event.target.files[0].name;
    }
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
          that.subscriptionObject['addWindTurbine'] = that.siteService.addMoreWindTurbines(csvRecordsArray).subscribe((res) => {
            if (res['windTurbine']) {
              that.uploadDialog = false;
              that.display = true;
              that.dialogBoxDetails.content = that.messages.IMPORT_SUCCESS;
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
