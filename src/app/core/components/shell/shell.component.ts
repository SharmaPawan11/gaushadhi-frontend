import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { UserService } from '../../providers/user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'gaushadhi-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  currentRoute = '';
  showTopOfferBar: boolean = true;
  footerExcludedRoutes = ['/store/cart'];

  constructor(private router: Router, public userService: UserService) {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
  }

  ngOnInit(): void {}

  logout() {
    this.userService.logout();
    this.router.navigateByUrl(this.currentRoute);
    // this.router.navigate(['login'], {
    //   queryParams: {
    //     redirectTo: this.currentRoute,
    //   },
    // });
  }

}
