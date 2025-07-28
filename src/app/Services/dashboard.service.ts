import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 data:any
  baseUrl:string = environment.URLS.BASE_API_URL
  constructor(private http:HttpClient) { }

  getDashBoardDetails(){
    return this.http.get(environment.URLS.Dashboard)
  }

  getAllBotsDevelopers(){
    return this.http.get(environment.URLS.AllBotDeveloper)
  }

  createUser(model:any, role:string){
    let parm = {
      role:role
    }
    return this.http.post(environment.URLS.CreateUesr, model,{params:parm})
  }

  getSystemUsers(){
    return this.http.get(environment.URLS.GetSystemUsers)
  }

  getProjects(){
    return this.http.get(environment.URLS.GetProjects)
  }
  addUserToProJect(projectId:string,userId:string){
    let parm = {
      projectId:projectId,
      userId:userId
    }
    return this.http.put(environment.URLS.addUserToProJect,{},{params:parm})
  }
  updateDomainData(project:string){
    let parm = {
      project:project,
    }
    return this.http.post(environment.URLS.updateDomainData,{},{params:parm})
  }

  getAllAccounts(){
    return this.http.get(environment.URLS.GetAllAccount)
  }
  deleteAccount(id:any){
    let parm = {
      id:id,
    }
    return this.http.delete(environment.URLS.DeleteAccount, {params:parm})
  }

  editAccount(account:any){
    return this.http.post(environment.URLS.EditAccount, account)
  }

  createAccount(account:any){
    return this.http.post(environment.URLS.CreateAccount, account)
  }

  getAccountDetails(id:any){
    let parm = {
      id:id
    }
    return this.http.get(environment.URLS.GetAccountDetail,  {params:parm})
  }

  editUser(user,id){
    let parm = {
      id:id
    }
    debugger
    return this.http.put(environment.URLS.EditUser, user, {params:parm})
  }

  deleteUser(id){
    debugger
    let parm = {
      id:id
    }
    debugger
    return this.http.delete(environment.URLS.DeleteUser,{params:parm})
  }
  getprojectsInGenerateDomainData(){
    return this.http.get(environment.URLS.GetprojectsInGenerateDomainData)
  }

  getDeletedProject(){
    return this.http.get(environment.URLS.GetDeletedProjects)
  }
  RestorProjects(id){
    let parm = {
      id:id
    }
    return this.http.put(environment.URLS.RestorProjects,{params:parm})
  }

  GetAllAiModels(){

    return this.http.get(environment.URLS.GetAllAImodels)
  }

  SaveAIModel(body){

    return this.http.post(environment.URLS.SaveAIModel,body)
  }
   deleteProvider(id){
    let body = {
      id:id
    }
    return this.http.post(environment.URLS.DeleteProvider,body)
  }
}
