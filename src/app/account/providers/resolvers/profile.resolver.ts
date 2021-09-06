import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ProfileService } from '../profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileResolver implements Resolve<any> {
  constructor(private profileService: ProfileService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.profileService.getProfileData().pipe(take(1));
  }
}
