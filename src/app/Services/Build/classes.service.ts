import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  GetClassesUrl = environment.URLS.GetClasses;

  
  constructor(private http_client: HttpClient) { }

  GetClasses(workspace_id:number){
    let parm={
      projectId:workspace_id,
    }
    return this.http_client.get(this.GetClassesUrl, {params:parm})
  }
}
