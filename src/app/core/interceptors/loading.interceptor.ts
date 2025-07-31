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
    const skipLoader = request.headers.has('skipLoader') ||
      url.includes('GetUniqeUsersCount') ||
      url.includes('GetOnlineUsersCount') ||
      url.includes('GetUsersCount') ||
      url.includes('ontologyTreeChild');

    // if (request.url.indexOf("SearchOrder") === -1) this.busyService.busy();
    // if (!url.includes('GetUniqeUsersCount') && !url.includes('GetOnlineUsersCount') && !url.includes('GetUsersCount') && !url.includes('ontologyTreeChild')) {
    //   this.busyService.busy()
    // }
    if (!skipLoader) {
      this.busyService.busy();
    }

    const modifiedRequest = request.clone({
      headers: request.headers.delete('skipLoader')
    });
    return next.handle(modifiedRequest).pipe(
      delay(700),
      finalize(() => {
        if (!skipLoader) {
          this.busyService.idle();
        }
      })
    );
  }
}
