import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AccountGuard implements CanLoad, CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isAuthenticated) {
      return true;
    } else {
      return this.router.createUrlTree(['login']);
    }

    // if (this.userService.isAuthenticated) {
    //   return true;
    // } else {
    //   return this.router.createUrlTree(['login']);
    // }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isAuthenticated) {
      return true;
    } else {
      return this.router.createUrlTree(['login'], {
        queryParams: {
          redirectTo: state.url
        }
      });
    }
  }
}
