import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(
        private http: HttpClient) { }

    loadImage(fileItem: FileItem) {
        if (fileItem.file_type == "image") {
            let reader = new FileReader();
            reader.onload = function (e: any) {
                fileItem.dataUrl = reader.result.toString();
            }
            reader.readAsDataURL(fileItem.file);
        }
    }
    getUploadUrl(fileItem: FileItem) {
        const formData = new FormData();
        let extension = fileItem.file.type.replace(/.*\//, "");
        formData.append('extension', extension);
        formData.append('id', fileItem.id);
        formData.append('file_type', fileItem.file_type);
        formData.append('type', fileItem.file.type);
        return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/images/getUploadUrl", formData, {
            observe: 'events'
        });
    }

    uploadS3File(file: File, url) {
        return this.http.put(url, file,
            {
                headers: {
                    "Content-Type": file.type
                },
                reportProgress: true,
                observe: 'events'
            });
    }

    uploadImage(imageUrl, file_type, extension, id) {
        return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/images/postImage", { image: imageUrl, file_type: file_type, extension: extension, id: id }, { observe: 'events', reportProgress: true });
    }
}

export class FileItem {
    file: any;
    id: string;
    file_type: 'image' | 'video' | 'audio';
    perc?: number = 0;
    loaded?: boolean;
    error?: string;
    dataUrl?: string;
    quality?: number | 'full' = 'full';
}