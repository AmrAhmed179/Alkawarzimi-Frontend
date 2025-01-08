import { AbstractControl } from "@angular/forms";
import * as moment from "moment-timezone";

export function TimeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let fromTime = control.get("startTime");
  let toTime = control.get("endTime");

  let cTime = moment().format("hh:mm");

  if (fromTime.value < cTime) {
    return {
      invaineTimeFrom: true,
    };
  }
  if (toTime.value < cTime) {
    return {
      invaineTimeTo: true,
    };
  }
  if (fromTime.value > toTime.value) {
    return {
      datesTime: true,
    };
  }

  return {};
}
