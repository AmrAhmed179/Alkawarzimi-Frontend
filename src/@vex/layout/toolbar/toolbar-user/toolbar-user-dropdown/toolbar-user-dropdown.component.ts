import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { MenuItem } from "../interfaces/menu-item.interface";
import { trackById } from "../../../../utils/track-by";
import { PopoverRef } from "../../../../components/popover/popover-ref";
import { UserModel } from "src/app/core/models/user-model";
import { DOCUMENT } from "@angular/common";
import { environment } from "src/environments/environment";

export interface OnlineStatus {
  id: "online" | "away" | "dnd" | "offline";
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: "vex-toolbar-user-dropdown",
  templateUrl: "./toolbar-user-dropdown.component.html",
  styleUrls: ["./toolbar-user-dropdown.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarUserDropdownComponent implements OnInit {
  items: MenuItem[] = [
    {
      id: "0",
      icon: "mat:account_circle",
      label: "Admin Dashboard",
      description: "control clients Account",
      colorClass: "text-teal",
      route: "admin",
    },
    {
      id: "1",
      icon: "mat:account_circle",
      label: "My Profile",
      description: "Personal Information",
      colorClass: "text-teal",
      route: "/apps/social",
    },
    // {
    //   id: '2',
    //   icon: 'mat:move_to_inbox',
    //   label: 'My Inbox',
    //   description: 'Messages & Latest News',
    //   colorClass: 'text-primary',
    //   route: '/apps/chat'
    // },
    // {
    //   id: '3',
    //   icon: 'mat:list_alt',
    //   label: 'My Projects',
    //   description: 'Tasks & Active Projects',
    //   colorClass: 'text-amber',
    //   route: '/apps/scrumboard'
    // },
    // {
    //   id: '4',
    //   icon: 'mat:table_chart',
    //   label: 'Billing Information',
    //   description: 'Pricing & Current Plan',
    //   colorClass: 'text-purple',
    //   route: '/pages/pricing'
    // }
  ];

  statuses: OnlineStatus[] = [
    {
      id: "online",
      label: "Online",
      icon: "mat:check_circle",
      colorClass: "text-green",
    },
    {
      id: "away",
      label: "Away",
      icon: "mat:access_time",
      colorClass: "text-orange",
    },
    {
      id: "dnd",
      label: "Do not disturb",
      icon: "mat:do_not_disturb",
      colorClass: "text-red",
    },
    {
      id: "offline",
      label: "Offline",
      icon: "mat:offline_bolt",
      colorClass: "text-gray",
    },
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  public user: UserModel = null;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cd: ChangeDetectorRef,
    private popoverRef: PopoverRef<ToolbarUserDropdownComponent>
  ) {}

  ngOnInit() {
    this.user = this.popoverRef.data as UserModel;
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.popoverRef.close();
  }
  logOut() {
    this.close();
    console.log("RUN LOGOUT FROM ToolBar");
    localStorage.removeItem("user");
    localStorage.removeItem("project");
    localStorage.removeItem("role");
    // localStorage.clear();
    this.document.location.href = environment.URLS.BASE_URL
    //this.router.navigate(['/Account/login']);
    let el = this.document.getElementById("logoutLink");
    if (el != null) el.click();
  }
}
