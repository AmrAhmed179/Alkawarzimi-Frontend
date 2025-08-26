import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RagKnowledgeBaseService {

  private configLoaded$ = new BehaviorSubject<boolean>(false);
  resorceUrl!: string;
  ragUrl!: string;

  indexStaus$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.loadConfig();
  }
  private loadConfig() {
    this.http.get(`${environment.URLS.BaseUrl}AiAgent/GetConfig`)
    .pipe(
      catchError(err => {
        console.warn("Using fallback config due to error:", err);
        return of({
          resorceUrl: 'resorceUrlError',
          ragUrl: 'ragUrlError'
        });
      })
    )
    .subscribe((config: any) => {
      this.resorceUrl = config.resorceUrl;
      this.ragUrl = config.ragUrl;
      this.configLoaded$.next(true); // mark config as loaded
    });
  }

  private waitForConfig<T>(action: () => Observable<T>): Observable<T> {
    return this.configLoaded$.pipe(
      filter(loaded => loaded),   // wait until true
      take(1),                    // only once
      switchMap(() => action())   // then run your API call
    );
  }

  getAllDocuments(chatbotId,projectId){
  return this.waitForConfig(() => {
    const params = {
      chatbotId:chatbotId,
       projectId:projectId
    }
    return this.http.get( `${this.resorceUrl}ResourceHandler/GetDocuments` , {params:params})
   })
  }

  UpdateDocumentSettings(document){
    return this.waitForConfig(() => {
      return this.http.post( `${this.resorceUrl}ResourceHandler/UpdateDocumentSettings` , document)
    })
  }
  get_Doucment_content(body){
   return this.waitForConfig(() => {
     return this.http.post(`${this.ragUrl}api/get_content`,body)
   })
  }
   get_Doucment_chunks(chatbotId,projectId,selectedDoc_uuid,type,pageNumber){
    return this.waitForConfig(() => {
      const params = {
        chatbotId:chatbotId,
        projectId:projectId,
        doc_uuid:selectedDoc_uuid,
        type:type,
        pageNumber:pageNumber,
      }
      return this.http.get(`${this.resorceUrl}ResourceHandler/GetDocumentInfo`,{params:params})
    })
  }
  delete_document(chatbotId, _id, type, plainText){
    return this.waitForConfig(() => {
     const params = {
        chatbotId:chatbotId,
         _id:_id,
         type:type,
         plainText:plainText,
      }
      return this.http.delete( `${this.resorceUrl}ResourceHandler/DeleteDocument`,{ params:params})
    })
  }
  createIndex(body){
    return this.waitForConfig(() => {
      return this.http.post( `${this.ragUrl}create_index`,body)
    })
  }
  cancelIndex(body){
    return this.waitForConfig(() => {
      return this.http.post(`${this.ragUrl}cancel_index`,body)
    })
  }
  get_index_status(body){
    return this.waitForConfig(() => {
       return this.http.post(`${this.ragUrl}index_status` ,body,{
        headers: new HttpHeaders({ skipLoader: 'true' })
       })
    })
  }
  getConfigs(body){
    return this.waitForConfig(() => {
     return this.http.post(`${this.ragUrl}get_configs`,body)
    })
  }
  save_configs(body){
    return this.waitForConfig(() => {
      return this.http.post(`${this.ragUrl}save_configs`,body)
    })
  }

  indexStaus(){
    return this.indexStaus$.asObservable()
  }

  uploadRagResource(item: any) {
    return this.waitForConfig(() => {
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
    })
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
