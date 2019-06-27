// Component which is used to create signature pad
import {
  Component, OnInit, ViewChild, Input, forwardRef, OnDestroy, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OfflineStorageService } from './../../services/offlineStorage.service';
import { environment } from '../../../../environments/environment';
import { ReportService } from '../../../shared/services/report.service';
/**
 * Comoponent which is used to create the custom form control for dynamic-signature-form-control.
 */
@Component({
  selector: 'app-custom-signature-form-control',
  templateUrl: './custom-signature-form-control.component.html',
  styleUrls: ['./custom-signature-form-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSignatureFormControlComponent),
      multi: true
    }
  ]
})
/**
 * Custom Signature Form Control Component
 * is used to create a signature pad control and manages all operations in it.
 */
export class CustomSignatureFormControlComponent implements OnInit, ControlValueAccessor, OnDestroy, AfterViewInit {
  /**
   * Variable which is used to define the id of the time picker control.
   */
  @Input() id;
  /**
   * Variable which is used to define the report id from the parent component,
   * @type {number}
   */
  @Input() editId: number;
  /**
   * Variable which is used to define the dynamic field name from the parent component.
   * @type {any}
   */
  @Input() question: any;
  /**
  * Variable which is used to emit the selected option value to the parant component.
  * @type {any}
  */
  @Output() change: EventEmitter<any> = new EventEmitter();
  /**
   * Variable which is used to define the image data from the parent component,
   */
  @Input() imageData;
  /**
   * Variable which is used to define the SignaturePadControllComponent of the SignaturePad.
   */
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  /**
   * Variable which is used to define the option of signature pad.
   */
  signaturePadOptions = {
    'minWidth': 2,
    'canvasWidth': 540,
    'canvasHeight': 100
  };
  /**
  * Variable which is used to define the image url.
  */
  imageUrlDb = environment.imageUrlDb;
  /**
   * Variable which is used to subscribe or unsubscribe the reports from the database.
   * @type {Subscription}
   */
  subscriptionObject = {};
  /**
   * Variable which is used to check whether the network is Available.
   */
  networkIsAvailable;
  /**
   * Constructor which is used to inject the required services.
   */
  constructor(private offlinestorage: OfflineStorageService, private reportService: ReportService) { }
  /**
   * Component OnInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['networkStatus'] = this.offlinestorage.networkDisconnected.subscribe((value) => {
      this.networkIsAvailable = !value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
  }
  /**
   * Component AferViewInit lifecycle hook, Called after the view has been initialised.
   * And here we clear the display of the signature pad.
   */
  ngAfterViewInit() {
    if (this.imageData && this.signaturePad) {
      this.reportService.convertImageToBase64String(this.imageData.imageLocation).subscribe((res) => {
        if (res && res['blobObject']) {
          this.signaturePad.fromDataURL(res['blobObject']);
        }
      }, (err) => {
        if (err.error && err.error.error) {
          console.log('Error: ', err.error.error);
        }
      });
    }
    // this.signaturePad.clear();
  }

  /**
   * Method which is used to complete the draw in signaturePad.
   */
  drawComplete() {
    if (this.networkIsAvailable) {
      const base64 = this.signaturePad.toDataURL('image/png', 0.5);
      this.compressImage(base64).then((thumnailImg) => {
        let imgData;
        if (this.imageData) {
          imgData = {
            id: this.imageData.id,
            imageUrl: this.imageData.imageLocation,
            thumnailImgUrl: this.imageData.thumnailImage,
            imageLocation: base64,
            thumnailImage: thumnailImg,
            imgId: 0,
            mode: 'R',
            sectionName: 'signature'
          };
        } else {
          imgData = {
            imageLocation: base64,
            thumnailImage: thumnailImg,
            imgId: 0,
            mode: 'I',
            sectionName: 'signature'
          };
        }
        const data = { image: imgData };
        this.change.emit(imgData);
        this.propagateChange(imgData);
      });
    }
  }
  compressImage(content): Promise<any> {
    const imgData = new Image();
    imgData.src = content;
    return new Promise((resolve, reject) => {
      imgData.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 80;
        canvas.height = 80;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgData, 0, 0, canvas.width, canvas.height);
        const thumnailImg = canvas.toDataURL('image/jpeg');
        resolve(thumnailImg);
      };
    });
  }
  /**
   * Method which is used to for start the draw on signaturePad.
   */
  drawStart() {
    if (!this.networkIsAvailable) {
      alert('Cannot put signature in offline!');
    }
  }
  /**
   * Method which is used to convert the base64 data to blob data.
   * @param base64 Which is define the base64 data.
   */
  base64toBlob(base64) {
    const bytestring = atob(base64.split(',')[1].split(':')[0]);
  }
  /**
   * Callback which is implemented when the view changed.And call from registerOnChange method.
   */
  propagateChange = (_: any) => {
  }
  /**
   * Method which is used to change a value from form model into the DOM view.
   * @param value {any} To define the form-model value.
   */
  writeValue(value: any) {
    // if (value !== undefined && value !== null) {
    // this.value = value;
    // }
  }
  /**
   * Method which is implemented when the view changed.And call the callback function.
   * @param fn {any} To define the callback function.
   */
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  /**
   * Method which is implemented when the control receives touch event.
   */
  registerOnTouched() {

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
