import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeTasksService {

  constructor(private http: HttpClient) { }

  GetknowledgeIntent(projectId:any, PageIndex, type){
      let params={
        projectId:projectId,
        type:type,
        PageIndex:PageIndex,
      }
      return this.http.get(environment.URLS.GetknowledgeIntentKnowTasks, {params:params})
    }

  getExtractEntities(projectId:any, text){
    let params={
      projectId:projectId,
      text:text,
    }
    return this.http.get(environment.URLS.GetExtractEntities, {params:params})
  }

  saveExample(body){
    return this.http.post(environment.URLS.SaveExample, body)
  }
   deleteExample(body){
    return this.http.post(environment.URLS.DeleteExampleKnowTasks, body)
  }
   createExample(body){
    return this.http.post(environment.URLS.CreateExampleKnowTasks, body)
  }
  editIntent(body){
    return this.http.post(environment.URLS.EditIntent, body)
  }
  deleteTask(body){
    return this.http.post(environment.URLS.DeleteTask, body)
  }
  createIntent(body){
    return this.http.post(environment.URLS.CreateIntent, body)
  }

  changeResponseMode(body){
    return this.http.post(environment.URLS.ChangeResponseMode, body)
  }

  consistencyCheck(projectId:any, removeEntities, problem){
    let params={
      projectId:projectId,
      removeEntities:removeEntities,
      problem:problem,
    }
    return this.http.get(environment.URLS.ConsistencyCheck, {params:params})
  }
}
