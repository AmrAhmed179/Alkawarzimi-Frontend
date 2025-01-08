import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeGraphService {

  //baseUrl = environment.URLS.BaseUrl;
  GetProjectNodes = environment.URLS.GetProjectNodes;
  GetAllNodeConnections = environment.URLS.GetNodeConnections;
  GetAllRelationships = environment.URLS.GetAllRelationships;
  GetAllRelationConnectedNodes = environment.URLS.GetRelationConnectedNodes;
  GetAllProjectNodesAndRelations = environment.URLS.GetProjectNodesAndRelations;

  constructor(private http: HttpClient) { }

  getProjectNodesAndRelations(projId: string) {
    const url = `${this.GetProjectNodes}?projectId=${projId}`;
    return this.http.get(url);
  }

  GetNodeConnections(projId: string, nodeName: string) {
    const url = `${this.GetAllNodeConnections}?label=${nodeName}&projectId=${projId}`;
    return this.http.get(url);
  }

  GetRelationConnectedNodes(projId: string, nodeName: string) {

    const url = `${this.GetAllRelationships}?projectId=${projId}&relation=${nodeName}`;
    return this.http.get(url);
  }

  GetNodeRelations(projId: string) {

    const url = `${this.GetAllRelationConnectedNodes}?projectId=${projId}`;
    return this.http.get(url);
  }

  GetProjectNodesAndRelations(projId: string) {
    const url = `${this.GetAllProjectNodesAndRelations}?projectId=${projId}`;
    return this.http.get(url);
  }
}