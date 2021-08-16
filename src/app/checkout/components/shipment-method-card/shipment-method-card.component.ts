import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'gaushadhi-shipment-method-card',
  templateUrl: './shipment-method-card.component.html',
  styleUrls: ['./shipment-method-card.component.scss']
})
export class ShipmentMethodCardComponent implements OnInit {

  @Input() method: any;
  @Input() isSelected: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
