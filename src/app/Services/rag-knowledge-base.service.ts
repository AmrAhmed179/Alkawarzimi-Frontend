import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RagKnowledgeBaseService {

  indexStaus$ = new BehaviorSubject<any>(null)
  constructor(private http:HttpClient) { }
  getAllDocuments(chatbotId,projectId){
    const params = {
      chatbotId:chatbotId,
       projectId:projectId
    }
    return this.http.get(environment.URLS.GetAllDocuments , {params:params})
  }
  get_Doucment_content(body){
    return this.http.post(environment.URLS.get_content,body)
  }
   get_Doucment_chunks(chatbotId,projectId,selectedDoc_uuid,type,pageNumber){
    const params = {
      chatbotId:chatbotId,
      projectId:projectId,
      doc_uuid:selectedDoc_uuid,
      type:type,
      pageNumber:pageNumber,
    }
    return this.http.get(environment.URLS.get_chunks,{params:params})
  }
  delete_document(chatbotId, _id, type, plainText){
   const params = {
      chatbotId:chatbotId,
       _id:_id,
       type:type,
       plainText:plainText,
    }
    return this.http.delete(environment.URLS.delete_document,{ params:params})
  }
  createIndex(body){
     return this.http.post(environment.URLS.Createindex,body)
  }
  cancelIndex(body){
     return this.http.post(environment.URLS.cancel_index,body)
  }
  get_index_status(body){
     return this.http.post(environment.URLS.get_index_status,body,{
      headers: new HttpHeaders({ skipLoader: 'true' })
     })
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

  uploadRagResource(item: any) {
   const formData = new FormData();
  // Main file
  formData.append('file', item, item.name);

  // Additional metadata
  formData.append('chatBotId', item.chatBotId);
  formData.append('projectId', item.projectId);
  formData.append('type', item.PlainTextOrDocument);
  formData.append("content", encodeURIComponent(item.fileContent));

  if(item.url){
    formData.append("url", encodeURIComponent(item.url));
  }
  else{
    formData.append("url", encodeURIComponent(''));
  }


  formData.append('reader', JSON.stringify(item.reader)); // send as JSON string
  formData.append('chunker', JSON.stringify(item.chunker)); // send as JSON string

  return this.http.post(environment.URLS.UplaodRagDocument, formData);
  }
getDefaultReader(){
    return {name:'Default'}
  }
getDefaultchunker(){
    return {
        name : "Token",
        tokens : 250,
        overlap : 50
    }
  }
}
