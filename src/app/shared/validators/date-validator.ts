import { AbstractControl } from "@angular/forms";

export function DateValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let from = control.get("startAt");
  let to = control.get("endAt");
  let c = new Date();
  if (new Date(from.value) < c) {
    return {
      invaineFrom: true,
    };
  }
  if (new Date(to.value) < c) {
    return {
      invaineTo: true,
    };
  }
  if (from.value > to.value) {
    return {
      dates: true,
    };
  }
  return {};
}
