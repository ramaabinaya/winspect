// CameraComponent is used to browse pictures from the gallery and take pictures using a camera.
import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { OfflineStorageService } from '../../../common/services/offlineStorage.service';
import * as _ from 'lodash';
import { ReportService } from '../../../shared/services/report.service';
import { AuthService } from '../../../auth/services/auth.service';

/**
 * window variable is to access the window related methods.
 */
declare var window: any;
/**
 * Component which is used to get picture from camera and gallery.
 */
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CameraComponent implements OnInit, OnDestroy {
  /**
   * Variable which is used to display dialogbox when value is true.
   * @type {boolean}
   */
  display: boolean;
  /**
   * Variable which is used to define the file variable of the template.
   * @type {ElementRef}
   */
  @ViewChild('file') file: ElementRef;
  /**
   * Variable which is used to define the selected section image data from parent component.
   * @type { any[] }
   */
  @Input() imgData: any;
  /**
   * Input Property which is used to define which option selected from parent component in openCamera and gallery.
   * @type { string }
   */
  @Input() option: string;
  /**
   * Input property which is used to define the sectionName of the image to which it uploaded.
   * @type { string }
   */
  @Input() sectionName: string;
  /**
   * Output property which is used to emit the captured image data to the parant component.
   * @type {string[]}
   */
  @Output() imageCapturedData = new EventEmitter<string[]>();
  /**
   * Variable which is used to display the preview of the image when value is true.
   * @type {boolean}
   */
  showPreview = false;
  /**
   * Variable which is used to check whether the application running in device or browser.
   * @type {boolean}
   */
  isDevice: boolean;
  /**
   * Variable which is used to define the image id.
   * @type {number}
   */
  imgId = -1;
  /**
   * Variable which is used to define the caption of the image.
   * @type {string}
   */
  caption: string;
  /**
   * Variable which is used to check whether the network is connected or not.
   * @type {boolean}
   */
  networkIsAvailable: boolean;
  /**
   * Variable which is used to display dialogbox when value is true.
   * @type {boolean}
   */
  displayMessage: boolean;
  /**
   * Variable which is used to define the seleted section id.
   * @type {boolean}
   */
  sectionId: number;
  /**
   * Variable which is used to unsubscribe the subscribed details.
   */
  subscriptionObject = {};
  /**
   * Variable which is used to display the paint options for the uploaded images.
   */
  imageToEdit = {
    enabled: false,
    imageData: '',
    sectionId: null,
    imageId: null
  };
  messages;
  /**
 * Variable which is used to define the dialog box details.
 */
  dialogBoxDetails = {
    header: '',
    content: '',
    action: []
  };

  /**
   * Component constructor to inject the required services.
   * @param camera To get the camera access.
   * @param offlineStorage To get network connection details.
   * @param reportService To convert imageurl to base64string.
   */
  constructor(private camera: Camera,
    private offlineStorage: OfflineStorageService,
    private reportService: ReportService,
    private auth: AuthService) { }

  /**
   * Component OnInit life cycle hook
   */
  ngOnInit() {
    console.log('image data in camera', this.imgData);
    this.subscriptionObject['messages'] = this.auth.errorMessages.subscribe((res) => {
      this.messages = res ? res : null;
      if (this.messages) {
        this.dialogBoxDetails.header = this.messages.HEADER_ERROR;
      }
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    this.subscriptionObject['network'] = this.offlineStorage.networkDisconnected.subscribe((value) => {
      this.networkIsAvailable = !value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });
    // Check whether the application running on the device or not with the existance of cordova.
    if (window && window.cordova) {
      this.isDevice = true;
    } else {
      this.isDevice = false;
    }

    if (this.imgData === undefined) {
      this.imgData = [];
      console.log('imageData: ', this.imgData);
    } else {
      this.imgData = _.cloneDeep(this.imgData);
      this.imgData.forEach((item, index) => {
        if (item && item.sectionName === this.sectionName && item.img) {
          this.sectionId = index;
          console.log('sectionId 1: ', this.sectionId);
          this.imgId = this.findImageId() !== null ? this.findImageId() : -1;
          // this.imgId = item.img.length - 1;
          console.log(this.imgId);
        }
      });
    }
    this.initView();
  }
  /**
   * Method which is used to check whether the application is going to open camera or gallery.
   * And also check whether the application running in device or the browser.
   * @return {void}
   */
  initView() {
    // If the user selected option is camera then open the Camera.
    if (this.option === 'Camera') {
      if (!this.isDevice) {
        this.dialogBoxDetails.action = [];
        this.dialogBoxDetails.content = this.messages.CAMERA_ERROR;
        this.dialogBoxDetails.action.push({ label: 'Okay', value: 'onSave' });
        this.display = true;
      } else {
        this.openCamera();
      }
      // If the user selected option is 'photo library' then open the gallery.
    } else {
      if (this.isDevice) {
        this.openGallery();
      } else {
        this.file.nativeElement.click();
      }
    }
  }
  /**
   * Method which is used to open camera with given options and get the image data of the taken picture
   * and store that image data.
   * @return {void}
   */
  openCamera() {
    let img;
    if (!this.networkIsAvailable) {
      img = this.camera.DestinationType.FILE_URI;
    } else {
      img = this.camera.DestinationType.DATA_URL;
    }
    // options defined for the camera.
    const options: CameraOptions = {
      quality: 100,
      destinationType: img,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    try {
      this.camera.getPicture(options).then((imageData) => {
        const imgId = this.findImageId() !== null ? this.findImageId() + 1 : 0;
        if (!this.networkIsAvailable) {
          if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].sectionName === this.sectionName) {
            // this.compressImage(imageData).then((thumnailImg) => {
            // tslint:disable-next-line:max-line-length
            this.imgData[this.sectionId].img.push({
              sectionName: this.sectionName, imageFileUri: imageData, description: '', imgId: imgId, mode: 'I'
            });
            // });

          } else if (this.sectionId === null || this.sectionId === undefined) {
            this.compressImage(imageData).then((thumnailImg) => {
              this.imgData.push({
                sectionName: this.sectionName,
                // tslint:disable-next-line:max-line-length
                img: [{ sectionName: this.sectionName, imageFileUri: imageData, thumnailImage: thumnailImg, description: '', imgId: 0, mode: 'I' }]
              });
              this.sectionId = this.imgData.length - 1;
            }).catch((err) => { console.log('Error', err); });
          }
          this.imgId += 1;
          this.showPreview = true;
        } else {
          const base64Image = 'data:image/jpeg;base64,' + imageData;
          this.compressImage(base64Image).then((thumnailImg) => {
            if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].sectionName === this.sectionName) {
              // tslint:disable-next-line:max-line-length
              this.imgData[this.sectionId].img.push({ sectionName: this.sectionName, thumnailImage: thumnailImg, imageLocation: base64Image, description: '', imgId: imgId, mode: 'I' });
            } else if (this.sectionId === null || this.sectionId === undefined) {

              this.imgData.push({
                sectionName: this.sectionName,
                // tslint:disable-next-line:max-line-length
                img: [{ sectionName: this.sectionName, thumnailImage: thumnailImg, imageLocation: base64Image, description: '', imgId: 0, mode: 'I' }]
              });
              this.sectionId = this.imgData.length - 1;
            }
          }).catch((err) => { console.log('Error', err); });

          this.imgId += 1;
          this.showPreview = true;
        }
      }, (err) => {
        if (this.imgData && this.imgData.length > 0) {
          this.showPreview = true;
        } else {
          this.imageCapturedData.emit(this.imgData);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Method which is used to emit the all image data to the parent component for save these pictures.
   * @return {void}
   */
  onSave() {
    this.imageCapturedData.emit(this.imgData);
  }
  /**
   * Method which is used to close the dialog box.
   * @param event local reference variable.
   */
  dialogBoxClose(event) {
    this.display = event;
    console.log('display var1', this.display);
  }
  unsavedImage() {
    this.dialogBoxDetails.action = [];
    this.dialogBoxDetails.content = this.messages.UNSAVED_IMAGE;
    this.dialogBoxDetails.action.push({ label: 'Yes', value: 'onClose' }, { label: 'No' });
    this.display = true;
  }
  /**
   * Method which is used to define which action is triggered.
   * @param event event {any} To define the event value.
   */
  dialogBoxAction(event) {
    this[event]();
    this.display = false;
    console.log('display var', this.display);
  }
  /**
   * Method which is used to open folder to select picture in browser and then get the image data of the selected picture
   * and store that image data.
   * @param event Event triggered that the image file selected from the gallery.
   * @return {void}
   */
  fileSelected(event) {
    const file = event.target.files[0];
    if (file) {
      this.showPreview = true;
      const that = this;
      const reader = new FileReader();
      reader.onload = function (e) {
        // that.sectionId = that.imgData ? (that.imgData.length > 0 ? that.imgData.length - 1 : 0) : null;
        const target: any = e.target;
        const content: string = target.result;
        const imgId = that.findImageId() !== null && that.findImageId() !== undefined ? that.findImageId() + 1 : 0;
        if (that.imgData && that.imgData[that.sectionId] && that.imgData[that.sectionId].sectionName === that.sectionName) {
          that.compressImage(content).then((thumnailImgCopy) => {
            // tslint:disable-next-line:max-line-length
            that.imgData[that.sectionId].img.push({
              sectionName: that.sectionName, thumnailImage: thumnailImgCopy,
              imageLocation: content, description: '', imgId: imgId, mode: 'I'
            });
            that.sectionId = that.imgData.length > 0 ? that.imgData.length - 1 : 0;
          }).catch((err) => { console.log('Error', err); });
          // tslint:disable-next-line:max-line-length
        } else if (that.sectionId === null || that.sectionId === undefined) {
          that.compressImage(content).then((thumnailImgCopy) => {
            that.imgData.push({
              sectionName: that.sectionName,
              // tslint:disable-next-line:max-line-length
              img: [{ sectionName: that.sectionName, thumnailImage: thumnailImgCopy, imageLocation: content, description: '', imgId: 0, mode: 'I' }]
            });
            that.sectionId = that.imgData.length > 0 ? that.imgData.length - 1 : 0;
          }).catch((err) => { console.log('Error', err); });
        }
        that.imgId += 1;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.file.nativeElement.value = '';
  }
  /**
   * Method which is used to open gallery in device and get the image data of the selected picture
   * and store this image data.
   * @return {void}
   */
  openGallery() {
    let img;
    const that = this;
    if (!this.networkIsAvailable) {
      img = this.camera.DestinationType.FILE_URI;
    } else {
      img = this.camera.DestinationType.DATA_URL;
    }
    const options: CameraOptions = {
      quality: 100,
      destinationType: img,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      const imgId = this.findImageId() !== null ? this.findImageId() + 1 : 0;
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      if (!this.networkIsAvailable) {
        if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].sectionName === this.sectionName) {
          this.compressImage(imageData).then((thumnailImgCopy) => {
            // tslint:disable-next-line:max-line-length
            this.imgData[this.sectionId].img.push({ sectionName: this.sectionName, thumnailImage: thumnailImgCopy, imageFileUri: imageData, description: '', imgId: imgId, mode: 'I' });
            this.sectionId = this.imgData.length > 0 ? this.imgData.length - 1 : 0;
          }).catch((err) => { console.log('error in inspection sections', err); });

        } else if (this.sectionId === null || this.sectionId === undefined) {
          this.compressImage(imageData).then((thumnailImgCopy) => {
            this.imgData.push({
              sectionName: this.sectionName,
              // tslint:disable-next-line:max-line-length
              img: [{ sectionName: this.sectionName, imageFileUri: imageData, thumnailImage: thumnailImgCopy, description: '', imgId: 0, mode: 'I' }]
            });
            this.sectionId = this.imgData.length > 0 ? this.imgData.length - 1 : 0;
          }).catch((err) => { console.log('Error', err); });
        }
        // if device in offline then save fileuri details to display images.
        this.imgId += 1;
        this.showPreview = true;
      } else {
        // if device in online then save base64 encoded string to display images.
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].sectionName === this.sectionName) {
          this.compressImage(base64Image).then((thumnailImgCopy) => {
            // tslint:disable-next-line:max-line-length
            this.imgData[this.sectionId].img.push({ sectionName: this.sectionName, thumnailImage: thumnailImgCopy, imageLocation: base64Image, description: '', imgId: imgId, mode: 'I' });
            this.sectionId = this.imgData.length > 0 ? this.imgData.length - 1 : 0;
          }).catch((err) => { console.log('Error', err); });
        } else if (this.sectionId === null || this.sectionId === undefined) {
          this.compressImage(base64Image).then((thumnailImgCopy) => {
            this.imgData.push({
              sectionName: this.sectionName,
              // tslint:disable-next-line:max-line-length
              img: [{ sectionName: this.sectionName, imageLocation: base64Image, thumnailImage: thumnailImgCopy, description: '', imgId: 0, mode: 'I' }]
            });
            this.sectionId = this.imgData.length > 0 ? this.imgData.length - 1 : 0;
          }).catch((err) => { console.log('Error', err); });
        }
        this.imgId += 1;
        console.log('section id 2: ', this.sectionId);
        this.showPreview = true;
      }
    }, (err) => {
      if (this.imgData && this.imgData.length > 0) {
        this.showPreview = true;
      } else {
        this.imageCapturedData.emit(this.imgData);
      }
    });
  }

  /**
   * Component OnDestroy life cycle hook.
   */
  ngOndestroy() {
    this.camera.cleanup().then(() => {
      console.log('camera cleanup success');
    });
  }
  /**
   * Method which is used to exit from this component.
   * @return {void}
   */
  onClose() {
    this.imageCapturedData.emit([]);
  }
  /**
   * Method which is used to add caption for selected image.
   * @return {void}
   */
  onAddCaption() {
    this.offlineStorage.focusMode.next('RedBottomTray');
    if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].img[this.imgId]) {
      this.imgData[this.sectionId].img[this.imgId].description = this.caption;
      if (this.imgData && this.imgData[this.sectionId].img[this.imgId].mode !== 'R') {
        this.imgData[this.sectionId].img[this.imgId].mode = 'U';
      }
    }
    this.caption = '';
  }
  /**
   * Method which is used to delete the particular image from the list.
   * @param index To define the index of the image.
   */
  onDeleteClicked(index: number, imgId: number) {
    let itemDeleted = false;
    if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].img) {
      if (this.imgId === imgId) {
        this.imgId = imgId > 0 ? imgId - 1 : (this.findImageId() > imgId && this.findImageId() !== null ? imgId : -1);
      } else if (this.imgId > imgId) {
        this.imgId = this.imgId - 1;
      }
      this.imgData[this.sectionId].img.forEach((item) => {
        if (item && item.imgId === imgId && item.id !== null && item.id !== undefined) {
          itemDeleted = true;
          const length = item.imageLocation.lastIndexOf('?');
          const url = item.imageLocation.slice(0, length);
          const previewUrl = item.thumnailImage;
          console.log('preview url in del', previewUrl);
          item.imageLocation = url;
          item.mode = 'D';
          item.imgId = null;
        } else if (item && item.imgId > imgId) {
          item.imgId = item.imgId - 1;
        }
      });
      if (!itemDeleted) {
        this.imgData[this.sectionId].img.splice(index, 1);
      }
    }
  }

  /**
   * Method which is used to return the highest imgId in given array of objects.
   */
  findImageId() {
    if (this.imgData && this.imgData[this.sectionId] && this.imgData[this.sectionId].img) {
      // tslint:disable-next-line:max-line-length
      const length = this.imgData[this.sectionId].img.reduce((count, item) => item.imgId >= count ? item.imgId : -1, -1);
      return length;
    }
  }
  /**
   * Method which is used to edit the image with paint options
   * @param sectionId defines the section on which the image is selected.
   * @param imgIndex defines the index of the image
   */
  onImageEditWithPaint(sectionId: number, imgIndex: number) {
    this.imageToEdit.enabled = true;
    if (this.imgData && this.imgData[sectionId] && this.imgData[sectionId].img &&
      this.imgData[sectionId].img[imgIndex]) {
      this.imageToEdit.imageData = this.imgData[sectionId].img[imgIndex].imageLocation;
      this.imageToEdit.imageId = imgIndex;
      this.imageToEdit.sectionId = sectionId;
    }
  }
  /**
   * Method which is used to complete the image edit option.
   */
  onSketchCompleted(event) {
    console.log('event', event);
    this.compressImage(event).then((previewImg) => {
      this.imgData[this.imageToEdit.sectionId].img[this.imageToEdit.imageId].thumnailImage = previewImg;
      this.imgData[this.imageToEdit.sectionId].img[this.imageToEdit.imageId].imageLocation = event;
      console.log('edited thumnail', previewImg);
    }).catch((err) => { console.log('Error', err); });
    this.imageToEdit.enabled = false;
  }

  /**
   * Method which is used to rotate the image to clockwise or anti-clockwise.
   * @param rotateDegree To define the direction of rotation
   */
  rotateImage(rotateDegree: number, sectionId: number, imgIndex: number) {
    const that = this;
    let imageDetails;
    if (this.imgData && this.imgData[sectionId] && this.imgData[sectionId].img &&
      this.imgData[sectionId].img[imgIndex]) {
      imageDetails = this.imgData[sectionId].img[imgIndex];
      const image = new Image();
      const canvas = document.createElement('canvas');
      const oCtx = canvas.getContext('2d');
      if ((window && window.cordova) || (imageDetails && (imageDetails.imageUrl || imageDetails.id === null
        || imageDetails.id === undefined))) {
        image.src = imageDetails.imageLocation;

        image.onload = function () {
          canvas.width = image.height;
          canvas.height = image.width;
          oCtx.fillStyle = 'white';
          oCtx.fillRect(0, 0, image.height, image.width);
          oCtx.save();
          if (rotateDegree > 0) {
            // ClockWise rotation
            oCtx.transform(0, 1, -1, 0, image.height, 0);
          } else {
            // Anti-clockWise rotation
            oCtx.transform(0, -1, 1, 0, 0, image.width);
          }
          oCtx.drawImage(image, 0, 0);

          if (that.imgData && that.imgData[sectionId] && that.imgData[sectionId].img &&
            that.imgData[sectionId].img[imgIndex]) {
            if (window && window.cordova && !that.imgData[sectionId].img[imgIndex].imageUrl) {
              const index = that.imgData[sectionId].img[imgIndex].imageLocation.lastIndexOf('?');
              const url = that.imgData[sectionId].img[imgIndex].imageLocation.slice(0, index);
              that.imgData[sectionId].img[imgIndex].imageUrl = url;
              that.imgData[sectionId].img[imgIndex].mode = 'R';
            }
            that.imgData[sectionId].img[imgIndex].imageLocation = canvas.toDataURL('image/jpeg');
            that.compressImage(canvas.toDataURL('image/jpeg')).then((thumnailImgCopy) => {
              that.imgData[sectionId].img[imgIndex].thumnailImgUrl = imageDetails.thumnailImage;
              that.imgData[sectionId].img[imgIndex].thumnailImage = thumnailImgCopy;
            });
          }
          oCtx.restore();
        };
      } else if (imageDetails && this.networkIsAvailable) {
        const index = imageDetails.imageLocation.lastIndexOf('?');
        const url = imageDetails.imageLocation.slice(0, index);
        this.subscriptionObject['convertion'] = this.reportService.convertImageToBase64String(url).subscribe((res) => {
          if (res && res['blobObject']) {
            image.src = res['blobObject'];
            image.onload = function () {
              canvas.width = image.height;
              canvas.height = image.width;
              oCtx.fillStyle = 'white';
              oCtx.fillRect(0, 0, image.height, image.width);
              oCtx.save();
              if (rotateDegree > 0) {
                // ClockWise rotation
                oCtx.transform(0, 1, -1, 0, image.height, 0);
              } else {
                // Anti-clockWise rotation
                oCtx.transform(0, -1, 1, 0, 0, image.width);
              }
              oCtx.drawImage(image, 0, 0);
              if (that.imgData && that.imgData[sectionId] && that.imgData[sectionId].img &&
                that.imgData[sectionId].img[imgIndex]) {
                that.imgData[sectionId].img[imgIndex].imageUrl = url;
                that.imgData[sectionId].img[imgIndex].mode = 'R';
                that.imgData[sectionId].img[imgIndex].imageLocation = canvas.toDataURL('image/jpeg');
                that.compressImage(canvas.toDataURL('image/jpeg')).then((thumnailImgCopy) => {
                  that.imgData[sectionId].img[imgIndex].thumnailImgUrl = imageDetails.thumnailImage;
                  that.imgData[sectionId].img[imgIndex].thumnailImage = thumnailImgCopy;
                }).catch((err) => { console.log('Error', err); });
              }
              oCtx.restore();
            };
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
      }
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
        ctx.drawImage(imgData, 0, 0, 80, 80);
        const thumnailImg = canvas.toDataURL('image/jpeg');
        resolve(thumnailImg);
      };
    });
  }
  onFocau() {
    this.offlineStorage.focusMode.next(true);
  }
  /**
   * OnDestroy lifecycle hook.
   * Here we unsubscribed all our subscriptions in this component.
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
