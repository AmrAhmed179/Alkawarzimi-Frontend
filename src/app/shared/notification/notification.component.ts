import { Component, Input, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/core/services/notify.service';
import {  Notification} from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[] = [];

  constructor(private notificationService: NotifyService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);

      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 4000); // Auto-remove after 4 seconds
    });
  }

}
