import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  GetMenusURL = environment.URLS.GetMenus;
  DeleteMenusURL = environment.URLS.DeleteMenus;
  CreateMenuURL = environment.URLS.CreateMenu;
  GetTasksURL = environment.URLS.GetTasks;
  UpdateMenuUrl = environment.URLS.UpdateMenu;

  constructor(private http_client: HttpClient) { }

  GetMenus(projectId: number) {
    let parm = {
      projectId,
    }
    return this.http_client.get(this.GetMenusURL, { params: parm })
  }


  DeleteMenu(projectId: number, menuId: string) {
    let body = {
      menuId: menuId,
      projectId: projectId
    }
    return this.http_client.post(this.DeleteMenusURL, body)
  }

  CreateMenu(payload) {
    return this.http_client.post(this.CreateMenuURL, payload)
  }


  update(payload, updatedMenu) {
    return this.http_client.post(null, payload)
  }

  GetTasks(projectId: number) {
    let parm = {
      projectId,
    }
    return this.http_client.get(this.GetTasksURL, { params: parm })
  }

  updateMenu(payload) {
    return this.http_client.post(this.UpdateMenuUrl, payload)
  }


}
