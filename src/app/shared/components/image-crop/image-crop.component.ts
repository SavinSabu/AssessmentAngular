import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import * as Croppie from 'croppie';
import { CroppieOptions, ResultOptions, CropData } from 'croppie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export type Type = 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas';
@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.css']
})
export class ImageCropComponent implements OnInit, AfterViewInit {
  @ViewChild('imageEdit') imageEdit: ElementRef;
  croppieOptions: CroppieOptions = { enforceBoundary: true, viewport: { height: 220, width: 220, type: 'circle' }, enableExif: true, boundary: { width: 220, height: 220 }, enableOrientation: true, mouseWheelZoom: false };
  points: number[] = [0, 0, 220, 220];
  outputFormatOptions: ResultOptions = { type: 'base64', size: 'viewport', format: "png", circle: false };
  defaultZoom = 1;
  orientation: 270 | 90 | 180 | -90 | -180 | -270;
  currentImage: any = false;
  private _croppie: Croppie;
  public imgUrl: string = "///dwwlkadlly1tq.cloudfront.net/image/site/cancel.png";
  constructor(
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.imgUrl = this.data.dp && this.data.dp.trim() != "" ? this.data.dp : this.imgUrl;
    this.orientation = 90;
  }

  ngAfterViewInit(): void {
    setTimeout(x => {
      this._croppie = new Croppie(this.imageEdit.nativeElement, this.croppieOptions);
      if (this.imgUrl.substr(0, 4) === 'http') {
        if (this._croppie) {
          this.bindToCroppie(this.imgUrl, [0, 0, 220, 220], this.defaultZoom);
        }
      } else {
        this.setupImage();
      }
    }, 1000);
  }

  private bindToCroppie(url: string, points: number[], zoom: number) {
    this._croppie.bind({ url, points, zoom });
  }

  newResult() {
    this._croppie.result(this.outputFormatOptions).then((res) => {
      this.currentImage = res;
    });
  }
  get(): CropData {
    return this._croppie.get();
  }
  rotate() {
    this._croppie.rotate(this.orientation);
  }
  imageUploadEvent(evt: any) {
    if (!evt.target) { return; }
    if (!evt.target.files) { return; }
    if (evt.target.files.length !== 1) { return; }
    const file = evt.target.files[0];
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif' && file.type !== 'image/jpg') { return; }
    const fr = new FileReader();
    fr.onloadend = (loadEvent) => {
      let url = fr.result.toString();
      if (this.imgUrl === url) { return; }
      this.imgUrl = url;
      this.setupImage();
    };
    fr.readAsDataURL(file);
  }

  setupImage() {
    let croppie = this;
    var image = new Image();
    image.src = this.imgUrl;
    image.onload = function () {
      if (image.width > image.height) {
        croppie.points[1] = 0;
        croppie.points[3] = image.height;
        croppie.points[0] = (image.width - image.height) / 2;
        croppie.points[2] = image.width - croppie.points[0];
      } else {
        croppie.points[0] = 0;
        croppie.points[2] = image.width;
        croppie.points[1] = (image.height - image.width) / 2;
        croppie.points[3] = image.height - croppie.points[1];
      }
      if (croppie._croppie) {
        croppie.bindToCroppie(croppie.imgUrl, croppie.points, croppie.defaultZoom);
      }
    };
  }

  saveImageFromCroppie() {
    this.dialogRef.close(this.currentImage);
  }
  onCancel() {
    this.dialogRef.close();
  }


}
