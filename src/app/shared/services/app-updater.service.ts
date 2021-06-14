import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AppConfirmService } from './app-confirm/app-confirm.service';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate,
    private confirm: AppConfirmService) {
    this.updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });
  }
  showAppUpdateAlert() {
    const header = 'App Updated reload to apply';
    this.confirm.confirm({title:header, message: "A customer portfolio web page.", ok:"Apply"}).subscribe(
      x => {
        if(x){
          this.doAppUpdate();
        }
      }
    )
  }
  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}