import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class AutocompleteSelectValidator {  
    
static list:string[];

static compareMatching(list: string[]): ValidatorFn {  
   
    return (control: AbstractControl): ValidationErrors | null => {
        
        return list.indexOf(control?.value) != -1 ? null : { isMatching: true } 
      }
}  

static compareUnMatching(list: string[],create:boolean): ValidatorFn {  
   if(create==true){
    return (control: AbstractControl): ValidationErrors | null => {
      
      return list.indexOf(control?.value) == -1 ? null : { isUnMatching: true } 
    }
   }
   else{
    return (control: AbstractControl): ValidationErrors | null => {
      
      return list.indexOf(control?.value) == -1 ? null : { isUnMatching: true } 
    }
   }
 
}  

}


