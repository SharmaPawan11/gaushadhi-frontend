import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'gaushadhi-checkout-stage-indicator',
  templateUrl: './checkout-stage-indicator.component.html',
  styleUrls: ['./checkout-stage-indicator.component.scss']
})
export class CheckoutStageIndicatorComponent implements OnInit {

  @Input() currentStage!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
