import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export class MemberShort{
  customer_id: string
}

@Injectable({
    providedIn: 'root',
  })
export class SystemService implements OnInit{
    public id:string = "";
    public memberFormTrigger = new Subject<any>();
    public memberFormPanelOpen = false;
    public familyTrigger = new Subject<any>();
    public treeRootTrigger = new BehaviorSubject<any>({head:'root'});
    public rootDataChange = new Subject<false|MemberShort>();
    public scrollTrigger = new Subject<'up'|'down'>();
    public scrollTopTrigger = new Subject<boolean>();
    public resetInifiniteScroll = new Subject<boolean>();
    constructor(){
    }
    ngOnInit() {
        
    }
}