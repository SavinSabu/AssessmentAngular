import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from './shared/models/app-config.model';
@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(
        private http: HttpClient,
    ) { }
    load() {
        const jsonFile = `assets/config/config.${environment.name}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
                AppConfig.settings = <IAppConfig>response;
                this.loadSettings();
                resolve();
            }).catch((response: any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
    loadSettings() {
        if (localStorage.getItem('token')) {
            AppConfig.settings.currentStoreDetails = JSON.parse(localStorage.getItem('currentStoreDetails'));
            // this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/settings/index", {}).subscribe(data => {
            //     AppConfig.settings.currentSettings = data.reduce((x, y) => {
            //         x[y.key.toLowerCase().trim().replace(/\s+/g, "_")] = y.val.reduce((a, b) => {
            //             a[b.setting_name] = b.setting_val;
            //             return a;
            //         }, {});
            //         return x;
            //     }, {});
            // });
        }
    }
}
