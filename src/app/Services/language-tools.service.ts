import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageToolsService {

  constructor(private http: HttpClient) { }
  getStems(projectId: string) {
   let parmas= {
    projectId:projectId
   }
    return this.http.get(environment.URLS.GetStems , {params:parmas})
  }
  languageToolsGetVerbs(projectId: string) {
   let parmas= {
    projectId:projectId
   }
    return this.http.get(environment.URLS.LanguageToolsGetVerbs , {params:parmas})
  }


  getProjectNodesAndRelations(projId: string) {
    let parmas= {
      projectId:projId
     }
      return this.http.get(environment.URLS.GetProjectNodesAndRelationsLangTools , {params:parmas})
  }


  // generateUniqueStems(projectId: string): Observable<any> {
  //   const url = `${this.baseUrl}/LanguageTools/createUniqeStems?projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // getVerbs(projectId: string): Observable<any> {
  //   const url = `/LanguageTools/GetVerbs?projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // generateErrorWords(projectId: string): Observable<any> {
  //   const url = `/LanguageTools/GenerateErrorWords?projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // getRecommendedTokens(projectId: string, token: string): Observable<any> {
  //   const url = `/LanguageTools/CorrectToken?token=${token}&projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // getErrorTokens(projectId: string): Observable<any> {
  //   const url = `/LanguageTools/GetWrongWords?projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // getSpellCheckedTokens(projectId: string): Observable<any> {
  //   const url = `/LanguageTools/GetSpellCheckedTokens?projectId=${projectId}`;
  //   return this.http.get<any>(url).pipe(catchError(this.handleError));
  // }

  // updateCheckedTokens(tokens: any[], projectId: string): Observable<any> {
  //   const url = `/LanguageTools/UpdateSpellCheckedTokens`;
  //   const body = { tokens, projectId };
  //   return this.http.post<any>(url, body).pipe(catchError(this.handleError));
  // }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong in the service!'));
  }
}
