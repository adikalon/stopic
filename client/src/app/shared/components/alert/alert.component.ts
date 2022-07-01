import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() error: string | undefined;
  @Output() close = new EventEmitter<void>();

  async closeClick() {
    this.close.emit();
  }
}
