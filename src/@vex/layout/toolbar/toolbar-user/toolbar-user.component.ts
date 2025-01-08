import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { PopoverService } from "../../../components/popover/popover.service";
import { ToolbarUserDropdownComponent } from "./toolbar-user-dropdown/toolbar-user-dropdown.component";
import { UserModel } from "src/app/core/models/user-model";
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: "vex-toolbar-user",
  templateUrl: "./toolbar-user.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarUserComponent implements OnInit {
  dropdownOpen: boolean;

  user: UserModel = null;

  constructor(
    private popover: PopoverService,
    private cd: ChangeDetectorRef,
    private _dataService: DataService
  ) {}

  ngOnInit() {
    this._dataService.$user_bs.subscribe((response) => {
      if (response) this.user = response;
      console.log("toolbar-user" + response);
      console.log("toolbar-user" + this.user);
    });
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: ToolbarUserDropdownComponent,
      data: this.user,
      origin: originRef,
      offsetY: 12,
      position: [
        {
          originX: "center",
          originY: "top",
          overlayX: "center",
          overlayY: "bottom",
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top",
        },
      ],
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
}
