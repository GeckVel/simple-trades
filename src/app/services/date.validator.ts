import { FormGroup, ValidationErrors } from "@angular/forms";

  export function checkDates(from: string, to: string): ValidationErrors {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (t.value < f.value) {
        t.setErrors({ error: "Entry date should be less or equal than exit date" })
      }
      return {};
    }
}