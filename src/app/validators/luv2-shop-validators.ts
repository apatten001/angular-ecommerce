import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors{
        
        if ((control.value != null) && (control.value.trim().length === 0)){
            
            //invalid returns error object
            return {'notOnlyWhiteSpace':true}

        }else{
            // valid and ok
            return null;

        }
        
        
        
        
    }
}
