import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoMeasure'
})
export class AutoMeasurePipe implements PipeTransform {
  measurements: any;

  transform(value: number, measument_type: string): string[] {
    let sign = "";
    measument_type = ["Volume", "Count"].includes(measument_type) ? measument_type : "Weight";
    let measurements = this.getMeasurements();
    let quantity = value ? value: null;
    sign = quantity < 0 ? "-" : "";
    quantity = quantity < 0 ? - quantity : quantity;
    this.measurements = measurements[measument_type];
    if(value && measurements) {
      let item = this.measurements.reduce((c,it) => { return it.divisor <= quantity && it.divisor >= c.divisor ? it : c; },{divisor: 1});
      let num = measument_type != 'Count' ? (Math.round(parseInt(quantity?.toString())/item.divisor)).toFixed(0) : quantity;
      return  item.divisor ? [sign, num , item.unit]: [value.toString()];
    } else {
      return [null, this.measurements && this.measurements.filter(x => x.default).length ? this.measurements.filter(x => x.default)[0].unit: null];
    }
  }

  getMeasurements(){
    return {
      "Weight": [{unit: "g", divisor: 1}, {unit: "kg", divisor: 1000}, {unit: "q", divisor: 100000, dafault: true}, {unit: "t", divisor: 1000000}],
      "Volume": [{unit: "ml", divisor: 1},{unit: "l", divisor: 1000, default: true}], 
      "Count": [{unit: "nos", divisor: 1, default: true}]}
  }

}
