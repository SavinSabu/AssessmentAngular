import { Injectable, OnInit, OnDestroy } from '@angular/core';
declare var device: any;
import BackgroundGeolocation, {
    Location,
    ProviderChangeEvent,
    MotionActivityEvent,
    ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";
import { BehaviorSubject, of, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
@Injectable({
    providedIn: 'root'
})
export class LocationService implements OnDestroy {
    loginToken: string = "";
    isTracked: boolean = false;
    location: Location = { timestamp: '', odometer: 0, is_moving: false, uuid: '', coords: { latitude: 0, longitude: 0, accuracy: 0 }, battery: { is_charging: false, level: 0 }, activity: { activity: 'still', confidence: 0 } };
    activity: string = "Still";
    taskId: number = 0;
    trackingVia: string = "gps_fixed";
    locationTrigger = new BehaviorSubject(this.location);
    trackingViaTrigger = new BehaviorSubject(this.trackingVia);
    status = "";
    public configureBackgroundGeolocation(loginToken: string) {
        var scope = this;
        this.loginToken = loginToken;
        function ArgumentsToArray(args) {
            return [].slice.apply(args);
        }
        var bgGeo = BackgroundGeolocation;
        if (typeof window['cordova'] == 'undefined') {
            return;
        }
        function setLocationStatus(event: ProviderChangeEvent) {
            if (event.status == bgGeo.AUTHORIZATION_STATUS_ALWAYS || event.status == bgGeo.AUTHORIZATION_STATUS_WHEN_IN_USE) {
                if (event.gps) {
                    scope.status = "near_me";
                } else if (event.enabled) {
                    scope.status = "wifi_tethering";
                } else {
                    scope.status = "gps_off";
                }
            } else {
                scope.status = "error";
            }
            scope.trackingViaTrigger.next(scope.status);
        }
        bgGeo.getCurrentPosition({ timeout: 30, maximumAge: 100, desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH, samples: 5 }, function (location: any) {
            scope.location = location;
            scope.activity = location.activity.type;
            scope.locationTrigger.next(location);
        });
        bgGeo.getProviderState(function (event: ProviderChangeEvent) {
            setLocationStatus(event);
        })
        bgGeo.onConnectivityChange(function (event: ConnectivityChangeEvent) {
        })
        bgGeo.onActivityChange(function (event: MotionActivityEvent) {
            scope.activity = event.activity;
            scope.location.activity.activity = event.activity;
            scope.locationTrigger.next(scope.location);
        })
        bgGeo.onLocation(function (location: any) {
            scope.location = location;
            scope.activity = location.activity.type;
            scope.locationTrigger.next(location);
        });
        bgGeo.onMotionChange(function (event) {
            scope.activity = event.location.activity.activity;
            scope.location.activity.activity = event.location.activity.activity;
            scope.locationTrigger.next(scope.location);
        });
        bgGeo.onProviderChange(function (event) {
            setLocationStatus(event);
        });
        var config = {
            debug: false,
            logLevel: bgGeo.LOG_LEVEL_OFF,
            desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH,
            distanceFilter: 5,
            locationUpdateInterval: 5000,
            allowIdenticalLocations: false,
            url: 'https://trackdata.adharva.in/track/record',
            autoSync: true,
            stopOnTerminate: false,
            enableHeadless: true,
            foregroundService: true,
            notification: { title: "AHDTrack is tracking.", text: "Your locations is being tracked by ADHTrack." },
            heartbeatInterval: 30,
            elasticityMultiplier: 0.5,
            batchSync: true,
            maxDaysToPersist: 5,
            autoSyncThreshold: 5,
            startOnBoot: true,
            preventSuspend: true,
            stationaryRadius: 5,
            headers: {
                "X-MODULE": "tracking",
                "X-OPERATION": "track",
                "Authorization": `Bearer ${loginToken}`,
            },
            extras: {
                "cordova": device.cordova,
                "model": device.model,
                "platform": device.platform,
                "uuid": device.uuid,
                "version": device.version
            }
        };
        bgGeo.ready(config, function (state) {
            if (!state.enabled) {
                bgGeo.start().then(function () {
                });
            } else {
                bgGeo.configure(config, () => {
                });
            }
        });
        bgGeo.onHeartbeat((event) => {
            bgGeo.getCurrentPosition({
                samples: 1,
                persist: this.isTracked,
                extras: { "heart_beat": "yes" }
            }).then((location) => {
                scope.location = location;
                scope.activity = location.activity.activity;
                scope.locationTrigger.next(location);
            });
        });
        bgGeo.onHttp(event => {
            if (event.status == 401) {
                bgGeo.destroyLocations();
                bgGeo.stop();
            }
        })
    }
    public resetOdometer() {
        try {
            BackgroundGeolocation.resetOdometer(() => { })
        } catch (error) {

        }
    }
    public startTracking() {
        this.isTracked = true;
        BackgroundGeolocation.setConfig({
            persistMode: BackgroundGeolocation.PERSIST_MODE_ALL
        });
    }
    public stopTracking() {
        this.isTracked = false;
        BackgroundGeolocation.setConfig({
            persistMode: BackgroundGeolocation.PERSIST_MODE_NONE
        });
    }
    public stop() {
        try {
            var scope = this;
            if (this.taskId > 0)
                BackgroundGeolocation.stopBackgroundTask(this.taskId, () => {
                    scope.taskId = 0;
                })
            BackgroundGeolocation.stop();
        } catch (error) {

        }
    }
    public start() {
        try {
            var scope = this;
            this.startTracking();
            BackgroundGeolocation.getState(state => {
                if (!state.enabled) {
                    BackgroundGeolocation.start();
                }
            })
            if (this.taskId === 0)
                BackgroundGeolocation.startBackgroundTask((taskId) => {
                    scope.taskId = taskId;
                })
        } catch (error) {

        }
    }
    public getTrackingStatus() {
        let state;
        try {
            state = BackgroundGeolocation.getState();
        } catch (error) {
            state = new Promise((resolve, reject) => {
                resolve({ enable: true });
            });
        }
        return state;
    }
    ngOnDestroy() {

    }
}

