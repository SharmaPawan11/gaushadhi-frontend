import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gaushadhi-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent implements OnInit {
  // TODO: Update Default shipping and billing address when changed.
  @Input() address: any;

  constructor() {}

  ngOnInit(): void {}
}
