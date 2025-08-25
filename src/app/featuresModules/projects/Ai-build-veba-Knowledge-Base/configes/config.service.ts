import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: any;

  constructor(private http: HttpClient) { }
  loadConfig(): Promise<any> {
  return this.http.get(`${environment.URLS.BaseUrl}AiAgent/GetConfig`)
    .toPromise()
    .then(config => {
      this.config = config;
      return config;
    })
    .catch(err => {
      console.error('Failed to load config:', err);
      this.config = null; // fallback
      return null; // or throw if you want to stop
    });
  }
  get resourceMangmentUrl(): string {
    return this.config?.resorceUrl;
  }
   get RageUrl(): string {
    return this.config?.ragUrl;
  }
}
