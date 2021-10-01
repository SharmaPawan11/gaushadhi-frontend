import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subject} from "rxjs";
import {combineLatest, takeUntil} from "rxjs";
import {CollectionService} from "../../../core/providers/collection.service";

@Component({
  selector: 'gaushadhi-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  categorySelectForm!: FormGroup;
  activeCollections: Array<string> = [];
  allCategories: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    const activeCollectionsIds$ = this.collectionService.activeCollectionsIds$
      .pipe(takeUntil(this.destroy$));

    const allCollections$ = this.collectionService.allCollections$
      .pipe(takeUntil(this.destroy$))

    combineLatest([activeCollectionsIds$, allCollections$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([activeCollectionsIds, allCollections]) => {
        this.categorySelectForm = this.buildForm(allCollections);
        this.activeCollections = activeCollectionsIds
        this.allCategories = allCollections;
        this.setFormValueBasedOnActiveFacets();
        this.updateActiveCollectionOnValueChange();
      });

      // .subscribe((res: any) => {
      //   this.categorySelectForm = this.buildForm(res);
      //   this.allCategories = res;
      //   this.setFormValueBasedOnActiveFacets();
      //   this.updateActiveCollectionOnValueChange();
      // })
  }

  ngOnDestroy() {
    this.collectionService.updateActiveCollections([]);
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  buildForm(collections: Array<any>) {
    const group: any = {};
    collections.forEach((collection) => {
      group[collection.slug] = new FormControl(false);
    })
    return new FormGroup(group);
  }

  updateActiveCollectionOnValueChange() {
    this.categorySelectForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((formValue) => {
      const allActiveFacetsId: Array<string> = [];

      Object.keys(formValue).forEach((formControlName) => {
        if (formValue[formControlName] === true) {
          const categoryId = this.collectionService.categorySlugIdMap.get(formControlName);
          allActiveFacetsId.push(categoryId);
        }
      });

      this.collectionService.updateActiveCollections(allActiveFacetsId);
    });
  }

  setFormValueBasedOnActiveFacets() {
    this.activeCollections.forEach((collectionId) => {
      // this.categorySelectForm.reset();
      const control = this.collectionService.categorySlugReverseMap.get(collectionId);
      this.categorySelectForm.get(control)?.setValue(true, {emitEvent: false});
    })
  }

}
