import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RagKnowledgeBaseService {

  indexStaus$ = new BehaviorSubject<any>(null)
  constructor(private http:HttpClient) { }
  getAllDocuments(body){
    return this.http.post(environment.URLS.GetAllDocuments,body)
  }
  get_Doucment_content(body){
    return this.http.post(environment.URLS.get_content,body)
  }
   get_Doucment_chunks(body){
    return this.http.post(environment.URLS.get_chunks,body)
  }
  delete_document(body){
    return this.http.post(environment.URLS.delete_document,body)
  }
  createIndex(body){
     return this.http.post(environment.URLS.Createindex,body)
  }
  get_index_status(body){
     return this.http.post(environment.URLS.get_index_status,body)
  }
  getConfigs(body){
     return this.http.post(environment.URLS.get_configs,body)
  }
  save_configs(body){
     return this.http.post(environment.URLS.save_configs,body)
  }

  indexStaus(){
    return this.indexStaus$.asObservable()
  }
}
