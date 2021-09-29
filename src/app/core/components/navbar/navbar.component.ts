import {Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user.service';
import {FocusMonitor} from "@angular/cdk/a11y";

@Component({
  selector: 'gaushadhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() menuButtonClicked = new EventEmitter<boolean>();
  @ViewChild("menuBtn") menuBtn!: ElementRef;

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  onMenuButtonClick() {
    this.menuButtonClicked.emit(true);
  }
}
