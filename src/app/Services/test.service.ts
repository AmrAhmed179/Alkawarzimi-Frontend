import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http:HttpClient) { }

  getPredictTree(Text:string,projectId:string,Mode:string){
    let parm = {
      Text:Text,
      projectId:projectId,
      Mode:Mode,
    }
    return this.http.get(environment.URLS.GetPredictTree,{params:parm})
  }
  getPatternMatch(Text:string,projectId:string){
    let parm = {
      Text:Text,
      projectId:projectId,
    }
    return this.http.get(environment.URLS.GetMatchPattern,{params:parm})
  }

  getِAllEntities(projectId:string){
    let parm = {
      projectId:projectId,
    }
    return this.http.get(environment.URLS.GetِAllEntities,{params:parm})
  }
  getِAllGeneratedEntities(projectId:string){
    let parm = {
      projectId:projectId,
    }
    return this.http.get(environment.URLS.GetِAllGeneratedEntities,{params:parm})
  }
}
