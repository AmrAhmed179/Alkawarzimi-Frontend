import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: "root",
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinner: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    if (this.busyRequestCount > 0) {
      this.spinner.show(undefined, {
        type: "line-scale",
        bdColor: "rgba(0, 0, 0, 0.5)",
        color: "#ee8b4c",
      });
    }
  }
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
