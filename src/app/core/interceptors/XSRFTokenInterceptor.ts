import { Inject, Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { environment } from "src/environments/environment";
//declare var $: any;
/** Pass untouched request through to the next request handler. */
@Injectable()
export class XSRFTokenInterceptor implements HttpInterceptor {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let elements = this.document.getElementsByName(
      "__RequestVerificationToken"
    );
    let RequestVerificationToken: string = "NOT-FOUND";

    if (elements != null && elements.length > 0) {
      RequestVerificationToken = (elements[0] as HTMLInputElement).value;
    }

    const authReq = req.clone({
      headers: req.headers.set("X-XSRF-Token", RequestVerificationToken),
    });

    return next.handle(authReq).pipe(
      tap({
        next: () => null,
        error: (err: HttpErrorResponse) => {
          if (err.status === 200) {
            if (err.url.indexOf("/Account/Login") !== -1) {
              debugger;
              console.log("logout from HttpInterceptor");
              this.document.location.href = environment.URLS.BASE_URL; // err.url;
            }
          }

          return throwError(err);
        },
      })
    );
  }
}
