import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContextVariableService {

  GetContextVariableURL = environment.URLS.GetContextVariable;
  CreateContextVariableURL = environment.URLS.CreateContextVariable;
  DeleteServicesContextUrl = environment.URLS.DeleteServicesContext;
  DeleteContextVariableURL = environment.URLS.DeleteContextVariable;
  EditContextVariableContextUrl = environment.URLS.EditContextVariable;
  EditContextVariableNametUrl = environment.URLS.EditContextVariableName;

  constructor(private http_client: HttpClient) { }


  CreateContextVariable(variable:ContextVariableModel,workspace_id:number){

    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.CreateContextVariableURL,variable, {params:parm})
  } 
  
  EditContextVariable(variable:ContextVariableModel,workspace_id:number){

    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.EditContextVariableContextUrl,variable, {params:parm})
  }


  EditContextVariableName(services_id,Newname,OldName,workspace_id:number){
    let parm={
      workspace_id:workspace_id,
      services_id:services_id, 
       Newname:Newname,
       OldName:OldName
    }
    return this.http_client.post(this.EditContextVariableNametUrl,{}, {params:parm})
  }
  
  GetContextVariable(workspace_id:number){
    let parm={
      workspace_id:workspace_id,
      sourceBot:"All"
    }
    return this.http_client.get<ContextVariableModel[]>(this.GetContextVariableURL, {params:parm})
  }

  DeleteServicesContext(id:string,workspace_id:number){
    let parm={
      id:id,
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.DeleteServicesContextUrl,{},{params:parm})
  }

  DeleteContextVariable(id:string,workspace_id:number){
    let parm={
      id:id,
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.DeleteContextVariableURL,{},{params:parm})
  }  
  
}
