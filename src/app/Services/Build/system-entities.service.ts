import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PreDefinedEntity } from 'src/app/core/models/PreDefinedEntity';
import { SystemEntity } from 'src/app/core/models/systemEntity';

@Injectable({
  providedIn: 'root'
})
export class SystemEntitiesService {

  GetDataTypsUrl = environment.URLS.GetSystemEntitiesDataTyps;
  GetSystemEntitiesUrl = environment.URLS.GetSystemEntities;
  GetPreDefinedEntityUrl = environment.URLS.GetPreDefinedEntity;
  CreateSystemEntityUrl = environment.URLS.CreateSystemEntity;
  EditSystemEntityUrl = environment.URLS.EditSystemEntity;
  DeletSystemEntityUrl = environment.URLS.DeleteSystemEntity;

  
  constructor(private http_client: HttpClient) { }

  GetDataTypes(workspace_id:number){
    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.get(this.GetDataTypsUrl, {params:parm})
  }

  GetSystemEntities(workspace_id:number){
    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.get(this.GetSystemEntitiesUrl, {params:parm})
  }

  GetPreDefinedEntity(){
    return this.http_client.get<PreDefinedEntity[]>(this.GetPreDefinedEntityUrl)
  }

  CreateSystemEntity(systemEntities:SystemEntity,workspace_id:number){
    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.CreateSystemEntityUrl,systemEntities,{params:parm})
  }

  EditSystemEntity(Entity:SystemEntity,workspace_id:number){
    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.EditSystemEntityUrl,Entity,{params:parm})
  }

  DeleteSystemEntity(Entity:SystemEntity,workspace_id:number){
    let parm={
      workspace_id:workspace_id,
    }
    return this.http_client.post(this.DeletSystemEntityUrl,Entity,{params:parm})
  }
  
}
