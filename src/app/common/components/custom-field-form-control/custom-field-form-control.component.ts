// custom-field-form-control component,which describe the functionality for
// creating the form control of DynamicFieldModel.
import { Component, Input, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DynamicFormGroupService } from '../../services/dynamic-form-group.service';
import { OfflineStorageService } from '../../services/offlineStorage.service';
import * as _ from 'lodash';
import { mergeMap, filter } from 'rxjs/operators';
/**
 * Variable which is used to define the window screen.
 * @type {any}
 */
declare let window: any;
/**
 * Component which is used to create the custom form control for DynamicFieldModel.
 */
@Component({
  selector: 'app-custom-field-form-control',
  templateUrl: './custom-field-form-control.component.html',
  styleUrls: ['./custom-field-form-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFieldFormControlComponent),
      multi: true
    }
  ]
})
export class CustomFieldFormControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Variable which is used to check whether the network is connected or not.
   * @type {boolean}
   */
  networkIsAvailable: boolean;
  /**
   * Variable which is used to subcribe or unsubscribe.
   * @type {Subscription}
   */
  subscriptionObject = {};
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
   * Variable which is used to define dynamic field question list.
   * @type {any[]}
   */
  fieldQuestions = [];
  /**
   * Variable which is used to define the count of the dynmic-fields group.
   * @type {any[]}
   */
  count = [];
  /**
   * Variable which is used to store the dynamic field answers.
   * @type {any[]}
   */
  value = [];
  /**
   * Variable which is used to store the image answers.
   */
  imageData;
  /**
   * Constructor which is used to inject the required services.
   * @param dynamicFormService To access and store dynamic-field questions and answers.
   * @param offlineStorage To get data from offline database
   */
  constructor(private dynamicFormService: DynamicFormGroupService,
    private offlineStorage: OfflineStorageService) { }
  /**
   * Component onInit life cycle hook.
   */
  ngOnInit() {
    this.subscriptionObject['networkStatus'] = this.offlineStorage.networkDisconnected.subscribe((value) => {
      this.networkIsAvailable = !value;
    }, (err) => {
      if (err.error && err.error.error) {
        console.log('Error: ', err.error.error);
      }
    });

    if (this.networkIsAvailable) {
      if (this.question) {
        // To get the dynamic field question for given field id
        // this.subscriptionObject['dynamicFieldQuestion'] = this.dynamicFormService.getDynamicFieldQuestion(this.question.id)
        //   .subscribe((res) => {
        //     if (res && res['questions']) {
        //       res['questions'].forEach((item) => {
        //         if (item.id !== this.question.id) {
        //           this.fieldQuestions.push(item);
        //         }
        //       });
        //     }
        //     To check whether the report being edited or not
        //     if (this.editId !== undefined && this.editId !== null) {
        //       If edit the inspection then get the dynamic-fieldanswers for given report id
        //       tslint:disable-next-line:max-line-length
        //       this.subscriptionObject['dynamicFieldAns'] = this.dynamicFormService.getDynamicFieldAnswers(this.editId)
        //         .subscribe((response) => {
        //           let length = 0;
        //           if (response && response['answer'] && response['answer'].length > 0) {
        //             response['answer'].forEach((answer, index) => {
        //               if (answer) {
        //                 if (length < answer.elementArray) {
        //                   length = answer.elementArray;
        //                 }
        //                 this.fieldQuestions.forEach((qus) => {
        //                   if (answer.questionId === qus.id) {
        //                     answer.optionGroup = qus.optionGroup;
        //                     answer.inputTypeName = qus.inputType.inputTypeName;
        //                     answer.changedElementArray = answer.elementArray;
        //                     if (answer.imageAnswers && answer.imageAnswers.length > 0 &&
        //                       qus.inputType.inputTypeName === 'DynamicCustomSignatureModel') {
        //                       answer.value = answer.imageAnswers;
        //                       answer.imageAnswers = answer.imageAnswers;
        //                       this.imageData = answer.imageAnswers;
        //                       answer.answer_text = null;
        //                       answer.changedElementArray = answer.elementArray;
        //                     } else if (answer.imageAnswers && answer.imageAnswers.length > 0 &&
        //                       qus.inputType.inputTypeName === 'DynamicImageModel') {
        //                       answer.value = answer.imageAnswers;
        //                       this.imageData = answer.imageAnswers;
        //                       answer.answer_text = null;
        //                     } else if (answer.optionChoiceAnswers && answer.optionChoiceAnswers.length > 0) {
        //                       answer.optionChoiceAnswers.find((option) => {
        //                         if (option.optionChoice.optionGroupId === answer.optionGroup.id) {
        //                           answer.answer_text = option.optionChoice.optionChoicesValue;
        //                           answer.value = option.optionChoice.optionChoicesValue;
        //                           return true;
        //                         }
        //                       });
        //                     }
        //                   }
        //                 });
        //               }
        //               if (response['answer'] && index === response['answer'].length - 1) {
        //                 this.writeValue(response['answer']);
        //               }
        //             });
        //             tslint:disable-next-line:max-line-length
        //             const length = res['answer'].reduce((count, item) => item.elementArray > count ? item.elementArray : count, res['answer'][0].elementArray);
        //             for (let i = 0; i <= length; i++) {
        //               To find the count of the dynamic fields-group.
        //               this.countIncrement();
        //             }
        //           }
        //         });

        //     }
        //   });



        // tslint:disable-next-line:max-line-length
        this.subscriptionObject['dynamicFieldQuestion'] = this.dynamicFormService.getDynamicFieldQuestion(this.question.id).pipe(filter((res) => {
          if (res && res['questions']) {
            res['questions'].forEach((item) => {
              if (item.id !== this.question.id) {
                this.fieldQuestions.push(item);
              }
            });
          }
          return (this.editId !== undefined && this.editId !== null);
        }), mergeMap(() => {
          return this.dynamicFormService.getDynamicFieldAnswers(this.editId);
        })).subscribe((response) => {
          let length = 0;
          if (response && response['answer'] && response['answer'].length > 0) {
            response['answer'].forEach((answer, index) => {
              if (answer) {
                if (length < answer.elementArray) {
                  length = answer.elementArray;
                }
                this.fieldQuestions.forEach((qus) => {
                  if (answer.questionId === qus.id) {
                    answer.optionGroup = qus.optionGroup;
                    answer.inputTypeName = qus.inputType.inputTypeName;
                    answer.changedElementArray = answer.elementArray;
                    if (answer.imageAnswers && answer.imageAnswers.length > 0 &&
                      qus.inputType.inputTypeName === 'DynamicCustomSignatureModel') {
                      answer.value = answer.imageAnswers;
                      answer.imageAnswers = answer.imageAnswers;
                      this.imageData = answer.imageAnswers;
                      answer.answer_text = null;
                      answer.changedElementArray = answer.elementArray;
                    } else if (answer.imageAnswers && answer.imageAnswers.length > 0 &&
                      qus.inputType.inputTypeName === 'DynamicImageModel') {
                      answer.value = answer.imageAnswers;
                      this.imageData = answer.imageAnswers;
                      answer.answer_text = null;
                    } else if (answer.optionChoiceAnswers && answer.optionChoiceAnswers.length > 0) {
                      answer.optionChoiceAnswers.find((option) => {
                        if (option.optionChoice.optionGroupId === answer.optionGroup.id) {
                          answer.answer_text = option.optionChoice.optionChoicesValue;
                          answer.value = option.optionChoice.optionChoicesValue;
                          return true;
                        }
                      });
                    }
                  }
                });
              }
              if (response['answer'] && index === response['answer'].length - 1) {
                this.writeValue(response['answer']);
              }
            });
            for (let i = 0; i <= length; i++) {
              // To find the count of the dynamic fields-group.
              this.countIncrement();
            }
          }
        }, (err) => {
          if (err.error && err.error.error) {
            console.log('Error: ', err.error.error);
          }
        });
      }
    }
  }
  /**
   * Callback which is implemented when the view changed.And call from registerOnChange method.
   */
  // tslint:disable-next-line:no-shadowed-variable
  propagateChange = (_: any) => { };
  /**
   * Method which is used to change a value from form model into the DOM view.
   * @param value {any} To define the form-model value.
   */
  writeValue(value: any) {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
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
  registerOnTouched() { }
  /**
   * Method which is used to increment the dynamic-field-group count value.
   */
  countIncrement() {
    if (!this.networkIsAvailable) {
      alert('Cannot access dynamic field in offline');
    }
    if (this.networkIsAvailable) {
      this.count.push(this.count.length);
    }
  }
  /**
   * Method which is used to decrement the dynamic-field group count value.
   * @param index {number} To define the index of the selected dynamic-field.
   */
  countDecrement(index: number) {
    let flag: boolean;
    // And also remove the form control value(answsers value) for the removed dynamic-field-group
    for (let i = 0; i < this.value.length; i++) {
      if (this.value[i] && this.value[i].changedElementArray === null) {
        this.value[i].changedElementArray = this.value[i].elementArray;
      }
      if (this.value[i] && this.value[i].elementArray === index) {
        if (this.value[i].Id) {
          flag = true;
          this.count[index] = -1;
          this.value[i].mode = 'D';
        } else {
          this.value.splice(i, 1);
          i--;
        }
      } else if (this.value[i] && this.value[i].elementArray > index && this.value[i].mode !== 'D') {
        if (this.value[i].Id) {
          const elementArray = this.value[i].changedElementArray ? this.value[i].changedElementArray : this.value[i].elementArray;
          this.value[i].changedElementArray = elementArray - 1;
          this.value[i].mode = 'U';
        } else {
          const elementArray = this.value[i].changedElementArray ? this.value[i].changedElementArray : this.value[i].elementArray;
          this.value[i].changedElementArray = elementArray - 1;
        }
      }
    }
    if (!flag) {
      this.count[index] = -1;
    }
    // And call the call back function to say view has been changed.
    this.propagateChange(this.value);
  }
  /**
   * Method which is used to store the dynamic-field form control value.
   * @param event {any} To define the form control value.
   * @param i {number} To define the dynamic-field-group id.
   */
  eventTriggered(event: any, i: number) {
    let flag: boolean;
    if (event && event.length > 0) {
      this.imageData = event;
    }
    if (this.fieldQuestions) {
      this.fieldQuestions.forEach((question) => {

        if (question) {
          const questionName = question.questionName + i;

          // To check whether the form control have value for the given question or not.
          if ((event.hasOwnProperty(questionName) &&
            (event[questionName] !== null && event[questionName] !== undefined &&
              event[questionName] !== false) || (event[questionName] &&
                event[questionName].hasOwnProperty(length) && event[questionName].length > 0)) ||
            (!event[questionName] && this.imageData && this.imageData.length > 0)) {

            flag = false;
            for (const item of this.value) {
              // To check whether the question and anwsers is already saved or not
              if (item && item.elementArray === i && item.questionId === question.id) {
                flag = true;
                if (item.inputTypeName !== 'DynamicCustomSignatureModel' && item.inputTypeName !== 'DynamicImageModel') {
                  item.answer_text = event[questionName];
                  item.value = event[questionName];
                } else if (item.inputTypeName === 'DynamicCustomSignatureModel') {
                  item.imageAnswers = event[questionName];
                  this.imageData = event.questionName;
                  item.answer_text = null;
                } else if (item.inputTypeName === 'DynamicImageModel') {
                  if (this.imageData) {
                    item.imageAnswers = this.imageData;
                  }
                  item.answer_text = null;
                  // item.value = item.imageAnswers;
                }
                if (item.changedElementArray === undefined || item.changedElementArray === null) {
                  item.changedElementArray = item.elementArray;
                }
                item.mode = 'U';
              }
            }
            // If question is not saved then save as new row
            if (!flag) {
              let counter = 0;
              if (this.count) {
                this.count.forEach((item) => {
                  if (item !== -1 && item < i) {
                    counter++;
                  }
                });
              }
              if (question.inputType.inputTypeName === 'DynamicCustomSignatureModel') {
                this.value.push({
                  elementArray: i,
                  imageAnswers: event[questionName],
                  changedElementArray: counter,
                  questionId: question.id,
                  value: event[questionName],
                  inputTypeName: question.inputType.inputTypeName
                });
                this.imageData = null;
              } if (question.inputType.inputTypeName === 'DynamicImageModel') {
                this.value.push({
                  elementArray: i,
                  imageAnswers: this.imageData,
                  changedElementArray: counter,
                  questionId: question.id,
                  value: this.imageData,
                  inputTypeName: question.inputType.inputTypeName
                });
                this.imageData = null;
              } else {
                this.value.push({
                  elementArray: i,
                  changedElementArray: counter,
                  questionId: question.id,
                  value: event[questionName],
                  inputTypeName: question.inputType.inputTypeName,
                  answer_text: event[questionName],
                  optionGroup: question.optionGroup ? question.optionGroup : []
                });
              }
            }
          } else if (event.hasOwnProperty(questionName)) {
            for (const item of this.value) {
              // To check whether the question and anwsers is already saved or not
              if (item && item.elementArray === i && item.questionId === question.id) {
                item.value = event[questionName];
                item.changedElementArray = item.elementArray;
                item.mode = 'D';
              }
            }
          }
        }
      });
    }
    // And call the call back function to say view has been changed.
    this.propagateChange(this.value);
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
