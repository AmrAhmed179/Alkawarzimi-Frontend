import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SurveyFilter, filterAnalytical, formValueMapToForm } from '../core/models/filterAnaylic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticServiceService {

  constructor(private http:HttpClient) { }

  public showButton$ = new BehaviorSubject<boolean>(null);
  public filterAnylatic$ = new BehaviorSubject<filterAnalytical>(null);
  public formValue$ = new BehaviorSubject<formValueMapToForm>(null);
  public dateRange$ = new BehaviorSubject<any>(null);
  public proJectName$ = new BehaviorSubject<any>(null);

  public surveyFilter$ = new BehaviorSubject<SurveyFilter>(null);


  GetUniqeUsersCount(chatBotId:number){
    let model={
      chatBotId:chatBotId
    }
    return this.http.post(environment.URLS.GetUniqeUsersCount,model)
  }
  GetOnlineUsersCount(chatBotId:number){
    let model={
      chatBotId:chatBotId
    }
    return this.http.post(environment.URLS.GetOnlineUsersCount,model)
  }
  GetUsersCount(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate
    }

    return this.http.post(environment.URLS.GetUsersCount,{DataFilter:dataFilterrr})
  }
  GetStatistics(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate
    }
    return this.http.post(environment.URLS.GetStatistics,{dataFilter:dataFilterrr})
  }

  GetIntents(dataFilter:filterAnalytical){
    let parm = {
      workspace_id:dataFilter.chatBotId,
    }
    return this.http.get(environment.URLS.GetIntents,{params:parm})
  }

  GetUnderstanding(dataFilter:filterAnalytical){
    let parm = {
      workspace_id:dataFilter.chatBotId,
    }
    return this.http.get(environment.URLS.GetUnderstanding,{params:parm})
  }

  GetChatBotConvwesationServices(dataFilter:filterAnalytical){
    let parm = {
      workspace_id:dataFilter.chatBotId,
      type:undefined
    }
    return this.http.get(environment.URLS.GetChatBotConversationServices,{params:parm})
  }

  GetSassProjects(ProjectType){
    let parm = {
      ProjectType:ProjectType,
    }
    return this.http.get(environment.URLS.GetSassProjects,{params:parm})
  }

  GetChatBotConversationSystemEntities(dataFilter:filterAnalytical){
    let parm = {
      workspace_id:dataFilter.chatBotId,
    }
    return this.http.get(environment.URLS.GetChatBotConversationSystemEntities,{params:parm})
  }

  chatbotConversationIndex(dataFilter:filterAnalytical){
    return this.http.post(environment.URLS.ChatbotConversationIndex, {dataFilter:dataFilter})
  }

  getMessangerUsers(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate,
      length:dataFilterr.length,
      start:dataFilterr.start,

    }
    return this.http.post(environment.URLS.GetMessangerCount, dataFilterrr)
  }

  GetSurviesCounters(dataFilterr:SurveyFilter){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate
    }

    return this.http.post(environment.URLS.GetSurviesCounters, {dataFilter:dataFilterrr})
  }

  GetSurviesStatistics(dataFilterr:SurveyFilter){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate
    }

    return this.http.post(environment.URLS.GetSurviesStatistics, {dataFilter:dataFilterrr})
  }

  CreateStatisticReport(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate,
      filter:dataFilterr.filter,
      search:dataFilterr.search
    }
    return this.http.post(environment.URLS.CreateStatisticReport, {dataFilter:dataFilterrr}, {responseType: 'text'})
  }

  CreateConversationsReport(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate,
      filter:dataFilterr.filter,
      search:dataFilterr.search
    }
    return this.http.post(environment.URLS.CreateConversationsReport, {dataFilter:dataFilterrr}, {responseType: 'text'})
  }
  CreateConversationsReport2(dataFilterr:filterAnalytical){
    let dataFilterrr = {
      chatBotId: dataFilterr.chatBotId,
      endDate: dataFilterr.endDate,
      startDate: dataFilterr.startDate,
      filter:dataFilterr.filter,
      search:dataFilterr.search

    }
    return this.http.post(environment.URLS.CreateConversationsReport2, {dataFilter:dataFilterr}, {responseType: 'blob' as 'json'})
  }
  GetLeadGenerationReport(endDate:any,startDate:any,projectId:any,id:any){
    let parm = {
      endDate : endDate,
      startDate:startDate,
      projectId:projectId,
      id:id
    }
    return this.http.get(environment.URLS.LeadGenerationReport,{params:parm})
  }
  getSurveysTypes(chatBotId){
    let parm = {
      chatBotId : chatBotId,
    }
    return this.http.get(environment.URLS.GetSurveysType,{params:parm})
  }

  getSurveyStatistics(surveyFilter:SurveyFilter, pageSize,pageNumber){
    debugger
    let parm = {
      pageSize : pageSize,
      pageNumber : pageNumber,
    }
    return this.http.post(environment.URLS.GetSurveyStatistics,surveyFilter,{params:parm})
  }
}
