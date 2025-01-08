import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

  GetEntitiesURL = environment.URLS.GetEntities;
  GetSystemEntitiesURL = environment.URLS.GetSystemEntities;
  DeleteEntitiesURL = environment.URLS.DeleteEntities;
  CreateEntitiesURL = environment.URLS.CreateEntities;
  SaveEntitiesURL = environment.URLS.SaveEntities;

  constructor(private http_client: HttpClient) { }

  GetEntities(projectId: number) {
    let parm = {
      type: 'object',
      syn: 1,
      projectId: projectId.toString(),

    }
    return this.http_client.get(this.GetEntitiesURL, { params: parm })
  }

  GetSystemEntities(workspace_id: string) {
    let params = {
      workspace_id,
    }

    return this.http_client.get(this.GetSystemEntitiesURL, { params: params })
  }

  DeleteEntity(entity) {
    return this.http_client.post(this.DeleteEntitiesURL, entity)
  }

  CreateEntity(entity) {
    return this.http_client.post(this.CreateEntitiesURL, entity)
  }

  SaveSystemEntity(entity) {
    return this.http_client.post(this.SaveEntitiesURL, entity)
  }
}
