import { Component } from "@angular/core";
import { NavigationService } from "src/@vex/services/navigation.service";
import { DataService } from "src/app/core/services/data.service";
import { combineLatest, forkJoin, map, skip } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  template: ` <router-outlet></router-outlet> `,
})
export class ProjectRoutelet {

  jscode: string
  script = document.createElement('script');
  chatBotId: number;
  animatedIcon: number;

  constructor(
    private navigationService: NavigationService,
    private _dataSerivce: DataService,
    private route: ActivatedRoute
  ) {
    combineLatest(
      _dataSerivce.$project_bs.asObservable(),
      _dataSerivce.$user_bs.asObservable()
    ).subscribe(([project, user]) => {
      this.navigationService.items = [];
      if (project && user) {
        this.createNavigation(user, project._id);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
    })
    if (this.chatBotId == 147 || this.chatBotId == 150 || this.chatBotId == 171 || this.chatBotId == 242 || this.chatBotId == 172 || this.chatBotId == 225) {
      this.animatedIcon = 0;
    }
    else {
      this.animatedIcon = 1
    }
    this.jscode = `(function (w, d, s, o, f, js, fjs) {
      w['alkawarizmi'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
      js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
      js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'myBbot', 'https://orchestrator.alkhwarizmi.xyz/plugins/alkhwarizmi.sdk.1.1.0.js'));
  myBbot('init', { id: ${this.chatBotId}, title: "", draggable: true, animatedIcon: ${this.animatedIcon} });`
    this.script.type = 'text/javascript';
    this.script.text = this.jscode;
    document.body.appendChild(this.script);
  }

  createNavigation(user, projectId: string) {
    this.navigationService.items = [];
    this.navigationService.items.push(

      {
        type: "dropdown",
        label: "Build",
        icon: "mat:format_align_justify",

        children: [
          {
            type: "link",
            label: "Tasks",
            route: "./home",
            icon: "",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Tasks"],
          },
          {
            type: "link",
            label: "Data Type",
            route: "./dataTypes/entities",
            icon: "",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Data Types", "My Entities"],
          },
          {
            type: "link",
            label: "Variables",
            route: "./variables",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Variables"],
          },
          {
            type: "link",
            label: "Services",
            route: "./servicesSet",
            //icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Services", "Set"],
          },
          {
            type: "link",
            label: "Triggered Tasks",
            route: "./TriggeredTasks",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Validation",
            route: "./users",
            //icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
        ],
      },
      {
        type: "dropdown",
        label: "Knowledge",
        icon: "mat:remove_red_eye",

        children: [
          {
            type: "link",
            label: "Tempelate",
            route: "./users",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Annotation",
            route: "./users",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Ontology Entities",
            route: "./knowledge",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["الإعدادت", "المستخدمين"],
          },
          {
            type: "link",
            label: "Ontology Tree",
            route: "./ontologyTree",
            //  icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Ontology", "Ontology Tree"],
          },
          {
            type: "link",
            label: "knowledge Graph",
            route: "./knowledgeGraph",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["knowledge Graph"],
          },
          {
            type: "link",
            label: "knowledge Tasks",
            route: "./KnowledgeTasks",
            // icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Knowledge Tasks"],
          },
          {
            type: "link",
            label: "Problem Tasks",
            route: "./users",
            //icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Problem Tasks"],
          },
          {
            type: "link",
            label: "Language Tools",
            route: "./languageTools",
            //icon: "mat:people",
            routerLinkActiveOptions: { exact: true },

            breadCrumbs: ["Tools", "Language"],
          },
        ],
      },
      {
        type: "link",
        label: "Test",
        route: "test",
        icon: "mat:build",
        routerLinkActiveOptions: { exact: true },

        breadCrumbs: ["Test"],
      },
      {
        type: "link",
        label: "Integration",
        route: "integrations",
        icon: "mat:wifi_tethering",
        routerLinkActiveOptions: { exact: true },
        breadCrumbs: ["المحتوى", "المطعم"],
      },

      {
        type: "dropdown",
        label: "Analytics",
        icon: "mat:bar_chart",
        children: [
          {
            type: "link",
            label: "Conversations",
            route: "./Analytic",
            // icon: "mat:bar_chart",
            routerLinkActiveOptions: { exact: true },
            breadCrumbs: ["المحتوى", "المطعم"],
          },
          {
            type: "link",
            label: "Survey",
            route: "./SharedSurvey",
            //icon: "mat:star_rate",
            routerLinkActiveOptions: { exact: true },
            breadCrumbs: ["home", "Survey"],
          },
        ]
      },

      {
        type: "link",
        label: "Widget",
        route: "./widget-set-up",
        icon: "mat:table_chart",
        breadCrumbs: ["الإعدادت", "المستخدمين"],
      }

    )
    this.navigationService.triggerItemsChange();
  }
  // createNavigation(user, projectId: string) {
  //   debugger;
  //   this.navigationService.items = [];

  //   if (user.role == "sysadmin") {
  //     this.navigationService.items.push({
  //       type: "link",
  //       label: "home",
  //       route: "./home",
  //       icon: "mat:home",
  //       routerLinkActiveOptions: { exact: true },
  //       breadCrumbs: ["الرئيسية"],
  //     });

  //     return;
  //   }
  //   this.navigationService.items.push({
  //     type: "link",
  //     label: "home",
  //     route: "./home",
  //     icon: "mat:home",
  //     routerLinkActiveOptions: { exact: true },
  //     breadCrumbs: ["الرئيسية"],
  //   });

  //   if (
  //     user.role == "owner" ||
  //     user.role == "admin" ||
  //     user.role == "supervisor"
  //   ) {
  //     this.navigationService.items.push({
  //       type: "subheading",
  //       label: "content",
  //       children: [
  //         {
  //           type: "link",
  //           label: "restaurant",
  //           route: "./restaurant/brandInfo",
  //           icon: "mat:dinner_dining",
  //           breadCrumbs: ["المحتوى", "المطعم"],
  //         },
  //         {
  //           type: "link",
  //           label: "productsAndOffers",
  //           route: "./products",
  //           icon: "mat:category",
  //           breadCrumbs: ["المحتوى", "المنتجات والعروض"],
  //         },
  //         {
  //           type: "link",
  //           label: "chatBotContent",
  //           route: "./chatbot-template/botVariable",
  //           icon: "mat:text_snippet",
  //           breadCrumbs: ["المحتوى", "محتوى الشاتبوت"],
  //         },
  //       ],
  //     });
  //   }

  //   if (
  //     user.role == "owner" ||
  //     user.role == "admin" ||
  //     user.role == "supervisor" ||
  //     user.role == "branchmanager" ||
  //     user.role == "kitchenmanager" ||
  //     user.role == "ordermanager"
  //   ) {
  //     this.navigationService.items.push({
  //       type: "subheading",
  //       label: "management",
  //       children: [
  //         {
  //           type: "link",
  //           label: "orderM",
  //           route: "./orders/recentorder",
  //           icon: "mat:shopping_cart",
  //           breadCrumbs: ["الإدارة", "إدارة الطلبات"],
  //         },
  //         {
  //           type: "link",
  //           label: "shippingM",
  //           route: "./getting-started",
  //           icon: "mat:local_shipping",
  //           breadCrumbs: ["الإدارة", "إدارة التوصيل"],
  //         },
  //         {
  //           type: "link",
  //           label: "reportAnalytical",
  //           route: "./reportAnalytical/overview",
  //           icon: "mat:legend_toggle",
  //           breadCrumbs: ["الإدارة", "التحليلات والتقارير"],
  //         },
  //       ],
  //     });
  //   }

  //   if (
  //     user.role == "owner" ||
  //     user.role == "admin" ||
  //     user.role == "supervisor" ||
  //     user.role == "branchmanager" ||
  //     user.role == "agent"
  //   ) {
  //     this.navigationService.items.push({
  //       type: "subheading",
  //       label: "support",
  //       children: [
  //         {
  //           type: "link",
  //           label: "chat",
  //           route: "/" + projectId + "/AgentChat",
  //           externalLink: true,
  //           icon: "mat:support_agent",
  //           breadCrumbs: ["الدعم", "المحادثة"],
  //         },
  //       ],
  //     });
  //   }
  //   if (
  //     user.role == "owner" ||
  //     user.role == "admin" ||
  //     user.role == "supervisor"
  //   ) {
  //     this.navigationService.items.push({
  //       type: "subheading",
  //       label: "marketing",
  //       children: [
  //         {
  //           type: "link",
  //           label: "discountCoupons",
  //           route: "./coupons",
  //           icon: "mat:discount",
  //           breadCrumbs: ["التسويق", "كوبونات الخصم"],
  //         },

  //         {
  //           type: "link",
  //           label: "adCampaign",
  //           route: "./campaigns/adcampaigns",
  //           icon: "mat:campaign",
  //           breadCrumbs: ["التسويق", "الحملات الإعلانية"],
  //         },

  //         {
  //           type: "link",
  //           label: "targetGroup",
  //           route: "./campaigns/targetGroups",
  //           icon: "mat:group",
  //           breadCrumbs: ["marketing", "targetGroup"],
  //         },
  //       ],
  //     });
  //   }

  //   if (
  //     user.role == "owner" ||
  //     user.role == "admin" ||
  //     user.role == "supervisor"
  //   ) {
  //     this.navigationService.items.push({
  //       type: "dropdown",
  //       label: "settings",
  //       icon: "mat:settings",

  //       children: [
  //         {
  //           type: "link",
  //           label: "الربط مع الواتساب",
  //           route: "./connectWhatsapp",
  //           icon: "mat:cable",
  //           breadCrumbs: ["الإعدادت", "الربط مع الواتساب"],
  //         },
  //         {
  //           type: "link",
  //           label: "employees",
  //           route: "./users",
  //           icon: "mat:people",
  //           breadCrumbs: ["الإعدادت", "افراد الاسرة"],
  //         },
  //         {
  //           type: "link",
  //           label: "workingHours",
  //           route: "./hours",
  //           icon: "mat:watch",
  //           breadCrumbs: ["الإعدادت", "ساعات العمل"],
  //         },
  //         {
  //           type: "link",
  //           label: "projectSettings",
  //           route: "./project-settings/general",
  //           icon: "mat:settings",
  //           breadCrumbs: ["الإعدادت", "ضبط المشروع"],
  //         },
  //       ],
  //     });
  //   }
  //   this.navigationService.triggerItemsChange();
  // }

  ngOnDestroy(): void {
    location.reload();

  }
}
