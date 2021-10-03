import {Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user.service';
import {FocusMonitor} from "@angular/cdk/a11y";
import {of, Subject, Subscription} from "rxjs";
import {CollectionService} from "../../providers/collection.service";
import {NavigationService} from "../../providers/navigation.service";
import {filter, switchMap, takeUntil} from "rxjs/operators";
import {notNullOrNotUndefined} from "../../../common/utils/not-null-or-not-undefined";
import {OrderService} from "../../providers/order.service";

@Component({
  selector: 'gaushadhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() menuButtonClicked = new EventEmitter<boolean>();
  @ViewChild("menuBtn") menuBtn!: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  showUserDropdown: boolean = false;
  isAuthenticated: boolean = false;
  userProfileDataSubscription!: Subscription;
  collectionSubscription!: Subscription;
  collections: Array<any> = [];
  skinCareFacetId: null | string = null;
  healthCareFacetId: null | string = null;
  hawanSamagriFacetId: null | string = null;
  userName: string | null = '';
  itemsInCart = 0;


  constructor(public userService: UserService,
              public collectionService: CollectionService,
              private orderService: OrderService,
              private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.userService.isAuthenticated$
      .pipe(takeUntil(this.destroy$),
        switchMap((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          return this.userService.userProfile$
        }
        return of(null);
      }),
      filter(notNullOrNotUndefined))
      .subscribe((userProfileData) => {
        this.userName = userProfileData.customerName;
    })

    this.orderService.currentOrderDetails$.pipe(takeUntil(this.destroy$),
      filter(notNullOrNotUndefined)
    ).subscribe((res) => {
      this.itemsInCart = res.totalQuantity;
    });

    this.collectionService.allCollections$.pipe(takeUntil(this.destroy$)).subscribe((collections) => {
      this.collections = collections;
      this.skinCareFacetId = this.collectionService.categorySlugIdMap.get('skin-care') ?? '';
      this.healthCareFacetId = this.collectionService.categorySlugIdMap.get('health-care') ?? '';
      this.hawanSamagriFacetId = this.collectionService.categorySlugIdMap.get('hawan-samagri') ?? '';
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMenuButtonClick() {
    this.menuButtonClicked.emit(true);
  }
}
