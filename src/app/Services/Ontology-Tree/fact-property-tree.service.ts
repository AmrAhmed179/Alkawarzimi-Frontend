import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactPropertyTreeService {

  constructor(private http: HttpClient) { }

  getFactProperty(projectId: string,entityId:number){
    let parm = {
      projectId: projectId,
      entityId: entityId,
    }
    return this.http.get(environment.URLS.GetFactProperty, {params: parm })
  }

  propertiesIndex(projectId: string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.PropertiesIdex, {params: parm })
  }

  saveLinkedArg(body){
    return this.http.post(environment.URLS.SaveLinkedArg, body)
  }
  deleteFrameFactProperty(body){
    return this.http.post(environment.URLS.DeleteFrameFactProperty, body)
  }
  setFactProperty(body){
    return this.http.post(environment.URLS.SetFactProperty, body)
  }

  SetCompoundFact(body){
    return this.http.post(environment.URLS.SetCompoundFact, body)
  }
  updateFactProperty(body){
    return this.http.post(environment.URLS.updateFactProperty, body)
  }
  updateFactTree(body){
    return this.http.post(environment.URLS.updateFactTree, body)
  }
  deAttachPropertyToFrame(body){
    return this.http.post(environment.URLS.DeAttachPropertyToFrame, body)
  }
  attachPropertyToFrame(body){
    return this.http.post(environment.URLS.AttachPropertyToFrame, body)
  }

  setWithExample(body){
    return this.http.post(environment.URLS.SetWithExample, body)
  }

  createExample(body){
    return this.http.post(environment.URLS.CreateExampleFact, body)
  }

  deleteExampleFact(body){
    return this.http.post(environment.URLS.DeleteExampleFact, body)
  }
  delinkIntent(body){
    return this.http.post(environment.URLS.DelinkIntent, body)
  }

  linkIntent(body){
    return this.http.post(environment.URLS.LinkIntent, body)
  }
  getExamples(intentId:string,projectId:string){
    let parm = {
      workspace_id: projectId,
      intentId: intentId,
    }
    return this.http.get(environment.URLS.GetExamples, {params: parm })
  }

  getEntities(type:string,projectId:string, syn){
    let parm = {
      projectId: projectId,
      type: type,
      syn: syn
    }
    return this.http.get(environment.URLS.GetEntitiesInOntologyIntents, {params: parm })
  }

  CorpusIndexIntents(type:string,projectId:string, page){
    let parm = {
      projectId: projectId,
      type: type,
      page: page
    }
    return this.http.get(environment.URLS.CorpusIndexIntents, {params: parm })
  }

  factsAsHTML(projectId:string, name){
    let parm = {
      projectId: projectId,
      name: name
    }
    return this.http.get(environment.URLS.FactsAsHTML, {params: parm , responseType: 'blob' as 'json'})
  }
  errorHTML(projectId:string, name){
    let parm = {
      projectId: projectId,
      name: name
    }
    return this.http.get(environment.URLS.ErrorHTML, {params: parm, responseType: 'blob' as 'json' } )
  }

  factsAsTable(projectId:string, name){
    let parm = {
      projectId: projectId,
      name: name
    }
    return this.http.get(environment.URLS.FactsAsTable, {params: parm , responseType: 'blob' as 'json'})
  }
}
