import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { addedEntityAI } from '../Models/ai-entity-models/ai-entity';

@Injectable({
  providedIn: 'root'
})
export class EntityAiService {

 constructor(private http:HttpClient) { }
 getClassesAndIndividual(text:string){
  const formData = new FormData();
  formData.append('text', text);
  return this.http.post(environment.URLS.AIEntityBaseUrl+"webhook/ling/get_classes_individuals",formData)
 }
 getFrames(text:string){
  const formData = new FormData();
  formData.append('text', text);
  return this.http.post(environment.URLS.AIEntityBaseUrl+"webhook/ling/get_frames",formData)
 }

 addEntitiesAi(entities:addedEntityAI[],projectId:string ){
  var body = {
    entities:entities,
    projectId:projectId,
  }
  return this.http.post(environment.URLS.BaseUrl+"Entities/CreateAIEntities",body)
 }
}
