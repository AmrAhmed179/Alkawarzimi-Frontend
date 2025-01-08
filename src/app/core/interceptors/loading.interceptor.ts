import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { delay, finalize, Observable } from "rxjs";
import { BusyService } from "../services/busy.service";
import { environment } from "src/environments/environment";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // let url = window.location.href
    let url = request.url
    // if (request.url.indexOf("SearchOrder") === -1) this.busyService.busy();
    if (!url.includes('GetUniqeUsersCount') && !url.includes('GetOnlineUsersCount') && !url.includes('GetUsersCount') && !url.includes('ontologyTreeChild')) {
      this.busyService.busy()
    }

    return next.handle(request).pipe(
      delay(700),
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
