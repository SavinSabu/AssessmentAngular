import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BootController } from 'app/boot-control';
var isCordovaImplementation = true;
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
declare var sc:any;
if (environment.production) {
  enableProdMode();
}
const bootstrap = () => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
    providers: [{provide: LOCALE_ID, useValue: 'en-US' }]
  }
  ).then(() => (<any>window).appBootstrap && (<any>window).appBootstrap())
  .catch(err => { }
  );
};

if (typeof window['cordova'] !== 'undefined') {
  document.addEventListener('deviceready', () => {
    bootstrap();
  }, false);
} else {
  bootstrap();
}

const boot = BootController.getbootControl().watchReboot().subscribe(() => bootstrap());