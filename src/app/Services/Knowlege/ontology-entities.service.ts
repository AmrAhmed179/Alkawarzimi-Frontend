import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Frame, VerbModel } from 'src/app/Models/ontology-model/verb';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OntologyEntitiesService {

  constructor(private http: HttpClient) { }


  public ReloadEntitesInCreation$ = new BehaviorSubject<string>(null);

  getFactCategories(projectId: string) {
    let parm = {
      projectId: projectId
    }
    return this.http.get(environment.URLS.GetFactCategories, { params: parm })
  }

  getCategory(projectId:string){
    let parm = {
      projectId: projectId
    }
    return this.http.get(environment.URLS.GetCategory, {params: parm })
  }

  getEntities(projectId:string, type:string , syn:number){
    let parm = {
      projectId: projectId,
      syn: syn,
      type: type
    }
    return this.http.get(environment.URLS.GetOntologyEntities, {params: parm })
  }

  getGeneratedFrames(projectId:string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.getGeneratedFrames, {params: parm })
  }
  testEnitiesStemes(projectId:string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.TestEnitiesStemes, {params: parm })
  }

  DeleteOntologyEntities(projectId:string, type:string , id:any){
    let body = {
      id: id,
      projectId: projectId,
      type: type
    }
    return this.http.post(environment.URLS.DeleteOntologyEntities, body)
  }

  setIsType(projectId:string, entityId:any , isType:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      isType: isType
    }
    return this.http.post(environment.URLS.setIsType, body)
  }

 setNegative (projectId:string, entityId:any , negative:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      negative: negative
    }
    return this.http.post(environment.URLS.setNegative, body)
  }
  setInformative (projectId:string, entityId:any , Informative:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      Informative: Informative
    }
    return this.http.post(environment.URLS.setInformative, body)
  }

  SetIgnoreTellAbout (projectId:string, entityId:any , ignoreTellAbout:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      ignoreTellAbout: ignoreTellAbout
    }
    return this.http.post(environment.URLS.SetIgnoreTellAbout, body)
  }

  setAmbClass (projectId:string, entityId:any , ambClass:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      ambClass: ambClass
    }
    return this.http.post(environment.URLS.setAmbClass, body)
  }

  setTriggerEntity (projectId:string, entityId:any , trigger:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      trigger: trigger
    }
    return this.http.post(environment.URLS.setTriggerEntity, body)
  }
  setTalkAboutMenu (projectId:string, entityId:any , trigger:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      trigger: trigger
    }
    return this.http.post(environment.URLS.setTalkAboutMenu, body)
  }

  setFemale(projectId:string, entityId:any , female:boolean){
    let body = {
      projectId: projectId,
      entityId: entityId,
      female: female
    }
    return this.http.post(environment.URLS.setFemale, body)
  }

  EditIsReviewed(projectId:string, entity:any){
    let body = {
      projectId: projectId,
      entity: entity,
    }
    return this.http.post(environment.URLS.EditIsReviewed, body)
  }

  SetCategory(categoryId:string, entityId:any, projectId){
    let body = {
      categoryId: categoryId,
      entityId: entityId,
      projectId: projectId,
    }
    return this.http.post(environment.URLS.SetCategory, body)
  }
  SenseEXFrame(project:string, senseId:any){
    let body = {
      project: project,
      senseId: senseId,
    }
    return this.http.post(environment.URLS.SenseEXFrame, body)
  }

  SenseEXFrameGetAny(senseId:any){
    let parm = {
      senseId: senseId,
    }
    return this.http.get(environment.URLS.SenseEXFrameGetAny, {params: parm })
  }
  getSenseFrame(senseId:any){
    let body = {
      senseId: senseId,
    }
    return this.http.post(environment.URLS.getSenseFrame, body)
  }
  setArgumentMapping(cmp:any,obj:any,sbj:any,features:any,entityId:any,projectId:any){
    let body = {
      aMapping: {
        cmp:cmp,
        obj:obj,
        sbj:sbj,
      },
      features:features,
      entityId:entityId,
      projectId:projectId
    }
    return this.http.post(environment.URLS.SetArgumentMapping, body)
  }

  useEntitie(entityId:any,projectId:any){
    let body = {
      entityId:entityId,
      projectId:projectId
    }
    return this.http.post(environment.URLS.UseEntitie, body)
  }

  replaceEntity(entityi:any,toEntityi:any, projectId:any){

    let body = {
      entity: {
          i: entityi
      },
      toEntity: {
          i: toEntityi,
          t: "c"
      },
      projectId: projectId
  }
    return this.http.post(environment.URLS.ReplaceEntity, body)
  }

  AnalyzeText(Text:any, projectId:any){
    let parm = {
      Text: Text,
      projectId: projectId,
    }
    return this.http.get(environment.URLS.AnalyzeText, {params: parm })
  }
  getSense(stemId:any){
    let parm = {
      stemId: stemId,
    }
    return this.http.get(environment.URLS.GetSense, {params: parm })
  }
  getPOSList(lang:string){
    let parm = {
      lang: lang
    }
    return this.http.get(environment.URLS.getPOSList, {params: parm })
  }
  creatOntoloyEntity(projectId:any,stemmedEntity:string,entityText:string, language:string, type:string, parentId:number,entityTextKnowTask:string){
    let body
    if(entityTextKnowTask){
       body = {
        projectId:projectId,
        entityInfo: [
          {
            stemmedEntity:stemmedEntity,
            entityText: entityText,
            language: language
          }
        ],
        _id: 0,
        parentId: parentId,
        entityType: type,
        languageIndex: 0,
        entityText:entityTextKnowTask
    }
    }
    else{
      body = {
        projectId:projectId,
        entityInfo: [
          {
            stemmedEntity:stemmedEntity,
            entityText: entityText,
            language: language
          }
        ],
        _id: 0,
        parentId: parentId,
        entityType: type,
        languageIndex: 0
    }
    }

    return this.http.post(environment.URLS.CreatOntoloyEntity, body)
  }

  getClassandProp(projectId:string){
    let parm = {
      projectId: projectId
    }
    return this.http.get(environment.URLS.getClassandProp, {params: parm })
  }

  getClasessOnly(projectId:string, type:string, syn){
    let parm = {
      projectId: projectId,
      type: type,
      syn:syn
    }
    return this.http.get(environment.URLS.GetClasessOnly, {params: parm })
  }

  getFrame(projectId:string, Verb:string){
    let parm = {
      projectId: projectId,
      Verb: Verb,
    }
    return this.http.get(environment.URLS.GetFrame, {params: parm })
  }

  getProperties(projectId:string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetProperties, {params: parm })
  }

  getAdverbEntities(projectId:string,syn, type){
    let parm = {
      projectId: projectId,
      type:type,
      syn:syn,
    }
    return this.http.get(environment.URLS.GetAdverbEntities, {params: parm })
  }

  getOntologyClassandProp(projectId:string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetOntologyClassandProp, {params: parm })
  }

  getPrepList(Language:string){
    let parm = {
      Language: Language,
    }
    return this.http.get(environment.URLS.GetPrepList, {params: parm })
  }
  propertiesIndex(projectId:string){
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.PropertiesIndex, {params: parm })
  }

  getModifiers(){
    return this.http.get(environment.URLS.GetProperties)
  }

  SaveFrame(projectId:string,sense:Frame){
     let body ={
      frame:sense,
      projectId:projectId
     }
    return this.http.post(environment.URLS.SaveFrame, body)
  }

  createVerbFrame(projectId:string,Verb:VerbModel){
     let body ={
      Verb:Verb,
      projectId:projectId
     }
    return this.http.post(environment.URLS.CreateVerbFrame, body)
  }
  DeleteVerbFrame(projectId:string,Verb:VerbModel){
     let body ={
      Verb:Verb,
      projectId:projectId
     }
    return this.http.post(environment.URLS.DeleteVerbFrame, body)
  }

  replaceSense(projectId:string,newSenseId:number,senseId:number,description:string){
     let body ={
      description:description,
      projectId:projectId,
      newSenseId:newSenseId,
      senseId:senseId,
     }
    return this.http.post(environment.URLS.ReplaceSense, body)
  }

  GetStemSense(lang:string, stem:string){
    let parm = {
      lang: lang,
      stem: stem
    }
    return this.http.get(environment.URLS.GetStemSense, {params: parm })
  }

  GetEnStem(senseId:number){
    let body = {
      senseId: senseId,
    }
    return this.http.post(environment.URLS.GetEnStem, body)
  }

  DeleteFrame(entityId:string,projectId:string,){
    let body = {
      entityId: entityId,
      projectId: projectId,
    }
    return this.http.post(environment.URLS.DeleteFrame, body)
  }

}
