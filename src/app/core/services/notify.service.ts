import { Injectable } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
@Injectable({ providedIn: "root" })
export class NotifyService {
  constructor(private snackBar: MatSnackBar) {}

  openSuccessSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass: ["green-snackbar"],
    });
  }
  //Snackbar that opens with failure background
  openFailureSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass: ["red-snackbar"],
    });
  }

  showNotification(message, notificationColor, icon) {
    const type = ["", "info", "success", "warning", "danger"];
    // const color = Math.floor((Math.random() * 4) + 1);
    const color = notificationColor;
  }
}
