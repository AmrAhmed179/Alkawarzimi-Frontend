import { Component, OnInit } from '@angular/core';
import { PopoverRef } from '../popover/popover-ref';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'vex-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(private readonly popoverRef: PopoverRef, private _dataService:DataService) { }

  ngOnInit(): void {
  }

  close(): void {
    /** Wait for animation to complete and then close */
   // setTimeout(() => this.popoverRef.close(), 250);
   this._dataService.signout();
  }
}
