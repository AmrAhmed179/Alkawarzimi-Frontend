import { Component, Inject, OnInit } from '@angular/core';
import { PopoverRef } from '../popover/popover-ref';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vex-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(private readonly popoverRef: PopoverRef
    ,private _dataService:DataService,  private http: HttpClient,
  @Inject(DOCUMENT) private document: Document,) { }

  ngOnInit(): void {
  }

  close(): void {
    /** Wait for animation to complete and then close */
   // setTimeout(() => this.popoverRef.close(), 250);
   this._dataService.signout();
  }

    logOut() {
      console.log("RUN LOGOUT FROM ToolBar");
      localStorage.removeItem("user");
      localStorage.removeItem("project");
      localStorage.removeItem("role");
      this.http.post('/Account/SSOFrontLogOff', {}, { withCredentials: true })
      .subscribe(() => {
        // Important: XHR won't navigate on server redirect
        // So force navigation yourself:
        this.document.location.href = environment.URLS.BASE_URL
      });

    }
}
