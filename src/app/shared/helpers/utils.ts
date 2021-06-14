import { FormGroup } from "@angular/forms";

export function getIndexBy(array: Array<{}>, { name, value }): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i][name] === value) {
      return i;
    }
  }
  return -1;
}

export function moveELement(array: Array<any>, from: number, to: number) {
  if (to >= array.length) {
    var k = to - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(to, 0, array.splice(from, 1)[0]);
}

export function markFormGroupTouched(form: FormGroup) {
  for (let inner in form.controls) {
    form.get(inner).markAsTouched();
    form.get(inner).updateValueAndValidity();
  }
}

export function supportsEmoji () {
  var ctx = document.createElement("canvas").getContext("2d");
  ctx.fillText("😗", -2, 4);
  return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
}