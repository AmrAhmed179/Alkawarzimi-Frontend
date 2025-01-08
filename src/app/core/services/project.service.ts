import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { BehaviorSubject } from "rxjs";
import { DataService } from "./data.service";
import {
  ProjectModel,
  ProjectSettings,
  SLALevel,
  TimeOuts,
} from "src/app/core/models/project-model";
import { environment } from "src/environments/environment";

// declare var jquery: any;
// declare var $: any;
@Injectable()
export class ProjectService {
  projectID: string;

  constructor(
    private http_client: HttpClient,
    private _dataService: DataService
  ) {}

  getCurrentProject() {
    console.log(
      "============ PROJECT SERVICE - SUBSCRIBE TO CURRENT PROJ ============"
    );
    // tslint:disable-next-line:no-
    //
    this._dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.projectID = project._id;
        console.log(
          "-- -- >>>> 00 -> PROJECT SERVICE project ID from AUTH service subscription ",
          this.projectID
        );
      }
    });
  }
  /** ******************************************** HTTP CLIENT VERSION ******************************************** */
  GET_PROJECTS_URL = environment.URLS.GET_PROJECTS;
  /* READ (GET ALL PROJECTS) */

  public getCurrencyList(): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    const url = environment.URLS.getCurrencyList;
    return this.http_client.get<any>(url, { headers });
  }
  public getProjects(currentUserID): Observable<ProjectModel[]> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    const url = this.GET_PROJECTS_URL + currentUserID;
    return this.http_client.get<ProjectModel[]>(url, { headers });
  }

  public myAvailabilityCount: BehaviorSubject<number> =
    new BehaviorSubject<number>(null);

  countOfMyAvailability(numOfMyAvailability: number) {
    console.log(
      "============ PROJECT SERVICE - countOfMyAvailability ",
      numOfMyAvailability
    );
    this.myAvailabilityCount.next(numOfMyAvailability);
  }

  /**
   * READ DETAIL (GET PROJECT BY PROJECT ID)
   * @param id
   */
  GET_PROJECT_BY_PROJECT_ID_URL = environment.URLS.GET_PROJECT_BY_PROJECT_ID;
  public getProjectById(id: string): Observable<ProjectModel> {
    let url = this.GET_PROJECT_BY_PROJECT_ID_URL + id;
    console.log("!!! GET PROJECT BY ID URL", url);

    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http_client.get<ProjectModel>(url, { headers });
  }
  /**
   * CREATE (POST) THE PROJECT AND AT THE SAME TIME CREATE THE PROJECT-USER IN THE RELATIONAL TABLE
   * @param name
   * @param id_user
   */
  CREATE_PROJECT_URL = environment.URLS.CREATE_PROJECT;

  public addProject(name: string, currentUserID: string) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    //headers.append('Authorization', this.TOKEN);
    //const options = new RequestOptions({ headers });

    // , 'id_user': this.currentUserID
    const body = {
      name: name,
      userId: currentUserID,
    };

    console.log("ADD PROJECT POST REQUEST BODY ", body);

    return this.http_client.post(this.CREATE_PROJECT_URL, body, { headers });
  }
  // public addProject(
  //   name: string,
  //   chatbotId: string,
  //   categoryName: string,
  //   currentUserID: string
  // ) {
  //   const headers = new HttpHeaders();
  //   headers.append("Accept", "application/json");
  //   headers.append("Content-type", "application/json");
  //   //headers.append('Authorization', this.TOKEN);
  //   //const options = new RequestOptions({ headers });

  //   // , 'id_user': this.currentUserID
  //   const body = {
  //     name: name,
  //     chatbotId: chatbotId,
  //     categoryName: categoryName,
  //     userId: currentUserID,
  //   };

  //   console.log("ADD PROJECT POST REQUEST BODY ", body);

  //   return this.http_client.post(this.CREATE_PROJECT_URL, body, { headers });
  // }

  Ondeleteproject(projectId: string) {
    const url = environment.URLS.Ondeleteproject;
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = {
      projectId: projectId,
    };
    return this.http_client.post(url, body, {
      headers,
    });
  }

  public updateProjectName(
    projectId: string,
    projectName: string,
    settings: ProjectSettings
  ) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    const body = {
      projectId: projectId,
      name: projectName,
      settings: settings,
    };
    return this.http_client.post(environment.URLS.UPDATE_PROJECT_NAME, body, {
      headers,
    });
  }

  public updateProjectSetting(projectId: string, settings: ProjectSettings) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");

    const body = {
      projectId: projectId,
      settings: settings,
    };

    return this.http_client.post(
      environment.URLS.UPDATE_PROJECT_Settings,
      body,
      {
        headers,
      }
    );
  }

  UPDATE_PROJECT_SLA_LEVELS_URL = environment.URLS.UPDATE_PROJECT_SLA_LEVELS;
  public updateProjectSLALevels(projectId: string, SLALevels: SLALevel[]) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId, SLALevels: SLALevels };
    console.log("Update PROJECT SLALevels POST REQUEST BODY ", body);
    return this.http_client.post(this.UPDATE_PROJECT_SLA_LEVELS_URL, body, {
      headers,
    });
  }
  ADD_PROJECT_SLALEVEL_URL = environment.URLS.ADD_PROJECT_SLALEVEL;
  public addProjectSLALevel(projectId: string, SLA_Level: SLALevel) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId, SLA_Level: SLA_Level };
    console.log("ADD PROJECT SLALevel POST REQUEST BODY ", body);
    return this.http_client.post(this.ADD_PROJECT_SLALEVEL_URL, body, {
      headers,
    });
  }
  EDIT_PROJECT_SLALEVEL_URL = environment.URLS.EDIT_PROJECT_SLALEVEL;
  public editProjectSLALevel(projectId: string, SLA_Level: SLALevel) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId, SLA_Level: SLA_Level };
    console.log("Edit PROJECT SLALevel POST REQUEST BODY ", body);
    return this.http_client.post(this.EDIT_PROJECT_SLALEVEL_URL, body, {
      headers,
    });
  }
  DELETE_PROJECT_SLALEVEL_URL = environment.URLS.DELETE_PROJECT_SLALEVEL;
  public deleteProjectSLALevel(projectId: string, SLA_Level: SLALevel) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId, SLA_Level: SLA_Level };
    console.log("Delete PROJECT SLALevel POST REQUEST BODY ", body);
    return this.http_client.post(this.DELETE_PROJECT_SLALEVEL_URL, body, {
      headers,
    });
  }
  UPDATE_PROJECT_MIN_UNSERVED_QUEUE_URL =
    environment.URLS.UPDATE_PROJECT_MIN_UNSERVED_QUEUE;
  public updateProjectMinUnservedQueue(
    projectId: string,
    MinUnservedQueue: number
  ) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId, MinUnservedQueue: MinUnservedQueue };
    console.log("Delete PROJECT SLALevel POST REQUEST BODY ", body);
    return this.http_client.post(
      this.UPDATE_PROJECT_MIN_UNSERVED_QUEUE_URL,
      body,
      {
        headers,
      }
    );
  }
  DELETE_PROJECT_URL = environment.URLS.DELETE_PROJECT;
  public deleteProject(projectId: string) {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    const body = { projectId: projectId };
    console.log("Delete  PROJECT  POST REQUEST BODY ", body);

    return this.http_client.post(this.DELETE_PROJECT_URL, body, { headers });
  }
  /// ================ UPDATE OPERATING HOURS ====================== ///
  UPDATE_PROJECT_OPERATION_HOURS_URL =
    environment.URLS.UPDATE_PROJECT_OPERATION_HOURS;
  public updateProjectOperatingHours(model: any): Observable<ProjectModel[]> {
    console.log(
      "»»»» »»»» UPDATE PROJECT OPERATING HOURS ",
      this.UPDATE_PROJECT_OPERATION_HOURS_URL
    );
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    console.log("UPDATE PROJECT OPERATING HOURS PUT REQUEST BODY ", model);
    return this.http_client.post<ProjectModel[]>(
      this.UPDATE_PROJECT_OPERATION_HOURS_URL,
      model,
      { headers }
    );
  }

  /// ================ TimeOuts ====================== ///
  getTimeOuts(projectId: string): Observable<TimeOuts> {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    let postTimeOutsUrl =
      environment.URLS.BASE_URL + "Api/Projects/" + projectId + "/TimeOuts";
    return this.http_client.get<TimeOuts>(postTimeOutsUrl, {
      headers,
    });
  }
  createTimeOuts(projectId: string, timeOuts: TimeOuts): Observable<TimeOuts> {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    let postTimeOutsUrl = environment.URLS.TimeOuts + projectId + "/TimeOuts";
    console.log("POST REQUEST BODY ", timeOuts);
    return this.http_client.post<TimeOuts>(postTimeOutsUrl, timeOuts, {
      headers,
    });
  }
  updateTimeOuts(projectId: string, timeOuts: TimeOuts): Observable<TimeOuts> {
    const headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    headers.append("Content-type", "application/json");
    let postTimeOutsUrl = environment.URLS.TimeOuts + projectId + "/TimeOuts";
    console.log("POST REQUEST BODY ", timeOuts);
    return this.http_client.put<TimeOuts>(postTimeOutsUrl, timeOuts, {
      headers,
    });
  }
}
