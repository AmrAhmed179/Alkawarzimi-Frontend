import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entities } from 'src/app/core/models/Entities';
import { ServicesModel } from 'src/app/core/models/Services';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesSetService {

  constructor(private http_client: HttpClient) { }
  GetServicesURL = environment.URLS.GetServicesSet;
  EditServicesURL = environment.URLS.EditServicesSet;
  CreateServicesSetURL = environment.URLS.CreateServicesSet;
  DeleteServicesSetURL = environment.URLS.DeleteServicesSet;

  GetServices(workspace_id:number){

    let parm={
      workspace_id:workspace_id,
      type:undefined,
    }
    return this.http_client.get(this.GetServicesURL, {params:parm})
  }    
  
  EditServices(services:ServicesModel,workspace_id:number){

    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.EditServicesURL,services, {params:parm})
  }    
  
  CreateServices(services:ServicesModel,workspace_id:number){

    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.CreateServicesSetURL,services, {params:parm})
  }    
  
  DeleteServices(id:number,workspace_id:number){
    let parm={
      id:id,
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.DeleteServicesSetURL,{},{params:parm})
  }  
  
 
 

}
