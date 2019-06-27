import { UserService } from '../../user/services/users.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SiteService } from '../../common/services/site.service';
import { DynamicInspectionService } from './dynamicInspection.service';

export class CustomAsyncValidatorService {

  static asyncEmailValidation(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> | null => {
      return timer(500).pipe(switchMap(() => {
        return userService.checkEmail(control.value).pipe(map((res) => {
          return res && res['emailExist'] ? { emailAlreadyExists: true } : null;
        }));
      }));
    };
  }
  static asyncTemplateValidator(dynamicInspectionService: DynamicInspectionService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> | null => {
      return timer(500).pipe(switchMap(() => {
        return dynamicInspectionService.checkTemplateName(control.value).pipe(map((res) => {
          return res && res['templateNameExist'] ? { templateNameAlreadyExists: true } : null;
        }));
      }));
    };
  }
  static asyncWindFarmValidator(siteService: SiteService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> | null => {
      return timer(500).pipe(switchMap(() => {
        return siteService.checkWindFarmName(control.value).pipe(map((res) => {
          return res && res['windFarmNameExist'] ? { windFarmNameAlreadyExists: true } : null;
        }));
      }));
    };
  }
}
