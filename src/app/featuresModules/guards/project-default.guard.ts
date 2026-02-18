import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';

@Injectable({ providedIn: 'root' })
export class ProjectDefaultGuard implements CanActivate {
  constructor(private data: DataService, private router: Router) {}

  private getParam(snapshot: ActivatedRouteSnapshot, key: string): string | null {
    let s: ActivatedRouteSnapshot | null = snapshot;
    while (s) {
      const v = s.paramMap.get(key);
      if (v) return v;
      s = s.parent;
    }
    return null;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const projectId = this.getParam(route, 'projectid');
    const user = this.data.$user_bs.getValue();

    // If Analyst tries to enter Tasks -> send to Conversations
    if (user?.role === 'Analyst') {
      return this.router.parseUrl(`/projects/${projectId}/Analytic/Chatbotconversation`);
    }

    // Otherwise allow normal users
    return true;
  }
}
