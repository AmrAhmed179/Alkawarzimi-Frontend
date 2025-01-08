import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeClassesService {

  GetTypeClassesURL = environment.URLS.GetTypeClasses;
  DeleteClassURL = environment.URLS.DeleteClasses;
  CreateClassURL = environment.URLS.CreateClass;
  EditClassURL = environment.URLS.EditClass;

  constructor(private http_client: HttpClient) { }

  GetTypeClasses(projectId: string) {
    let parm = {
      projectId,
    }
    return this.http_client.get(this.GetTypeClassesURL, { params: parm })
  }

  DeleteClass(projectId: string, classId: string) {
    let body = {
      classId: classId,
      projectId: projectId
    }
    return this.http_client.post(this.DeleteClassURL, body)
  }

  createClass(projectId: string, className: string) {
    
    let params = {
      projectId: projectId,
      name: className
    }

    return this.http_client.post(this.CreateClassURL, params)
  }

  saveClass(result: any, projectId: string) {
    debugger
    let body = {
      projectId: projectId,
      classObj: result
    }

    return this.http_client.post(this.EditClassURL, body)
  }



}
