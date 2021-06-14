import { Component, EventEmitter, Input, Output } from '@angular/core';

import { speedDialAnimations } from './speed-dial.animations';

export interface DialButton {
  icon: string,
  tooltip: string,
  action: string
}

@Component({
  selector: 'speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: speedDialAnimations
})
export class SpeedDialComponent {

  @Input("buttons") dialButtons: DialButton[];
  @Output('dialClick') dialClick = new EventEmitter();

  buttons = [];
  dialTogglerState = 'inactive';

  constructor() { }

  private showItems() {
    this.dialTogglerState = 'active';
    this.buttons = this.dialButtons;
  }

  private hideItems() {
    this.dialTogglerState = 'inactive';
    this.buttons = [];
  }

  public onToggleDial() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  public onClickDial(btn: {icon: string}) {
    this.hideItems();
    this.dialClick.emit(btn);
  }
}