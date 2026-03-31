import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agents, AIIntentModel } from '../Models/Ai-Agent/toolInfo';

@Injectable({
  providedIn: 'root'
})
export class AiConversationService {

  constructor(private http:HttpClient) { }
   GetAiSessionHistory(ai_sessionId:string, chatbotId){
       let parm = {
      ai_sessionId: ai_sessionId,
      chatbotId: chatbotId
    }
    return this.http.get(environment.URLS.GetAiSessionHistory, { params: parm })
   }

  GetOnlineAiSessionHistory(ai_sessionId:string, chatbotId){
       let parm = {
      ai_sessionId: ai_sessionId,
      projectId: chatbotId
    }
    return this.http.get(environment.URLS.GetOnlineAiSessionHistory, { params: parm })
   }

  GetALLAiSessions(chatbotId, userId ,startDate ,endDate ,projectId, pageSize , page){
   let parm = {
      chatbotId: chatbotId,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
      projectId:projectId,
      pageSize: pageSize,
      page: page,
    }
      return this.http.get(environment.URLS.GetAllAiSessions, { params: parm })
    }
  GetOnlineAiSessions(chatbotId){
   let parm = {
      projectId: chatbotId,
    }
      return this.http.get(environment.URLS.GetOnlineAiSessions, { params: parm })
    }
   GetAllProjects(chatbotId:string){
   let parm = {
      chatbotId: chatbotId,
    }
      return this.http.get(environment.URLS.GetProjectsInfoAsync, { params: parm })
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

  saveSubAgents(body:any){
      return this.http.post(environment.URLS.saveSubAgents,  body)
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

    ChangeSubAgent(body){
      return this.http.post(environment.URLS.ChangeSubAgent,body)
    }

  GetAIIntents(chatbotId: string) {
    let parm = {
      chatbotId: chatbotId
    };
    return this.http.get(environment.URLS.GetAllAIIntents, { params: parm });
  }

  UpsertAIIntent(model: AIIntentModel) {
    return this.http.post(environment.URLS.UpsertAIIntent, model);
  }

  // MVC Delete(string id) [HttpPost]
  DeleteAIIntent(id: string) {
    const body = new URLSearchParams();
    body.set('id', id);

    return this.http.post(environment.URLS.DeleteAIIntent, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

// ai-conversation.service.ts
detectIntent(payload: { mode: string; examples: string[] }) {
  return this.http.post<{ intent: string }>(
    `/api/ai/detect-intent`,
    payload
  );
}

}
