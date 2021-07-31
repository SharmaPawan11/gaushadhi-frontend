import { Injectable } from '@angular/core';
import { RequestorService } from './requestor.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private requestor: RequestorService) {}
}
