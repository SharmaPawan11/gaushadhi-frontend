import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../providers/user.service";
import {Event, Router} from "@angular/router";

@Component({
  selector: 'gaushadhi-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  @Output() menuButtonClicked = new EventEmitter<boolean>();
  disableParentRipple: boolean = false;
  drawerItems = [
    {
      name: 'products',
      icon: 'inventory',
      visible: true,
      onClick: () => {
        this.router.navigate(['store', 'products'])
      }
    },
    {
      name: 'account',
      icon: 'account_circle',
      visible: true,
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
      visible: this.userService.isAuthenticated,
      onClick: () => {
        this.userService.logout()
      }
    },
    {
      name: 'login',
      icon: 'vpn_key',
      visible: !this.userService.isAuthenticated,
      onClick: () => {
        this.router.navigate(['login'])
      }
    },
    {
      name: 'register',
      icon: 'person_add',
      visible: !this.userService.isAuthenticated,
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
  }

  onToggleExpand(drawerItem: any, e: MouseEvent) {
    e.stopPropagation()
    drawerItem.expanded = !drawerItem.expanded;
  }

}
