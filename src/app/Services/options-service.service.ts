import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectOptionsModel } from '../core/models/options-model';

@Injectable({
  providedIn: 'root'
})
export class OptionsServiceService {

  constructor(private http: HttpClient) { }

  public projectOptions$ = new BehaviorSubject<ProjectOptionsModel>(null);
  public selectedLang$ = new BehaviorSubject<string>(null);
  public languages$ = new BehaviorSubject<string[]>(null);

  getProjectLangAndName(projectId) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetProjectLang, { params: parm })
  }
  getProjectOptions(projectId) {
    return this.http.post(environment.URLS.GetProjectOptions, { projectId: projectId })
  }

  getEntityClassAndProp(projectId) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetEntityClassAndProp, { params: parm })
  }

  GetStaticResponse(projectId) {
    return this.http.post(environment.URLS.GetStaticResponse, { projectId: projectId })
  }

  SaveStaticResponses(staticResponse: any) {
    return this.http.post(environment.URLS.SaveStaticResponses, staticResponse)
  }

  SaveProjectOptions(projectOptions: any) {
    return this.http.post(environment.URLS.SaveProjectOptions, { options: projectOptions })
  }

  getAllProjects() {
    debugger
    return this.http.get(environment.URLS.GetAllProjects)
  }

  DeleteProject(id) {
    return this.http.post(environment.URLS.DeleteProject + id, {})
  }
  DuplicateProject(srcProjectId) {
    return this.http.post(environment.URLS.DuplicateProject, { srcProjectId: srcProjectId })
  }

  EditProject(projectDetails, id) {
    return this.http.post(environment.URLS.EditProject + id, projectDetails)
  }

  NluTrain(projectId) {
    return this.http.post(environment.URLS.NluTrain, { projectId })
  }

  NluReload(projectId) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.NluReload, { params: parm })
  }

  CreateWorkSpace(project) {
    return this.http.post(environment.URLS.CreateWorkSpace, project)
  }
  //////////////// Integeration/////////////////////

  getIntegrationIndex(workspace_id) {
    let parm = {
      workspace_id: workspace_id,
    }
    return this.http.get(environment.URLS.GetIntegrationIndex, { params: parm })
  }
  saveWhats(whatsForm) {
    return this.http.post(environment.URLS.SaveWhatsapp, { whatsapp: whatsForm })
  }
  saveTwitter(twiter) {
    return this.http.post(environment.URLS.SaveTwitterapp, { twitterApp: twiter })
  }
  saveFacebookMessanger(messanger) {
    return this.http.post(environment.URLS.SaveWhatsapp, messanger)
  }


}

