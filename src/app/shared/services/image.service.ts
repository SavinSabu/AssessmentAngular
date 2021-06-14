import { Injectable } from '@angular/core';
import * as EXIF from 'exif-js';
import { FileItem } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  compressImage(file, src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.setImgOrientation(file, src, img.width, img.height).then(x => {
          if (x.width < 250 || x.height <250) {
            rej("Image should have a minimum dimension 250x250.");
          } else {
            const rotatedimg = new Image();
            rotatedimg.src = x.imageUrl;
            rotatedimg.onload = () => {
              let wr = x.width / newX;
              let hr = x.height / newY;
              if (wr < hr) {
                newX = x.width / hr;
              } else {
                newY = x.height / wr;
              }
              const elem = document.createElement('canvas');
              elem.width = newX;
              elem.height = newY;
              const ctx = elem.getContext('2d');
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, elem.width, elem.height);
              ctx.drawImage(rotatedimg, 0, 0, newX, newY);
              const data = ctx.canvas.toDataURL('image/jpeg', 0.9);
              res(data);
            }
          }
        });
      }
      img.onerror = error => rej(error);
    })
  }
  setImgOrientation(file, inputBase64String, width, height) {
    return new Promise<any>((resolve, reject) => {
      const that = this;
      EXIF.getData(file, function () {
        if (this && this.exifdata && this.exifdata.Orientation) {
          that.resetOrientation(inputBase64String, this.exifdata.Orientation, function
            (resetBase64Image, width, height) {
            inputBase64String = resetBase64Image;
            resolve({ imageUrl: inputBase64String, width: width, height: height });
          });
        } else {
          resolve({ imageUrl: inputBase64String, width: width, height: height });
        }
      });
    });
  }

  resetOrientation(srcBase64, srcOrientation, callback) {
    const img = new Image();

    img.onload = function () {
      const width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL(), canvas.width, canvas.height);
    };

    img.src = srcBase64;
  }
}
