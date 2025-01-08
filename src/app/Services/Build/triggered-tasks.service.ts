import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TriggeredTasksService {

  GetTriggeredTasks = environment.URLS.GetTriggeredTasks;

  constructor(private http_client: HttpClient) { }

  GetTasks(workspace_id: number, start: number, length: number) {
    let params = {
      workspace_id,
      start,
      length,
    }
    return this.http_client.get(this.GetTriggeredTasks, { params: params })
  }

  deleteTask(taskId: any, workspace_id: any) {
    return this.http_client.post(environment.URLS.DeleteType, { taskId, workspace_id })
  }
}
