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
import {map} from "rxjs/operators";
import {SnackbarService} from "../snackbar.service";

@Injectable({
  providedIn: 'root',
})
export class AccountGuard implements CanLoad, CanActivate {
  constructor(private userService: UserService, private router: Router, private snackbarService: SnackbarService) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isAuthenticated$) {
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

    return this.userService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.snackbarService.openSnackBar('Please Sign in first');
          return this.router.createUrlTree(['login'], {
            queryParams: {
              redirectTo: state.url
            }
          })
        }
        return isAuthenticated
      })
    )

    // if (this.userService.isAuthenticated) {
    //   return true;
    // } else {
    //   return this.router.createUrlTree(['login'], {
    //     queryParams: {
    //       redirectTo: state.url
    //     }
    //   });
    // }
  }
}
