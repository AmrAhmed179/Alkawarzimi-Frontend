import { Injectable, Inject } from "@angular/core";
//import { ProjectModel } from 'app/models/project-model';
import { BehaviorSubject } from "rxjs";
//import { UserModel } from 'app/models/user-model';
import { Subscription } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { isNullOrUndefined } from "util";
//import { isEmpty } from 'rxjs/operator/isEmpty';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";

import { NavigationService } from "src/@vex/services/navigation.service";
import {
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from "src/@vex/interfaces/navigation-item.interface";
import { ProjectModel } from "src/app/core/models/project-model";
import { UserModel } from "src/app/core/models/user-model";
@Injectable({ providedIn: "root" })
export class DataService {
  public $user_bs: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(
    null
  );
  public $project_bs: BehaviorSubject<ProjectModel> =
    new BehaviorSubject<ProjectModel>(null);
  nav_project_id: string;
  subscription: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http_client: HttpClient,
    private cookieService: CookieService,
    private navigationService: NavigationService
  ) {
    // this.checkCredentials();
    this.getCurrentUserFormBE();

    this.checkStoredProjectAndPublish();
  }
  isLink = this.navigationService.isLink;
  // GET THE USER OBJECT FROM LOCAL STORAGE AND PASS IT IN user_bs
  checkCredentials() {
    //
    //let z= {"id":"60324a9386ae733684994e84","firstname":"Ahmed","lastname":"Mtaha","email":"ahmed.mtaha47@gmail.com","displayName":"Ahmed Mtaha","emailverified":false,"img":"/assets/profile/60324a9386ae733684994e84637666957160824465.png"};
    //  let z= {"id":"61bb35dd86ae731e84f9909f","firstname":"supervisor","lastname":"taha","email":"supervisor12@gmail.com","displayName":"supervisor taha","emailverified":false,"img":null,"ISRegisterInAD":false};
    //       this.cookieService.set('user', JSON.stringify(z));

    let usertest: any = this.cookieService.get("user");
    //  usertest={"id":"ffa82da0-87ed-448f-8772-4595190245eb","firstname":"ahmed","lastname":"taha","email":"ahmed.mtaha47@gmail.com","displayName":"ahmed taha","emailverified":false,"departmentId":null,"img":"/assets/profile/ffa82da0-87ed-448f-8772-4595190245eb637400948654873495.png","role":["owner"],"SLALEVELID":2};
    //  usertest =JSON.stringify(usertest);
    if (usertest != "") {
      localStorage.setItem("user", usertest);
      /// get user info and set into localStorage
      const storedUser = localStorage.getItem("user");
      console.log(
        "AUTH SERVICE - CHECK CREDENTIAL - STORED USER  ",
        storedUser
      );
      this.$user_bs.next(JSON.parse(storedUser));
    } else {
      this.signout();
    }
  }
  getCurrentUserFormBE() {
    this.http_client.get(environment.URLS.GetLoggedUserInfo).subscribe(
      (response) => {
        // debugger;

        console.log(response);
        if (response == "") {
          this.signout();
        }
        localStorage.setItem(
          "user",
          // JSON.stringify(response["output"]["user"])
          JSON.stringify(response)
        );
        /// get user info and set into localStorage
        const storedUser = localStorage.getItem("user");
        console.log(
          "Data SERVICE - CHECK CREDENTIAL - STORED USER  ",
          storedUser
        );
        this.$user_bs.next(JSON.parse(storedUser));
      },
      (error) => {
        console.log(error);
        this.signout();
      }
    );
  }
  signout() {
    console.log("RUN LOGOUT FROM data sevice ");
    localStorage.removeItem("user");
    localStorage.removeItem("project");
    localStorage.removeItem("role");
    // localStorage.clear();
    let el = this.document.getElementById("logoutLink");
    if (el != null) el.click();
    //window.location.href = '/Account/login';
    //this.router.navigate(['/Account/login']);
  }
  // RECEIVE THE the project (name, id, profile_name, trial_expired and trial_days_left) AND PUBLISHES
  projectSelected(project: ProjectModel) {
    // PUBLISH THE project
    console.log(
      "!!C-U AUTH SERVICE: I PUBLISH THE PROJECT RECEIVED FROM PROJECT COMP ",
      project
    );

    this.$project_bs.next(project);
  }
  updateRouterLink(projectId: string, navigationItems: NavigationItem[]) {
    if (projectId == null) return;

    if (navigationItems == null) navigationItems = this.navigationService.items;

    for (let i = 0; i < navigationItems.length; i++) {
      if (this.isLink(navigationItems[i])) {
        let itemLink = navigationItems[i] as NavigationLink;

        if (itemLink.externalLink) {
          itemLink.route = itemLink.route.replace("projectId", projectId);
        }
      } else {
        {
          let itemSubheading = navigationItems[i] as NavigationSubheading;
          this.updateRouterLink(projectId, itemSubheading.children);
        }
      }
    }
  }

  /**
   * // REPLACE getProjectFromLocalStorage()
   * IF THE PROJECT RETURNED FROM THE project_bs SUBSCRIPTION IS NULL
   * GOT THE PROJECT ID FROM THE URL, AND THEN (WITH PROJECT ID) THE NAME OF THE PROJECT FROM LOCAL STORAGE - (^NOTE),
   * THEN PROJECT ID AND PROJECT NAME THAT ARE PUBLISHED
   * **** THIS RESOLVE THE BUG: WHEN A PAGE IS RELOADED (BY HAND OR BY ACCESSING THE DASHBOARD BY LINK)
   *  THE PROJECT ID AND THE PROJECT NAME RETURNED FROM SUBDCRIPTION TO project_bs ARE NULL
   * **** ^NOTE: THE ITEMS PROJECT ID AND PROJECT NAME IN THE STORAGE ARE SETTED IN PROJECT-COMP
   * A SIMILAR 'WORKFLOW' IS PERFORMED IN THE AUTH.GUARD IN CASE, AFTER A CHECK FOR ID PROJECT IN THE STORAGE, THE PROJECT JSON IS NULL */

  checkStoredProjectAndPublish() {
    this.$project_bs.subscribe((prjct) => {
      console.log(
        "»> »> PROJECT-PROFILE GUARD (WF in AUTH SERV checkStoredProjectAndPublish) prjct",
        prjct
      );
      console.log("!!C-U  - 1) »»»»» AUTH SERV - PROJECT FROM SUBSCRIP", prjct);
      if (prjct === null) {
        console.log("!!C-U »»»»» AUTH SERV - PROJECT IS NULL: ", prjct);

        /**
         * !!!! NO MORE - REPLACES 'router.events.subscribe' WITH 'location.path()'
         * BECAUSE OF 'events.subscribe' THAT IS ACTIVATED FOR THE FIRST
         * TIME WHEN THE PROJECT IS NULL AND THEN IS ALWAYS CALLED EVEN IF THE  PROJECT IS DEFINED */
        this.subscription = this.router.events.subscribe((e) => {
          if (e instanceof NavigationEnd) {
            // if (this.location.path() !== '') {
            // const current_url = this.location.path()
            const current_url = e.url;
            console.log("!!C-U »»»»» AUTH SERV - CURRENT URL ", current_url);

            const url_segments = current_url.split("/");
            console.log(
              "!!C-U »»»»» AUTH SERV - CURRENT URL SEGMENTS ",
              url_segments
            );

            this.nav_project_id = url_segments[2];
            console.log(
              "!! »»»»» AUTH SERV - CURRENT URL SEGMENTS > NAVIGATION PROJECT ID: ",
              this.nav_project_id
            );
            console.log(
              "!! »»»»» AUTH SERV - CURRENT URL SEGMENTS > SEGMENT 1: ",
              url_segments[1]
            );

            /*
             * (note: the NAVIGATION PROJECT ID returned from CURRENT URL SEGMENTS is = to 'email'
             * if the user navigate to the e-mail verification page)
             * the url_segments[1] is = to 'user' instead of 'project' when the user not yet has select a project
             * (i.e. from the project list page) and go to user profile > change password
             * */
            if (
              this.nav_project_id &&
              this.nav_project_id !== "email" &&
              url_segments[1] !== "user"
            ) {
              console.log("!!C-U »»»»» QUI ENTRO ", this.nav_project_id);
              this.subscription.unsubscribe();

              const storedProjectJson = localStorage.getItem(
                this.nav_project_id
              );
              console.log(
                "!! »»»»» AUTH SERV - JSON OF STORED PROJECT: ",
                storedProjectJson
              );

              // RUN THE BELOW ONLY IF EXIST THE PROJECT JSON SAVED IN THE STORAGE
              if (storedProjectJson) {
                const storedProjectObject = JSON.parse(storedProjectJson);
                console.log(
                  "!! »»»»» AUTH SERV - OBJECT OF STORED PROJECT",
                  storedProjectObject
                );
                const project_name = storedProjectObject["name"];
                const project_profile_name =
                  storedProjectObject["profile_name"];
                const chatbotId = storedProjectObject["chatbotId"];

                console.log(
                  "!! »»»»» AUTH SERV - PROJECT NAME GET FROM STORAGE: ",
                  project_name
                );

                const project: ProjectModel = {
                  _id: this.nav_project_id,
                  //  name: project_name,
                  //profile_name: project_profile_name,
                  chatbotId: chatbotId,
                };
                console.log(
                  "!! AUTH in auth.serv  - 1) PROJECT THAT IS PUBLISHED: ",
                  project
                );
                // SE NN C'è IL PROJECT NAME COMUNQUE PUBBLICO PERCHè CON L'ID DEL PROGETTO VENGONO EFFETTUATE DIVERSE CALLBACK

                /**** ******* ******* ***** *** ** ***/

                this.$project_bs.next(storedProjectObject);

                // NOTA: AUTH GUARD ESEGUE UN CHECK DEL PROGETTO SALVATO NEL LOCAL STORAGE E SE IL PROJECT NAME è NULL DOPO AVER 'GET' IL
                // PROGETTO PER nav_project_id SET THE ID and the NAME OF THE PROJECT IN THE LOCAL STORAGE and
                // SENT THEM TO THE AUTH SERVICE THAT PUBLISHES
                // if (project_name === null) {
                //   console.log('!! »»»»» AUTH SERV - PROJECT NAME IS NULL')
                // }
              } else {
                // USE-CASE: FOR THE ID (GOT FROM URL) OF THE CURRENT PROJECT THERE IS NO THE JSON SAVED IN THE STORAGE:
                // IT IS THE CASE IN WHICH THE USER ACCESS TO A NEW PROJECT IN THE DASHBOARD BY LINKS
                // WITHOUT BEING PASSED FROM THE PROJECT LIST.
                // IF THE STORED JSON OF THE PROJECT IS NULL  IS THE AUTH-GUARD THAT RUNS A REMOTE CALLBACK TO OBTAIN THE
                // PROJECT BY ID AND THAT THEN PUBLISH IT AND SAVE IT (THE REMOTE CALLBACK IS PERFORMED IN AUTH-GUARD BECAUSE
                // IS NOT POSSIBLE TO DO IT IN THIS SERVICE (BECAUSE OF THE CIRCULAR DEPEDENCY WARNING)  )
                // tslint:disable-next-line:max-line-length
                console.log(
                  "!! AUTH WF in auth.serv - FOR THE PRJCT ID ",
                  this.nav_project_id,
                  " THERE IS NOT STORED PRJCT-JSON - SEE AUTH GUARD"
                );
                // this.projectService.getProjectById(this.nav_project_id).subscribe((prjct: any) => {

                // public anyway to immediately make the project id available to subscribers
                // the project name will be published by the auth.guard
                const project: ProjectModel = {
                  _id: this.nav_project_id,
                };
                console.log(
                  "!! AUTH in auth.serv - 2) PROJECT THAT IS PUBLISHED: ",
                  project
                );

                this.$project_bs.next(project);
              }
            }
          }
        }); // this.router.events.subscribe((e)
      }
    });
  }
  hasClickedGoToProjects() {
    this.$project_bs.next(null);
    console.log(
      '!!C-U »»»»» AUTH SERV - HAS BEEN CALLED "HAS CLICKED GOTO PROJECTS" - PUBLISH PRJCT = ',
      this.$project_bs.next(null)
    );
    localStorage.removeItem("project");
  }

  /* ===================== REPUBLISH AND RESET IN STORAGE THE (UPDATED) USER ===================== */
  // * WHEN THE USER UPGRADES HIS OWN PROFILE (NAME AND / OR SURNAME) THE USER-SERVICE
  //   SEND THE UPDATED USER OBJECT TO AUTH SERVICE (THIS COMPONENT) THAT REPUBLISH IT
  // * WHEN THE USER VERIFY HIS EMAIL THE VERIFY-EMAIL.COMP SENT UPDATED USER OBJECT
  // TO AUTH SERVICE (THIS COMPONENT) THAT REPUBLISH IT
  public publishUpdatedUser(updated_user) {
    console.log(
      "AUTH SERV - UPDATED USER OBJECT RECEIVED FROM USER.SERV or VERY-EMAIL.COM (BEFORE TO REPUBLISH IT): ",
      updated_user
    );
    // REPUBLISH THE (UPDATED) USER OBJECT
    this.$user_bs.next(updated_user);
    // RESET THE (UPDATED) USER OBJECT IN LOCAL STORAGE
    localStorage.setItem("user", JSON.stringify(updated_user));
  }

  _user_role: string;

  checkRoleForCurrentProject() {
    console.log(
      "!! »»»»» AUTH SERV - CHECK ROLE »»»»» CALLING CHECK-ROLE-FOR-CURRENT-PRJCT"
    );

    const storedProjectJson = localStorage.getItem(this.nav_project_id);
    if (storedProjectJson) {
      const storedProjectObject = JSON.parse(storedProjectJson);
      console.log(
        "!! »»»»» AUTH SERV - CHECK ROLE - OBJECT OF STORED PROJECT",
        storedProjectObject
      );

      this._user_role = storedProjectObject["role"];

      if (this._user_role) {
        if (this._user_role === "agent" || this._user_role === undefined) {
          console.log(
            "!! »»»»» AUTH SERV - CHECK ROLE (GOT FROM STORAGE) »»» ",
            this._user_role
          );

          this.router.navigate([`project/${this.nav_project_id}/unauthorized`]);
          // this.router.navigate(['/unauthorized']);
        } else {
          console.log(
            "!! »»»»» AUTH SERV - CHECK ROLE (GOT FROM STORAGE) »»» ",
            this._user_role
          );
        }
      }
    }
    //   }
    // });
  }
  signin(email: string, password: string, callback) {
    // get user data
    //this.userId = user._id
    // PUBLISH THE USER OBJECT
    //this.user_bs.next(user);
    // SET USER IN LOCAL STORAGE
    //localStorage.setItem('user', JSON.stringify(user));
  }
  getPageUrl(route: string) {
    const url_segments = route.split("/");

    let url = "";
    for (let i = 0; i < url_segments.length; i++) {
      url += url_segments[1];
      url += "/";
    }
    return url;
  }
}
