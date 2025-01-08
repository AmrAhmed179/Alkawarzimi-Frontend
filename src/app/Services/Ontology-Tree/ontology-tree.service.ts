import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeResponse } from 'src/app/featuresModules/projects/build/build-dataTypes/menus/menus-info/menus-info.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OntologyTreeService {

  constructor(private http: HttpClient) { }

  getOntologyTree(projectId: string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetOntologyTree, {params: parm })
  }

  deleteNode(request){
    let body = {
    }
    return this.http.post(environment.URLS.DeleteNode,request)
  }

  updateExtention(request){
    return this.http.post(environment.URLS.updateExtention,request)
  }

  UpdateArtificialParent(request){
    return this.http.post(environment.URLS.UpdateArtificialParent,request)
  }

  DeleteSyn(request){
    return this.http.post(environment.URLS.DeleteSyn,request)
  }

  addDomainProperty(request){
    return this.http.post(environment.URLS.AddDomainProperty,request)
  }

  deleteDomainProperty(request){
    return this.http.post(environment.URLS.DeleteDomainProperty,request)
  }

  pushIndividual(request){
    return this.http.post(environment.URLS.pushIndividual,request)
  }

  pullIndividual(request){
    return this.http.post(environment.URLS.pullIndividual,request)
  }

  GetVerbInfo(request){
    return this.http.post(environment.URLS.GetVerbInfo,request)
  }

  setImplied(request){
    return this.http.post(environment.URLS.SetImplied,request)
  }
  getVerbs(projectId: string) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetVerbFram, {params: parm })
  }

  getFrameSynonyms(projectId: string, id, type) {
    let parm = {
      projectId: projectId,
      id:id,
      type:type,
    }
    return this.http.get(environment.URLS.getFrameSynonyms, {params: parm })
  }

  getDataPropertyIndex(projectId: string) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.getDataPropertyIndex, {params: parm })
  }

  getClassInfo(projectId: string,classId:string) {
    let parm = {
      projectId: projectId,
      classId: classId,
    }
    return this.http.get(environment.URLS.getClassInfo, {params: parm })
  }

  GetPropertyTreeEntities(projectId: string) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetPropertyTreeEntities, {params: parm })
  }
  getSynonyms(projectId: string,id:number, type:string) {
    let parm = {
      projectId: projectId,
      id: id,
      type: type,
    }
    return this.http.get(environment.URLS.getSynonyms, {params: parm })
  }


  CreateChildAndSibbling(payload) {

    return this.http.post(environment.URLS.CreateChildAndSibbling, payload);
  }

  CreateFromGD(payload) {
    return this.http.post(environment.URLS.CreateFromGD, payload);
  }

  replaceProperty(payload) {
    return this.http.post(environment.URLS.replaceProperty, payload);
  }

  updateOntlolgyTree(payload) {
    return this.http.post(environment.URLS.UpdateOntlolgyTree, payload);
  }

  updatePropertyTree(payload) {
    return this.http.post(environment.URLS.UpdatePropertyTree, payload);
  }

  generateOntologyIntent(payload) {
    return this.http.post(environment.URLS.GenerateOntologyIntent, payload);
  }

  createGraphDb(payload) {
    return this.http.post(environment.URLS.CreateGraphDb, payload);
  }

  updatePropertiesfromGD(payload) {
    return this.http.post(environment.URLS.updatePropertiesfromGD, payload);
  }
  cleanDomains(payload) {
    return this.http.post(environment.URLS.CleanDomains, payload);
  }
  updateSynonyms(payload) {
    return this.http.post(environment.URLS.updateSynonyms, payload);
  }
  deleteRang(payload) {
    return this.http.post(environment.URLS.deleteRang, payload);
  }
  addRang(payload) {
    return this.http.post(environment.URLS.addRang, payload);
  }
  updateQTools(payload) {
    return this.http.post(environment.URLS.updateQTools, payload);
  }
  addDomain(payload) {
    return this.http.post(environment.URLS.addDomain, payload);
  }

  deleteDomain(payload) {
    return this.http.post(environment.URLS.deleteDomain, payload);
  }
  updateDomains(payload) {
    return this.http.post(environment.URLS.UpdateDomains, payload);
  }

  deletePropertyNode(payload) {
    return this.http.post(environment.URLS.deletePropertyNode, payload);
  }





  getVerbInfo(payload) {
    return this.http.post(`https://alkhwarizmi.xyz/VerbFrames/GetVerbInfo`, payload);
  }

  getClassProp(workspace_id: string) {
    return this.http.get(`https://alkhwarizmi.xyz/Entities/getClassandProp?projectId=${workspace_id}`);
  }

  //https://alkhwarizmi.xyz/Entities/setAmbClass
  //https://alkhwarizmi.xyz/OntologyTree/updateExtention
  //https://alkhwarizmi.xyz/OntologyTree/UpdateArtificialParent

  setAmbClass(payload) {
    return this.http.post(`https://alkhwarizmi.xyz/Entities/setAmbClass`, payload);
  }

  updateExtension(payload) {
    return this.http.post(`https://alkhwarizmi.xyz/OntologyTree/updateExtention`, payload);
  }

  updateArtificialParent(payload) {
    return this.http.post(`https://alkhwarizmi.xyz/OntologyTree/UpdateArtificialParent`, payload);
  }

  //https://alkhwarizmi.xyz/Entities/getClassInfo?projectId=296&classId=11027
  //https://alkhwarizmi.xyz/DataProperty/index?projectId=294
  getDataProperty(workspace_id: string) {
    return this.http.get(`https://alkhwarizmi.xyz/DataProperty/index?projectId=${workspace_id}`);
  }

}
