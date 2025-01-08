import { Component, OnInit } from "@angular/core";
import { NavigationService } from "src/@vex/services/navigation.service";
import { DataService } from "src/app/core/services/data.service";
import { combineLatest, forkJoin, map, skip } from "rxjs";
import { ConfigService } from "src/@vex/config/config.service";
import { ColorSchemeName } from "src/@vex/config/colorSchemeName";

@Component({
  selector: "vex-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})

export class AdminComponent implements OnInit {
  colorScheme=ColorSchemeName.dark;
  constructor(
    private navigationService: NavigationService,
    private _dataSerivce: DataService,
    private configService: ConfigService,
  ) {
    combineLatest(
      _dataSerivce.$project_bs.asObservable(),
      _dataSerivce.$user_bs.asObservable()
    ).subscribe(([project, user]) => {
      this.navigationService.items = [];
      if (user) {
        this.createNavigation(user);
      }
    });

    configService.updateConfig({
      style: {
        colorScheme:this.colorScheme
      }
    });
    configService.updateConfig({
      sidenav: {
        title: "DashBoard"
      }
    });
  }

  ngOnInit(): void {
    //this.navigationService.items = [];
    //this.navigationService.triggerItemsChange();
  }

  createNavigation(user) {


    this.navigationService.items = [];

    if (user.role == "System Admin") {
      this.navigationService.items.push({
        type: "link",
        label: "home",
        route: "./home",
        icon: "mat:home",
        routerLinkActiveOptions: { exact: true },
        breadCrumbs: ["الرئيسية"],
      });

      return;
    }
    // this.navigationService.items.push({
    //   type: "link",
    //   label: "home",
    //   route: "./home",
    //   icon: "mat:home",
    //   routerLinkActiveOptions: { exact: true },
    //   breadCrumbs: ["الرئيسية"],
    // });

//////////////////////// admin Role /////////////////////////////////

    if (user.role == "Admin"){
      this.navigationService.items.push(
      {
        type: "link",
        label: "User Profile",
        route: "userprofile",
        icon: "mat:dinner_dining",
      },
      {
        type: "link",
        label: "Dashboard",
        route: "dashboard",
        icon: "mat:dinner_dining",
    },{
    type: "dropdown",
      label: "Bot Developer",
      icon: "mat:settings",
      children: [
        {
          type: "link",
          label: "All Bot-Developer",
          route: "allBotDeveloper",
          icon: "mat:people",
        },
        {
          type: "link",
          label: "Add Bot-Developer",
          route: "addBotDeveloper",
          icon: "mat:people",
        },
        {
          type: "link",
          label: "Attache Bot-Developer To Projects",
          route: "addchBotDeveloperToProject",
          icon: "mat:people",
        },
      ],
    },
    {
      type: "dropdown",
        label: "Process",
        icon: "mat:settings",

        children: [
          {
            type: "link",
            label: "Delete Projects",
            route: "deleteproject",
            icon: "mat:people",
          },
          {
            type: "link",
            label: "Update Domain Data",
            route: "updatedomaindata",
            icon: "mat:people",
          },
        ],
      },
      {
        type: "link",
        label: "System test",
        route: "./users",
        icon: "mat:people",
      },
      {
        type: "link",
        label: "Create Template",
        route: "createtemplate",
        icon: "mat:people",
      },
      {
        type: "link",
        label: "System Monitor",
        route: "./users",
        icon: "mat:people",
      },
      )
    }

    /////////////////// systemadmin Role////////////////////////////

    if (user.role == "System Admin"){
      this.navigationService.items.push(
      {
        type: "link",
        label: "User Profile",
        route: "userprofile",
        icon: "mat:dinner_dining",
        breadCrumbs: ["المحتوى", "المطعم"],
      },
      {
        type: "link",
        label: "Dashboard",
        route: "dashboard",
        icon: "mat:dinner_dining",
        breadCrumbs: ["المحتوى", "المطعم"],
    },{
    type: "dropdown",
      label: "Bot Developer",
      icon: "mat:settings",

      children: [
        {
          type: "link",
          label: "All Bot-Developer",
          route: "allBotDeveloper",
          icon: "mat:people",
          breadCrumbs: ["الإعدادت", "المستخدمين"],
        },
        {
          type: "link",
          label: "Add Bot-Developer",
          route: "addBotDeveloper",
          icon: "mat:people",
          breadCrumbs: ["الإعدادت", "المستخدمين"],
        },
        {
          type: "link",
          label: "Attache Bot-Developer To Projects",
          route: "addchBotDeveloperToProject",
          icon: "mat:people",
          breadCrumbs: ["الإعدادت", "المستخدمين"],
        },
      ],
    },
    {
      type: "dropdown",
        label: "Account",
        icon: "mat:settings",

        children: [
          {
            type: "link",
            label: "All Accounts",
            route: "allcompanies",
            icon: "mat:people",
            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Create Account",
            route: "createcompanies",
            icon: "mat:people",
            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
        ],
      },
    {
      type: "dropdown",
        label: "Process",
        icon: "mat:settings",

        children: [
          {
            type: "link",
            label: "Delete Projects",
            route: "deleteproject",
            icon: "mat:people",
            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Update Domain Data",
            route: "updatedomaindata",
            icon: "mat:people",
            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
        ],
      },
      {
        type: "link",
        label: "System test",
        route: "./users",
        icon: "mat:people",
        breadCrumbs: ["الإعدادت", "المستخدمين"],
      }
      )
    }

    /////////////////// systemuser Role////////////////////////////

    if (user.role == "System User"){
      this.navigationService.items.push(

      {
        type: "link",
        label: "User Profile",
        route: "userprofile",
        icon: "mat:dinner_dining",
      },
      {
        type: "link",
        label: "Create Template",
        route: "createtemplate",
        icon: "mat:people",
      },
      {
        type: "link",
        label: "System Monitor",
        route: "./users",
        icon: "mat:people",
      },
      )
    }
}
}
