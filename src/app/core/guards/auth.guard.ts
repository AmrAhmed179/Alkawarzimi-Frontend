import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Params,
  ActivatedRoute,
} from "@angular/router";
import { tr } from "date-fns/locale";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../services/data.service";
import { UsersService } from "../services/users.service";

@Injectable()
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{

  constructor(
    private _UsersService: UsersService,
    private _dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http_client: HttpClient
  ) {}
  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.changeRouting(route, state.url);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    console.log(route);
    let checked = false;
    if (this._UsersService.USER_ROLE) {
      const userRole = this._UsersService.USER_ROLE;

      route.data.role.forEach((role) => {
        if (role.indexOf(userRole) != -1) checked = true;
      });
    }

    // this._UsersService.project_user_role_bs.subscribe(role=>{

    //   if (role) {

    //     const userRole = role;
    //     if(route.data.roles){

    //       route.data.roles.forEach(role => {
    //        if(role.indexOf(userRole) != -1)
    //         checked= true;
    //       });

    //     }
    //   }

    // });

    if (checked) {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
  changeRouting(
    route: ActivatedRouteSnapshot,
    url: string
  ): Observable<boolean> {
    debugger
    let user = this._dataService.$user_bs.getValue();

    // if(user == null){
    //   this._dataService.getCurrentUserFormBE()
    // }
    if (user != null) {
        let r=route.data.role.indexOf(user.role);
      if (r != -1) {
        return new Observable((_) => {
          _.next(true);
          _.complete();
        });
      } else {
        this.router.navigate(["/error-401"]);
        return new Observable((_) => {
          _.next(false);
          _.complete();
        });
      }
    }

    return this.http_client.get(environment.URLS.GetLoggedUserInfo).pipe(
      map((response: any) => {
        debugger
        let user = response;
        if (user == null) {
          //    this.router.navigate(["/error-401"]);
          return false;
        }

        if (route.data.role.length <= 0 ){
            return true;
        }
         else {

            let result=route.data.role.indexOf(user.role);
            if(result !=-1){
              return true
            }
            else {

              switch (user.role) {

                case "User":
                  this.router.navigate(["/projects"]);
                  break;

                case "Admin":
                  debugger
                  this.router.navigate(["/admin"]);
                  break;
                case "System Admin":
                  debugger
                  this.router.navigate(["/admin"]);
                  //this.router.navigate(["/systemAdmin"]);
                  break;
                case "System User":
                  this.router.navigate(["/admin"]);
                  //this.router.navigate(["/systemUser"]);
                  break;
                case "Analyst":
                  this.router.navigate(["/projects"]);
                  //this.router.navigate(["/analyst"]);
                  break;

                default:
                  this.router.navigate(["/error-401"]);
                  // this.router.navigate(["/user"]);
                  break;
              }

              return false;
            }
         }

      })
    );
  }
}
