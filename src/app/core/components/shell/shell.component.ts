import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterEvent, Scroll,
} from '@angular/router';
import { UserService } from '../../providers/user.service';
import { filter } from 'rxjs/operators';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'gaushadhi-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(MatDrawerContainer) drawerContainer!: MatDrawerContainer;
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll),
      takeUntil(this.destroy$)
    ).subscribe(e => {
      this.drawerContainer.scrollable.scrollTo({
        top: 0,
        left: 0
      })
    });
  }

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
