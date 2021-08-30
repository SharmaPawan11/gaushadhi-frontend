import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../core/providers/user.service';

@Component({
  selector: 'gaushadhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit(): void {}
}
