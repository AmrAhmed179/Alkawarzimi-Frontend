import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/core/services/data.service";
import { NotifyService } from "src/app/core/services/notify.service";
import { ProjectModel } from "src/app/core/models/project-model";
import { UserModel } from "src/app/core/models/user-model";

import { environment } from "src/environments/environment";
@Component({
  selector: "vex-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  showSpinner = true;
  projectId: string;
  USER_ROLE: string;
  agent_text = "agent";
  user: UserModel;

  constructor(
    private router: Router,
    private notify: NotifyService,
    private _dataService: DataService
  ) {}

  ngOnInit() {
    console.log("!!! Hello HomeComponent! ");
    this.getLoggedUser();

    this.getCurrentProject();
  }
  progessList = [0, 0, 0, 0];
  totalProgress = 0;
  getBrandProgress() {}
  project: ProjectModel;

  getCurrentProject() {
    this._dataService.$project_bs.subscribe((project) => {
      debugger
      this.project = project;
      console.log(
        "00 -> HOME project from AUTH service subscription  ",
        project
      );

      if (this.project) {
        this.showSpinner = false;
        this.projectId = this.project._id;
        this.getBrandProgress();
        this.USER_ROLE = this.project.users.find(
          (x) => x.id_user == this.user.id
        ).role;
      }
    });
  }
  getLoggedUser() {
    this._dataService.$user_bs.subscribe((user) => {
      console.log("USER GET IN HOME ", user);
      // tslint:disable-next-line:no-
      this.user = user;
    });
  }

  goToHoursStaticPage() {
    this.router.navigate(["project/" + this.projectId + "/hours"]);
  }
}
