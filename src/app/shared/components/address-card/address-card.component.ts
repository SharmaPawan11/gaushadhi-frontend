import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gaushadhi-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent implements OnInit {
  // TODO: Update Default shipping and billing address when changed.
  @Input() address: any;
  @Input() isSelected: boolean = false;
  @Input() addNew: boolean = false;
  @Input() hoverFeedback = true;
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
