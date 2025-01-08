import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEventType,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { DataService } from "./data.service";
import { map } from "rxjs";
import { PendingInvitationModel } from "src/app/core/models/pending-invitation-model";
import { ProjectUserModel } from "src/app/core/models/project-user-model";
import { UserModel } from "src/app/core/models/user-model";
import { environment } from "src/environments/environment";

@Injectable()
export class UsersService {
  public user_is_available_bs: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  public project_user_id_bs: BehaviorSubject<string> =
    new BehaviorSubject<string>("");
  public project_user_role_bs: BehaviorSubject<string> =
    new BehaviorSubject<string>("");
  public has_changed_availability_in_sidebar: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  public has_changed_availability_in_users: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(null);
  //  public userProfileImageExist: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private _dataService: DataService,
    private http_Client: HttpClient
  ) {
    this.getCurrentProject();
  }

  project: any;
  project_name: string;

  getCurrentProject() {
    console.log(
      "============ USER SERVICE - SUBSCRIBE TO CURRENT PROJ ============"
    );

    this._dataService.$project_bs.subscribe((project) => {
      this.project = project;
      if (this.project) {
        this.project_id = this.project._id;
        this.project_name = this.project.name;
        console.log(
          "-- -- >>>> 00 -> USERS SERVICE project ID from DataService service subscription  ",
          this.project._id
        );
      }
    });
  }

  /**
   * UPDATE PROJECT-USER AVAILABILITY (PUT)
   */
  UPDATE_project_userStatus = environment.URLS.UPDATE_project_userStatus;
  public updateProjectUser(
    projectId: string,
    projectUser_id: string,
    user_is_available: boolean
  ) {
    //User/UpdateProjectUserStatus
    console.log(
      "PROJECT-USER UPDATE (PUT) URL ",
      this.UPDATE_project_userStatus
    );
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = {
      projectId: projectId,
      projectUser_id: projectUser_id,
      user_available: user_is_available,
    };

    console.log("PUT REQUEST BODY ", body);
    return this.http_Client.post(this.UPDATE_project_userStatus, body, {
      headers,
    });
  }

  GET_USERS_BY_PROJECT_ID = environment.URLS.GET_USERS_BY_PROJECT_ID;
  /// ============================= GET PROJECT-USER BY CURRENT-PROJECT-ID AND CURRENT-USER-ID ============================= ///
  //User/GetUsers?projectId=
  public getProjectUsersByProjectId(
    project_id: string
  ): Observable<ProjectUserModel[]> {
    //const url = this.MONGODB_BASE_URL + user_id + '/' + project_id;

    const url = this.GET_USERS_BY_PROJECT_ID + project_id;
    console.log("GET PROJECT USERS BY PROJECT-ID & CURRENT-USER-ID URL", url);
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    //headers.append('Authorization', this.TOKEN);
    // console.log('TOKEN TO COPY ', this.TOKEN)
    return this.http_Client.get<ProjectUserModel[]>(url, { headers });
  }
  /// ================================== GET USER BY ID ================================== ///
  GET_USER_BY_PROJECT_USER_ID_URL =
    environment.URLS.GET_USER_BY_PROJECT_USER_ID;
  public getUserById(project_id, user_id): Observable<ProjectUserModel> {
    // const url = this.BASE_URL + 'users/' + user_id;
    //User/GetUsers?projectId=

    console.log(
      "!! GET USERS BY ID - URL",
      this.GET_USER_BY_PROJECT_USER_ID_URL
    );
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    const body = { ProjectID: project_id, userID: user_id };
    return this.http_Client.post<ProjectUserModel>(
      this.GET_USER_BY_PROJECT_USER_ID_URL,
      body,
      { headers }
    );
  }
  CHECK_USER_AVILBLE_URL = environment.URLS.CHECK_USER_AVILBLE;
  public checkUserAvilability(userId: string) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "text/plain; charset=utf-8");
    return this.http_Client.get(this.CHECK_USER_AVILBLE_URL + userId, {
      headers,
      responseType: "text",
    });
  }
  // ======================  PUBLISH projectUser_id AND user_available ======================
  // NOTE: THE projectUser_id AND user_available ARE PASSED FROM HOME.COMPONENT and from SIDEBAR.COMP
  public user_availability(projectUser_id: string, user_available: boolean) {
    console.log("!!! USER SERVICE - PROJECT-USER-ID ", projectUser_id);
    console.log("!!! USER SERVICE - USER AVAILABLE ", user_available);

    this.project_user_id_bs.next(projectUser_id);
    this.user_is_available_bs.next(user_available);
  }
  // ======================  PUBLISH WHEN THE SIDEBAR AVAILABLE / UNAVAILABLE BUTTON IS CLICKED  ======================
  // NOTE: USER COMP SUBSCRIBES TO has_changed_availability TO RE-RUN getAllUsersOfCurrentProject
  // WITCH UPDATE THE LIST OF THE PROJECT' MEMBER
  public availability_btn_clicked(clicked: boolean) {
    this.has_changed_availability_in_sidebar.next(clicked);
  }

  // ======================  PUBLISH WHEN THE USERS-COMP AVAILABLE / UNAVAILABLE Toggle Switch BTN IS CLICKED  ======================
  // NOTE: SIDEBAR SUBSCRIBES TO has_changed_availability TO RE-RUN getAllUsersOfCurrentProject
  // WITCH UPDATE THE LIST OF THE PROJECT' MEMBER
  public availability_switch_clicked(clicked: boolean) {
    this.has_changed_availability_in_users.next(clicked);
  }

  // ===================  PUBLISH PROJECT-USER ROLE AND CHECK THE ROLE (FOR THE CURRENT PROJECT) SAVED IN THE STORAGE ======================
  // NOTE: THE projectUser_role IS PASSED FROM HOME.COMPONENT AND FROM SIDEBAR
  // NOTE: IF THE USER ROLE STORED NOT MATCHES THE USER ROLE PUBLISHED IS RESER IN THE STORAGE YìTJE JSON PROJECT UPDATED WITH THE NEW ROLE
  project_id: string;
  USER_ROLE = "";
  public user_role(projectUser_role: string) {
    console.log(
      "!! »»»»» USER SERVICE PUBLISH THE USER-ROLE  >>",
      projectUser_role,
      "<< FOR THE PROJECT ID ",
      this.project_id
    );
    this.USER_ROLE = projectUser_role;
    // PUBLISH THE USER ROLE
    this.project_user_role_bs.next(projectUser_role);

    // COMPARE THE STORED ROLE WITH THE USER ROLE PUBLISHED
    const storedProjectJson = localStorage.getItem(this.project_id);
    if (storedProjectJson) {
      const projectObject = JSON.parse(storedProjectJson);
      const storedUserRole = projectObject["role"];
      const storedProjectName = projectObject["name"];
      const storedProjectId = projectObject["_id"];
      console.log(
        "!! »»»»» USER SERVICE USER ROLE FROM STORAGE >>",
        storedUserRole,
        "<<"
      );
      console.log(
        "!! »»»»» USER SERVICE PROJECT NAME FROM STORAGE ",
        storedProjectName
      );
      console.log(
        "!! »»»»» USER SERVICE PROJECT ID FROM STORAGE ",
        storedProjectId
      );

      if (storedUserRole !== projectUser_role) {
        console.log(
          "!! »»»»» USER SERVICE - USER ROLE STORED !!! NOT MATCHES USER ROLE PUBLISHED - RESET PROJECT IN STORAGE "
        );

        // RE-SET THE PROJECT IN THE STORAGE WITH THE UPDATED ROLE

        projectObject["role"] = projectUser_role;

        localStorage.setItem(storedProjectId, JSON.stringify(projectObject));
      }
    }
  }

  /// ================================== GET USER ACTIVITIES ================================== ///

  UPLOAD_IMG_URL = environment.URLS.UPLOAD_IMG;
  public uploadUserAvatar(file: any, user_id: string) {
    //const url ="http://localhost:49242/user/UploadImg";
    const formData = new FormData();
    formData.append(file.name, file);
    formData.append("userId", user_id);

    return this.http_Client.post(this.UPLOAD_IMG_URL, formData);
  }
  RESEND_VERIFY_EMAIL_URL = environment.URLS.RESEND_VERIFY_EMAIL;
  public resendVerifyEmail(userId, email) {
    console.log("RESEND VERIFY EMAIL URL ", this.RESEND_VERIFY_EMAIL_URL);
    const body = { userId: userId, email: email };
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    return this.http_Client.post(this.RESEND_VERIFY_EMAIL_URL, body, {
      headers,
    });
  }

  // ================== UPDATE CURRENT USER LASTNAME / FIRSTNAME ==================
  UPDATE_USER_LASTNAME_FIRSTNAME_URL =
    environment.URLS.UPDATE_USER_LASTNAME_FIRSTNAME;
  public updateCurrentUserLastnameFirstname(
    projectId: string,
    userId: string,
    user_firstname: string,
    user_lastname: string,
    callback
  ) {
    console.log(
      "UPDATE CURRENT USER (PUT) URL ",
      this.UPDATE_USER_LASTNAME_FIRSTNAME_URL
    );

    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    console.log("»»» »»» UPDATE CURRENT USER - LASTNAME ", user_lastname);

    const body = {
      projectId: projectId,
      userId: userId,
      firstname: user_firstname,
      lastname: user_lastname,
    };

    console.log("»»» »»» UPDATE CURRENT USER - BODY ", body);

    return this.http_Client
      .put(this.UPDATE_USER_LASTNAME_FIRSTNAME_URL, body, { headers })
      .subscribe((response) => {
        if (response["success"] === true) {
          callback("user successfully updated");
          const user: UserModel = response["updatedUser"];
          // SEND THE UPDATED USER OBJECT TO THE AUTH SERVICE THAT:
          // -  PUBLISHES IT AGAIN and
          // -  RESET IT IN LOCAL STORAGE
          this._dataService.publishUpdatedUser(user);
        } else {
          callback("error");
        }
      });
  }
  // ================== UPDATE CURRENT USER possword /   ==================
  CHANGE_PASSORD_URL = environment.URLS.CHANGE_PASSORD;
  public changePassword(user_id: string, old_psw: string, new_psw: string) {
    console.log("CHSNGE PSW (PUT) URL ", this.CHANGE_PASSORD_URL);

    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    const body = {
      userId: user_id,
      currentPassword: old_psw,
      newPassword: new_psw,
    };

    console.log("PUT REQUEST BODY ", body);

    return this.http_Client.post(this.CHANGE_PASSORD_URL, body, { headers });
  }

  // ================== UPDATE updateProjectUserRole User-edit-add/   ==================

  /**
   * UPDATE PROJECT-USER ROLE (PUT) */
  UPDATE_PROJECT_USER_CONFIG_URL = environment.URLS.UPDATE_PROJECT_USER_CONFIG;
  public updateProjectUserConfig(
    projectID: string,
    projectUser_id: string,
    user_role: string,
    branchId: string
  ) {
    //let url = this.LIVECHAT_BASE_URL+"User/UpdateProjectUserRole";
    // url += projectUser_id;
    console.log(
      "PROJECT-USER UPDATE (PUT) URL ",
      this.UPDATE_PROJECT_USER_CONFIG_URL
    );

    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    const body = {
      projectID: projectID,
      projectUser_id: projectUser_id,
      role: user_role,
      branchId: branchId,
    };

    console.log("PUT REQUEST BODY ", body);

    return this.http_Client.post(this.UPDATE_PROJECT_USER_CONFIG_URL, body, {
      headers,
    });
  }

  /**
   * DELETE PROJECT-USER (PUT)  */
  DELETE_PROJECT_USER_URL = environment.URLS.DELETE_PROJECT_USER;
  public deleteProjectUser(project_id: string, projectUser_id: string) {
    //User/DeleteProjectUser?projectUserId=
    console.log("PROJECT-USER DELETE URL ", this.DELETE_PROJECT_USER_URL);
    const body = {
      projectId: project_id,
      projectUserId: projectUser_id,
    };
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    return this.http_Client.post(this.DELETE_PROJECT_USER_URL, body, {
      headers,
    });
  }

  /// ================================== INVITE USER (ALIAS CREATE A MEMBER) ================================== ///
  INVITE_USER_URL = environment.URLS.INVITE_USER;
  public inviteUser(
    email: string,
    role: string,
    user_SLALEVELID: number,
    ChattingType: string,
    selectedBranchId: string
  ) {
    //  User/InviteUser
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    const body = {
      email: email,
      role: role,
      user_SLALEVELID: user_SLALEVELID,
      projectId: this.project_id,
      project_name: this.project_name,
      chattingType: ChattingType,
      branchId: selectedBranchId,
    };

    console.log("POST INVITE USER - REQUEST BODY ", body);

    //const url = this.INVITE_USER_URL;
    //  const url =  this.LIVECHAT_BASE_URL+"User/InviteUser";
    return this.http_Client.post(this.INVITE_USER_URL, body, { headers });
  }

  /// ================================== GET PENDING USERS ================================== ///
  GET_PENDING_USERS_URL = environment.URLS.GET_PENDING_USERS;
  public getPendingUsers(): Observable<PendingInvitationModel[]> {
    // const url = this.PENDING_INVITATION_URL;
    const url = this.GET_PENDING_USERS_URL + this.project_id;
    console.log("GET PENDING USERS ", url);
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http_Client.get<PendingInvitationModel[]>(url, { headers });
  }

  /// ================================== delete  Pending  Invitation ================================== ///
  DELETE_PENDING_INVITATION_URL = environment.URLS.DELETE_PENDING_INVITATION;
  public deletePendingInvitation(pendingInvitationId) {
    //User/DeletePendingInvitation
    //  const url = this.PENDING_INVITATION_URL + '/' + pendingInvitationId;
    const url = this.DELETE_PENDING_INVITATION_URL + pendingInvitationId;

    // console.log('DELETE PENDING INVITATION URL ', url);
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    return this.http_Client.delete(url, { headers });
  }

  /// ================================== RESEND EMAIL TO PENDING USERS ================================== ///
  RESEND_INVITATION_PENDINGUSER_URL =
    environment.URLS.RESEND_INVITATION_PENDINGUSER;
  public getPendingUsersByIdAndResendEmail(projectName, pendingInvitationId) {
    //const url = this.PENDING_INVITATION_URL + '/resendinvite/' + pendingInvitationId;
    //User/ResendInviteUser

    const body = {
      project_name: projectName,
      pendingInvitationId: pendingInvitationId,
    };
    console.log("GET PENDING USERS ", this.RESEND_INVITATION_PENDINGUSER_URL);
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this.http_Client.post(this.RESEND_INVITATION_PENDINGUSER_URL, body, {
      headers,
    });
    //  .map((response) => response.json());
  }

  downloadActivitiesAsCsv(queryString: string, arg1: number) {
    const body = {};
    console.log("GET PENDING USERS ", this.RESEND_INVITATION_PENDINGUSER_URL);
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this.http_Client.post(this.RESEND_INVITATION_PENDINGUSER_URL, body, {
      headers,
    });
  }
  GET_USERS_ACTIVITIES_URL = environment.URLS.GET_USERS_ACTIVITIES;
  getUsersActivities(
    chatbotId: string,
    agentId: string,
    startDate: any,
    endDate: any,
    activities: any,
    pageN: number,
    pageSize: number
  ) {
    const body = {
      chatbotId,
      agentId,
      startDate,
      endDate,
      activities,
      pageN,
      pageSize,
    };
    let url =
      this.GET_USERS_ACTIVITIES_URL +
      "?chatbotId=" +
      this.project.chatbotId +
      "&agentId=" +
      agentId +
      "&startDate=" +
      encodeURI(JSON.stringify(startDate)) +
      "&endDate=" +
      encodeURI(JSON.stringify(endDate)) +
      "&activities=" +
      activities +
      "&pageN=" +
      pageN +
      "&pageSize=" +
      pageSize;
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    // return this.http_Client.get(url);

    return this.http_Client.post(this.GET_USERS_ACTIVITIES_URL, body, {
      headers,
    });
  }
}
