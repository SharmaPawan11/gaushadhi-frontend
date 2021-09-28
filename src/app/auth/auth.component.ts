import { Component, OnInit } from '@angular/core';
import {AuthService} from "./providers/auth.service";

@Component({
  selector: 'gaushadhi-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    // await this.authService.loadGoogleSignInScript();
  }
}
