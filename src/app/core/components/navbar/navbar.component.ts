import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../providers/user.service";

@Component({
  selector: 'gaushadhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

}
