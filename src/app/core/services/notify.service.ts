import { Injectable } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
export type NotificationType = 'success' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
}
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
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string) {
    this.notificationSubject.next({ message, type: 'success' });
  }

  showError(message: string) {
    this.notificationSubject.next({ message, type: 'error' });
  }
}

