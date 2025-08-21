import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../featuresModules/projects/Ai-build-veba-Knowledge-Base/configes/config.service';

@Injectable({
  providedIn: 'root'
})
export class RagKnowledgeBaseService {

  resorceUrl
  ragUrl
  indexStaus$ = new BehaviorSubject<any>(null)
  constructor(private http:HttpClient, private configService: ConfigService) {
     this.resorceUrl = configService.resourceMangmentUrl
     this.ragUrl = configService.RageUrl
   }
  getAllDocuments(chatbotId,projectId){
    const params = {
      chatbotId:chatbotId,
       projectId:projectId
    }
    return this.http.get( `${this.resorceUrl}ResourceHandler/GetDocuments` , {params:params})
  }
  get_Doucment_content(body){
    return this.http.post(`${this.ragUrl}api/get_content`,body)
  }
   get_Doucment_chunks(chatbotId,projectId,selectedDoc_uuid,type,pageNumber){
    const params = {
      chatbotId:chatbotId,
      projectId:projectId,
      doc_uuid:selectedDoc_uuid,
      type:type,
      pageNumber:pageNumber,
    }
    return this.http.get(`${this.resorceUrl}ResourceHandler/GetDocumentInfo`,{params:params})
  }
  delete_document(chatbotId, _id, type, plainText){
   const params = {
      chatbotId:chatbotId,
       _id:_id,
       type:type,
       plainText:plainText,
    }
    return this.http.delete( `${this.resorceUrl}ResourceHandler/DeleteDocument`,{ params:params})
  }
  createIndex(body){
     return this.http.post( `${this.ragUrl}create_index`,body)
  }
  cancelIndex(body){
     return this.http.post(`${this.ragUrl}cancel_index`,body)
  }
  get_index_status(body){
     return this.http.post(`${this.ragUrl}index_status` ,body,{
      headers: new HttpHeaders({ skipLoader: 'true' })
     })
  }
  getConfigs(body){
     return this.http.post(`${this.ragUrl}get_configs`,body)
  }
  save_configs(body){
     return this.http.post(`${this.ragUrl}save_configs`,body)
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

  return this.http.post(`${this.resorceUrl}ResourceHandler/UploadRAGResource` , formData);
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
