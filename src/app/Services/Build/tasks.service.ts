import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Example } from 'src/app/Models/build-model/intent-model';
import { IndexLimitFilter } from 'src/app/core/models/tasks/IndexLimitFilter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  dataFilter: any
  constructor(private http: HttpClient) { }

  getWorkSpaceTypes(workspace_id: any) {
    let parm = {
      workspace_id: workspace_id
    }
    return this.http.get(environment.URLS.WorkSpaceTypes, { params: parm })
  }

  getIndexLimit(dataFilter: IndexLimitFilter) {
    let params;
    if (dataFilter.sourceBot == null) {
      params = {
        category: dataFilter.category,
        knowledgeType: dataFilter.knowledgeType,
        length: dataFilter.length,
        responseType: dataFilter.responseType,
        start: dataFilter.start,
        type: dataFilter.type,
        workspace_id: dataFilter.workspace_id,
        search:dataFilter.search
      }
    } else {
      params = {
        category: dataFilter.category,
        knowledgeType: dataFilter.knowledgeType,
        length: dataFilter.length,
        responseType: dataFilter.responseType,
        start: dataFilter.start,
        type: dataFilter.type,
        sourceBot: dataFilter.sourceBot,
        workspace_id: dataFilter.workspace_id,
      }
    }
    return this.http.get(environment.URLS.GetIndexLimit, { params: params })
  }

  getPreBuiltBots(workspace_id: any) {
    let parm = {
      workspace_id: workspace_id
    }
    return this.http.get(environment.URLS.GetPreBuiltBots, { params: parm })
  }
  getExportedTasks() {

    return this.http.get(environment.URLS.GetExportedTasks)
  }

  exportTask(projectId: any, taskId: any) {
    let parm = {
      projectId: projectId,
      taskId: taskId,
    }
    return this.http.get(environment.URLS.ExportTask, { params: parm })
  }

  returnAfterDigression(intent: any, workspace_id: any) {
    return this.http.post(environment.URLS.ReturnAfterDigression, { intent, workspace_id })
  }

  deleteIntent(id: any, workspace_id: any) {
    return this.http.post(environment.URLS.DeleteIntent, { id:id, workspace_id:workspace_id })
  }

  deleteType(type: any, workspace_id: any) {
    return this.http.post(environment.URLS.DeleteType, { type, workspace_id })
  }

  createTask(intent: any, workspace_id: any) {
    return this.http.post(environment.URLS.CreateTask, { intent, workspace_id })
  }

  setPreBuiltBot(id: any, workspace_id: any) {
    let parm = {
      id: id,
      workspace_id: workspace_id,
    }
    return this.http.get(environment.URLS.SetPreBuiltBot, { params: parm })
  }

  importTask(taskId: any, projectId: any) {
    let parm = {
      taskId: taskId,
      projectId: projectId,
    }
    return this.http.get(environment.URLS.ImportTask, { params: parm })
  }
  matchPattern(Text: any, projectId: any) {
    let parm = {
      Text: Text,
      projectId: projectId,
    }
    return this.http.get(environment.URLS.MatchPattern, { params: parm })
  }

  getTasksTree(workspace_id: any, mainTaskId: any) {
    let parm = {
      workspace_id: workspace_id,
      mainTaskId: mainTaskId,
    }
    return this.http.get(environment.URLS.GetTasksTree, { params: parm })
  }

    getTaskSetting(workspace_id: any, intentId: any) {
    let parm = {
      workspace_id: workspace_id,
      intentId: intentId,
    }
    return this.http.get(environment.URLS.GetTaskSetting, { params: parm })
  }


  getProjectInfo(projectId: any) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetTaskSetting, { params: parm })
  }

  getFlowDiagram(workspace_id: any, entityId: any, propertyId:any) {
    let parm = {
      workspace_id: workspace_id,
      entityId: entityId,
      propertyId: propertyId
    }
    return this.http.get(environment.URLS.GetFlowDiagram, { params: parm })
  }

  getOptions(projectId: any) {
    let parm = {
      projectId: projectId,
    }
    return this.http.get(environment.URLS.GetOptions,{ params: parm })
  }

  getIntent(workspace_id: any, intentId:string) {
    let parm = {
      workspace_id: workspace_id,
      intentId: intentId,
    }
    return this.http.get(environment.URLS.GetIntent,{ params: parm })
  }

  getAllExamples(workspace_id: any, intentId:string) {
    let parm = {
      workspace_id: workspace_id,
      intentId: intentId,
    }
    return this.http.get(environment.URLS.GetAllExamples,{ params: parm })
  }

  createExample(workspace_id:any, language:String, intentId:string, text:string) {
    let body = {
      example:{
        language:language,
        text:text
      },
      intentId:intentId,
      workspace_id:workspace_id
    }
    return this.http.post(environment.URLS.CreateExample,body)
  }

  editExample(workspace_id:any, intentId:string, oldExample:string,example:Example) {
    let body = {
      example:example,
      intentId:intentId,
      workspace_id:workspace_id,
      oldExample:oldExample
    }
    return this.http.post(environment.URLS.EditExample,body)
  }

  deleteExample(workspace_id:any, intentId:string,example:Example) {
    let body = {
      example:example,
      intentId:intentId,
      workspace_id:workspace_id,
    }
    return this.http.post(environment.URLS.DeleteExample,body)
  }

  updateIntentInfo(intent,workspace_id){
    return this.http.post(environment.URLS.UpdateIntentInfo,{intent, workspace_id})
  }

  deleteMainTask(intent,workspace_id){
    return this.http.post(environment.URLS.DeleteMainTask,{intent, workspace_id})
  }

  createMainTask(intent,workspace_id){
    return this.http.post(environment.URLS.CreateMainTask,{intent, workspace_id})
  }

  getAllDialogs(workspace_id: any, intentId:string, intentMode:string) {
    let parm = {
      workspace_id: workspace_id,
      intentId: intentId,
      intentMode: intentMode,
    }
    return this.http.get(environment.URLS.GetAllDialogs,{ params: parm })
  }
  editDialogs(projectId: any, intentId:string, intentMode:string,node:any,destSibling:any,srcSibling:any) {
    let body = {
      projectId: projectId,
      intentId: intentId,
      intentMode: intentMode,
      node:node,
      destSibling:destSibling,
      srcSibling:srcSibling,

    }
    return this.http.post(environment.URLS.EditDialog, body)
  }

  createDialog(body:any) {
    return this.http.post(environment.URLS.CreateDialog, body)
  }

  getAllTasks(projectId: any, intentId:string) {
    let parm = {
      projectId: projectId,
      intentId: intentId,
    }
    return this.http.get(environment.URLS.GetAllTasks,{ params: parm })
  }
}
