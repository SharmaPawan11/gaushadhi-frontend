import { Injectable } from '@angular/core';
import {gql} from "apollo-angular";
import {RequestorService} from "./requestor.service";
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {Query} from "../../common/vendure-types";

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  // allCollections: Array<any> = [];
  private allCollections = new BehaviorSubject<Array<any>>([]);
  allCollections$ = this.allCollections.asObservable();

  categorySlugIdMap = new Map();
  categorySlugReverseMap = new Map();

  private activeCollectionIds = new BehaviorSubject<Array<string>>([]);
  activeCollectionsIds$ = this.activeCollectionIds.asObservable();

  GET_ALL_COLLECTIONS = gql`
    query GetCollections{
      collections {
        totalItems
        items {
          id
          name
          slug
        }
      }
    }
  `

  constructor(
    private requestor: RequestorService
  ) {
    this.getAllCollections().subscribe((collections) => {
      collections.items.forEach((collection: any) => {
        this.categorySlugIdMap.set(collection.slug, collection.id);
        this.categorySlugReverseMap.set(collection.id, collection.slug);
      })
      this.setAllCollections(collections.items);
    })
  }

  private getAllCollections(): Observable<Query["collections"]> {
    return this.requestor.query(this.GET_ALL_COLLECTIONS)
      .pipe(map((res) => res.collections))
  }

  setAllCollections(collections: Array<any>) {
    this.allCollections.next(collections);
  }

  updateActiveCollections(collections: Array<any>) {
    this.activeCollectionIds.next(collections);
  }
}
