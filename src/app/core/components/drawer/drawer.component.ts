import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user.service";
import {Event, Router} from "@angular/router";
import {ChangePasswordComponent} from "../../../account/components/change-password/change-password.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'gaushadhi-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit, OnDestroy {
  @Output() menuButtonClicked = new EventEmitter<boolean>();
  disableParentRipple: boolean = false;
  isAuthenticated: boolean = false;
  isAuthenticatedSubscription!: Subscription;
  drawerItems = [
    {
      name: 'products',
      icon: 'inventory',
      visibleTo: 'everyone',
      onClick: () => {
        this.router.navigate(['store', 'products'])
      }
    },
    {
      name: 'account',
      icon: 'account_circle',
      visibleTo: 'logged_in',
      onClick: () => {
        this.router.navigate(['account'])
      },
      expanded: true,
      children: [
        {
          name: 'edit profile',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.router.navigate(['account', 'profile'])
          },
        },
        {
          name: 'change password',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.router.navigate(['account', 'update', 'password'])
          },
        },
        {
          name: 'change email address',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.router.navigate(['account', 'update', 'email'])
          },
        },
        {
          name: 'manage addresses',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.router.navigate(['account', 'address'])
          },
        },
        {
          name: 'my orders',
          onClick: (e: MouseEvent) => {
            e.stopPropagation()
            this.router.navigate(['account', 'orders'])
          },
        }
      ]
    },
    {
      name: 'logout',
      icon: 'logout',
      visibleTo: 'logged_in',
      onClick: () => {
        this.userService.logout();
      }
    },
    {
      name: 'login',
      icon: 'vpn_key',
      visibleTo: 'logged_out',
      onClick: () => {
        this.router.navigate(['login'])
      }
    },
    {
      name: 'register',
      icon: 'person_add',
      visibleTo: 'logged_out',
      onClick: () => {
        this.router.navigate(['register'])
      }
    }
  ]

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.userService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy() {
    if (this.isAuthenticatedSubscription) {
      this.isAuthenticatedSubscription.unsubscribe();
    }
  }

  onToggleExpand(drawerItem: any, e: MouseEvent) {
    e.stopPropagation()
    drawerItem.expanded = !drawerItem.expanded;
  }

}
