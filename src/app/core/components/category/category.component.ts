import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'gaushadhi-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.category = param.productCategory
      console.log(this.category)
      setTimeout(() => {
        this.router.navigate(['../gaming'], {
          relativeTo: this.route
        })
      }, 1000)
    })
  }

}
