import {Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user.service';
import {FocusMonitor} from "@angular/cdk/a11y";
import {Subscription} from "rxjs";
import {CollectionService} from "../../providers/collection.service";
import {NavigationService} from "../../providers/navigation.service";

@Component({
  selector: 'gaushadhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() menuButtonClicked = new EventEmitter<boolean>();
  @ViewChild("menuBtn") menuBtn!: ElementRef;
  showUserDropdown: boolean = false;
  isAuthenticated: boolean = false;
  isAuthenticatedSubscription!: Subscription;
  collectionSubscription!: Subscription;
  collections: Array<any> = [];
  skinCareFacetId: null | string = null;
  healthCareFacetId: null | string = null;
  hawanSamagriFacetId: null | string = null;


  constructor(public userService: UserService,
              public collectionService: CollectionService,
              private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.userService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    })
    this.collectionSubscription = this.collectionService.allCollections$.subscribe((collections) => {
      this.collections = collections;
      this.skinCareFacetId = this.collectionService.categorySlugIdMap.get('skin-care') ?? '';
      this.healthCareFacetId = this.collectionService.categorySlugIdMap.get('health-care') ?? '';
      this.hawanSamagriFacetId = this.collectionService.categorySlugIdMap.get('hawan-samagri') ?? '';
    })
  }

  ngOnDestroy() {
    if (this.isAuthenticatedSubscription) {
      this.isAuthenticatedSubscription.unsubscribe();
    }

    if (this.collectionSubscription) {
      this.collectionSubscription.unsubscribe();
    }
  }

  onMenuButtonClick() {
    this.menuButtonClicked.emit(true);
  }
}
