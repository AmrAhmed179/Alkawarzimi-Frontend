import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agents } from '../Models/Ai-Agent/toolInfo';

@Injectable({
  providedIn: 'root'
})
export class AiConversationService {

  constructor(private http:HttpClient) { }
   GetAiSessionHistory(ai_sessionId:string, projectId){
       let parm = {
      ai_sessionId: ai_sessionId,
      projectId: projectId
    }
    return this.http.get(environment.URLS.GetAiSessionHistory, { params: parm })
   }

  GetOnlineAiSessionHistory(ai_sessionId:string, projectId){
       let parm = {
      ai_sessionId: ai_sessionId,
      projectId: projectId
    }
    return this.http.get(environment.URLS.GetOnlineAiSessionHistory, { params: parm })
   }

  GetALLAiSessions(projectId, userId ,startDate ,endDate , pageSize , page){
   let parm = {
      projectId: projectId,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
      pageSize: pageSize,
      page: page,
    }
      return this.http.get(environment.URLS.GetAllAiSessions, { params: parm })
    }
  GetOnlineAiSessions(projectId){
   let parm = {
      projectId: projectId,
    }
      return this.http.get(environment.URLS.GetOnlineAiSessions, { params: parm })
    }
   GetTools(selectedAgentId:string){
   let parm = {
      selectedAgentId: selectedAgentId,
    }
      return this.http.get(environment.URLS.GetTools, { params: parm })
    }
  GetAgentsTasks(projectId:string,intentId:string,){
   let parm = {
      projectId: projectId,
    }
      return this.http.get(environment.URLS.GetAgentsTasks, { params: parm })
    }

  GetAgents(chatbotId){
         let parm = {
      chatbotId: chatbotId
    }
      return this.http.get(environment.URLS.GetAgents,  { params: parm })
  }
  GetAgentDataFromAgentTemplete(chatbotId,agent_id, provider, model){
         let parm = {
      chatbotId: chatbotId,
      agent_id: agent_id,
      provider: provider,
      model: model
    }
      return this.http.get(environment.URLS.GetAgentDataFromAgentTemplete,  { params: parm })
  }
  GetAIModels(){
      return this.http.get(environment.URLS.GetAIModels)
  }

  DeleteAgent(_id){
         let parm = {
      _id: _id
    }
      return this.http.delete(environment.URLS.DeleteAgent,  { params: parm })
    }
  saveAgent(agent:Agents){

      return this.http.post(environment.URLS.saveAgents,  agent)
    }
  SetMainAgent(agentId:string, isMain:boolean){
    let parm = {
    agentId:agentId,
      isMain:isMain
    }
 return this.http.post(environment.URLS.SetMainAgent,null, { params: parm })
  }
  EditTools(tool){
      return this.http.post(environment.URLS.EditTool,tool)
    }


}
