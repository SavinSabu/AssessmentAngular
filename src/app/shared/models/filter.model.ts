export enum filterclass {
    'yes',
    'no',
    'pending',
    'bad',
    'good'
}

export class filter{
    name:string;
    class: filterclass;
    active: boolean;
    val: string|number|false;
}

export class search {
    show: boolean = false;
    mode: string = "Triggered";
}